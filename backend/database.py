from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# PostgreSQL Bağlantı Cümlesi (Connection String)
# NOT: Buradaki 'ŞİFRENİZ' kısmını kendi PostgreSQL şifrenle değiştireceksin.
DATABASE_URL = "postgresql://postgres:combat123@localhost:5432/WeatherFastApiDb"

# Veri tabanı motorunu (engine) oluşturuyoruz
engine = create_engine(DATABASE_URL)

# Veri tabanı işlemlerini yöneteceğimiz oturum (Session) fabrikası
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# İleride oluşturacağımız tabloların (Modellerin) türeyeceği ana sınıf
Base = declarative_base()

# Her API isteğinde veri tabanı bağlantısını açıp, işi bitince kapatan yardımcı fonksiyon
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
