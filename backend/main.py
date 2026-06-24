from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import auth
from database import engine, get_db
from fastapi.security import OAuth2PasswordRequestForm

# Uygulama başlarken models.py içindeki tüm tabloları PostgreSQL'de otomatik oluşturur
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Weather Full-Stack API", version="1.0")

# CORS ayarları: Frontend'in backend'e erişmesine izin verir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Tüm domainlere izin veriyoruz (Geliştirme aşamasında)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Başarılı", "message": "FastAPI ve PostgreSQL bağlantısı kuruldu, tablolar hazır!"}

# --- KAYIT OLMA (REGISTER) UÇ NOKTASI ---
@app.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Email daha önce kaydedilmiş mi kontrol et
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Bu email adresi zaten kayıtlı.")
    
    # 2. Şifreyi hash'le ve veritabanı modeli olarak yeni kullanıcıyı oluştur
    hashed_pwd = auth.hash_password(user.password)
    new_user = models.User(email=user.email, hashed_password=hashed_pwd)
    
    # 3. Veritabanına kaydet
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # ID'nin atanması için yeniliyoruz
    
    return {"message": "Kullanıcı başarıyla oluşturuldu.", "email": new_user.email}

# --- GİRİŞ YAPMA (LOGIN) UÇ NOKTASI ---
@app.post("/login")
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Swagger UI'daki username alanını email olarak kullanıyoruz
    db_user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not db_user or not auth.verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Hatalı email veya şifre"
        )
    
    access_token = auth.create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- HAVA DURUMU UÇ NOKTASI (SADECE GİRİŞ YAPANLAR İÇİN) ---
@app.get("/weather")
async def get_weather(q: str, current_user: str = Depends(auth.get_current_user)):
    # DİKKAT: Buraya weatherapi.com'dan aldığın kendi anahtarını kopyalamalısın.
    import httpx
    WEATHER_API_KEY = "afd91879da3348e38fb110425262206" 
    
    # 10 günlük tahmin (forecast.json) için URL'yi güncelledik.
    url = f"http://api.weatherapi.com/v1/forecast.json?key={WEATHER_API_KEY}&q={q}&days=10&aqi=no&alerts=no"
    
    # httpx ile dışarıdaki WeatherAPI'ye asenkron istek atıyoruz
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Hava durumu alınamadı, konumu kontrol et.")
        
    return response.json()

# --- ŞEHİR ARAMA (AUTOCOMPLETE) UÇ NOKTASI ---
@app.get("/search")
async def search_city(q: str, current_user: str = Depends(auth.get_current_user)):
    if len(q) < 3:
        return []
        
    import httpx
    WEATHER_API_KEY = "afd91879da3348e38fb110425262206"
    
    url = f"http://api.weatherapi.com/v1/search.json?key={WEATHER_API_KEY}&q={q}"
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
    if response.status_code != 200:
        return []
        
    return response.json()

# --- FAVORİ ŞEHİR UÇ NOKTALARI ---

from pydantic import BaseModel
class FavoriteCityRequest(BaseModel):
    city: str

@app.post("/favorite")
def set_favorite_city(request: FavoriteCityRequest, current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    db_user.favorite_city = request.city
    db.commit()
    return {"message": "Favori şehir kaydedildi", "favorite_city": request.city}

@app.get("/favorite")
def get_favorite_city(current_user: str = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == current_user).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    return {"favorite_city": db_user.favorite_city}
