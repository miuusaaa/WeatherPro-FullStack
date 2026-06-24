# 🌤️ WeatherPro Full-Stack Dashboard

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A modern, highly interactive full-stack weather application with dynamic backgrounds, smart city auto-completion, and a secure user authentication system.

## ✨ Features

- **JWT Authentication:** Secure user registration and login system.
- **Personalized Experience:** Users can save their favorite city, which loads automatically upon their next login.
- **Smart Auto-Complete:** Debounced search dropdown that hits real-time location APIs to prevent typos and invalid city entries.
- **Dynamic Glassmorphism UI:** Premium Apple-style deep blur glass effects with CSS animations.
- **Temperature-Based Backgrounds:** The background image changes dynamically based on the current temperature of the selected city (Freezing, Cold, Mild, Hot).
- **5-Day Forecast:** Horizontal scrollable forecast cards for upcoming days.
- **Geolocation Support:** Fetches weather based on the user's active GPS coordinates with a single click.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)** for lightning-fast development and optimized builds.
- **Context API** for global state management (Authentication).
- **React Router DOM** for protected routing.
- **Vanilla CSS** with advanced Glassmorphism 2.0 and keyframe animations.

### Backend
- **FastAPI** (Python) for ultra-fast, async RESTful API endpoints.
- **PostgreSQL** for relational database management.
- **SQLAlchemy** (ORM) for database interactions.
- **PassLib (Bcrypt)** & **Jose (JWT)** for secure password hashing and token generation.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- PostgreSQL

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Activate virtual environment
# Windows: .venv\Scripts\activate
# Mac/Linux: source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📸 Screenshots
<img width="1916" height="906" alt="image" src="https://github.com/user-attachments/assets/6adfcdf7-5443-4a08-a758-64772f67dc74" />
<img width="1905" height="915" alt="image" src="https://github.com/user-attachments/assets/8a9a1dfd-3ff0-4ca6-af23-39a04d82330d" />
<img width="1907" height="913" alt="image" src="https://github.com/user-attachments/assets/731d6229-13ad-49ea-92b0-e083fdc8aeab" />
<img width="1327" height="712" alt="image" src="https://github.com/user-attachments/assets/8883af3f-1728-47a4-bc92-f429f3120f23" />



