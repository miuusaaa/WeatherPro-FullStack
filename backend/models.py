from sqlalchemy import Column, Integer, String
from database import Base

# Bu sınıf PostgreSQL'de otomatik olarak 'users' adında bir tabloya dönüşecek
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False) # Şifreleri güvenlik için maskeli tutacağız
    favorite_city = Column(String, nullable=True)     # Kullanıcının favori şehri