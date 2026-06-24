import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getWeather, searchCities, saveFavorite, getFavorite } from '../api';

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  const [query, setQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // AutoComplete States
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Favorite State
  const [favoriteCity, setFavoriteCity] = useState(null);

  // Sayfa yüklendiğinde favori şehri getir ve otomatik yükle
  useEffect(() => {
    const loadFavorite = async () => {
      try {
        const data = await getFavorite();
        if (data.favorite_city) {
          setFavoriteCity(data.favorite_city);
          fetchWeather(data.favorite_city);
        }
      } catch (err) {
        console.error("Favori şehir alınamadı:", err);
      }
    };
    loadFavorite();
  }, []);

  // Sıcaklığa göre arka plan resmini getiren fonksiyon
  const getBackgroundImage = (temp) => {
    // 0 derece ve altı (Dondurucu/Karlı)
    if (temp <= 0) {
      return 'https://picsum.photos/id/1036/2000/1200'; // Karlı/Buzlu Dağ
    }
    // 1 ile 15 derece arası (Soğuk/Serin/Sonbahar)
    if (temp > 0 && temp <= 15) {
      return 'https://picsum.photos/id/1018/2000/1200'; // Doğa/Orman
    }
    // 16 ile 25 derece arası (Ilık/Bahar)
    if (temp > 15 && temp <= 25) {
      return 'https://picsum.photos/id/1015/2000/1200'; // Ilık Vadi/Güneş
    }
    // 25 dereceden büyük (Sıcak/Yaz/Plaj)
    if (temp > 25) {
      return 'https://picsum.photos/id/1035/2000/1200'; // Şelale/Yaz
    }

    // Varsayılan
    return 'https://picsum.photos/id/122/2000/1200'; // Gece Şehri
  };

  useEffect(() => {
    if (weatherData) {
      const temp = weatherData.current.temp_c;
      const imageUrl = getBackgroundImage(temp);
      document.body.style.backgroundImage = `url('${imageUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }, [weatherData]);

  // Cleanup: Component unmount olduğunda varsayılan arka plana dön
  useEffect(() => {
    return () => {
      document.body.style.backgroundImage = "url('https://picsum.photos/id/122/2000/1200')";
    };
  }, []);

  // Debounce mekanizması: Kullanıcı yazmayı bıraktıktan 500ms sonra arama yap
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        try {
          const results = await searchCities(query);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (err) {
          console.error("Arama hatası:", err);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Dışarıya tıklandığında dropdown'u kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchWeather = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setError('');
    setLoading(true);
    try {
      const data = await getWeather(searchQuery);
      setWeatherData(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Hava durumu alınamadı. Lütfen kontrol edin.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Artık Enter'a basıp serbest metin aratmak yasak. Dropdown'dan seçilmeli.
    if (searchResults.length > 0) {
      // Enter'a basarsa ilk sonucu otomatik seçebiliriz
      handleSelectCity(searchResults[0].lat, searchResults[0].lon, searchResults[0].name);
    }
  };

  const handleSelectCity = (lat, lon, name) => {
    setQuery(name);
    setShowDropdown(false);
    fetchWeather(`${lat},${lon}`);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      (err) => {
        setError('Konum alınamadı, lütfen izinleri kontrol edin.');
        setLoading(false);
      }
    );
  };

  const handleSaveFavorite = async () => {
    if (!weatherData) return;
    const currentLatLon = `${weatherData.location.lat},${weatherData.location.lon}`;
    try {
      await saveFavorite(currentLatLon);
      setFavoriteCity(currentLatLon);
    } catch (err) {
      console.error("Favori kaydedilemedi:", err);
    }
  };

  // Tarihi formatlamak için küçük bir yardımcı fonksiyon
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', options);
  };

  return (
    <div className="dashboard-container">
      <div className="glass-card weather-dashboard">
        <h1 className="title glow-text">Hava Durumu Keşfi</h1>
        <p className="subtitle">Şehir aratın veya konumunuzu kullanın.</p>

        <div className="search-container" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              className="input-field search-input"
              placeholder="Şehir adı yaz ve listeden seç (Örn: Istanbul)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowDropdown(true); }}
            />
            {/* Ara butonu kaldırıldı. Kullanıcı dropdown'dan seçmek zorunda */}
            <button type="button" onClick={handleGetLocation} className="btn location-btn" disabled={loading} title="Konumumu Kullan">
              📍 Konumumu kullan
            </button>
          </form>

          {/* AutoComplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <ul className="autocomplete-dropdown glass-panel">
              {searchResults.map((city) => (
                <li key={city.id} className="dropdown-item" onClick={() => handleSelectCity(city.lat, city.lon, city.name)}>
                  <span className="city-name">{city.name}</span>
                  <span className="city-region">{city.region ? `${city.region}, ` : ''}{city.country}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <div className="error-msg animated-error">{error}</div>}

        {weatherData && !loading && (
          <div className="weather-info fade-in-up">
            <div className="current-weather">
              <img
                src={weatherData.current.condition.icon.replace('64x64', '128x128')}
                alt="Weather Icon"
                className="weather-icon-large floating-animation"
              />
              <div className="temperature-container">
                <span className="temperature">{weatherData.current.temp_c}°</span>
                <span className="condition">{weatherData.current.condition.text}</span>
              </div>
            </div>

            <div className="location-header">
              <h2 className="location-name">📍 {weatherData.location.name}, {weatherData.location.country}</h2>
              <button 
                className={`favorite-btn ${favoriteCity === `${weatherData.location.lat},${weatherData.location.lon}` ? 'is-favorite' : ''}`}
                onClick={handleSaveFavorite}
                title="Bu konumu favori yap (Girişte otomatik açılır)"
              >
                ⭐
              </button>
            </div>

            <div className="weather-details glass-panel">
              <div className="detail-box">
                <div className="detail-label">Rüzgar</div>
                <div className="detail-value">{weatherData.current.wind_kph} <span className="unit">km/s</span></div>
              </div>
              <div className="detail-box">
                <div className="detail-label">Nem</div>
                <div className="detail-value">%{weatherData.current.humidity}</div>
              </div>
              <div className="detail-box">
                <div className="detail-label">Hissedilen</div>
                <div className="detail-value">{weatherData.current.feelslike_c}°</div>
              </div>
              <div className="detail-box">
                <div className="detail-label">Saat</div>
                <div className="detail-value">{weatherData.location.localtime.split(' ')[1]}</div>
              </div>
            </div>

            {/* 10 Günlük (veya API'nin verdiği kadar) Tahmin */}
            {weatherData.forecast && weatherData.forecast.forecastday && (
              <div className="forecast-section">
                <h3 className="forecast-title">5 Günlük Tahmin</h3>
                <div className="forecast-scroll">
                  {weatherData.forecast.forecastday.map((day, index) => (
                    <div key={index} className="forecast-card glass-panel">
                      <div className="forecast-date">{index === 0 ? 'Bugün' : formatDate(day.date)}</div>
                      <img src={day.day.condition.icon.replace('64x64', '128x128')} alt="icon" className="forecast-icon" />
                      <div className="forecast-temps">
                        <span className="max-temp">{Math.round(day.day.maxtemp_c)}°</span>
                        <span className="min-temp">{Math.round(day.day.mintemp_c)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={logout} className="btn logout-btn">Çıkış Yap</button>
      </div>
    </div>
  );
};

export default Dashboard;
