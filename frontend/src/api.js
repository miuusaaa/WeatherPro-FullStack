import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Otomatik olarak her isteğe token ekleyen interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (email, password) => {
  const response = await api.post('/register', { email, password });
  return response.data;
};

export const loginUser = async (email, password) => {
  // FastAPI'nin OAuth2PasswordRequestForm yapısı "form-data" bekler
  const formData = new URLSearchParams();
  formData.append('username', email); // username alanına email gönderiyoruz
  formData.append('password', password);

  const response = await api.post('/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const getWeather = async (query) => {
  const response = await api.get(`/weather?q=${query}`);
  return response.data;
};

export const searchCities = async (query) => {
  const response = await api.get(`/search?q=${query}`);
  return response.data;
};

export const saveFavorite = async (city) => {
  const response = await api.post(`/favorite`, { city });
  return response.data;
};

export const getFavorite = async () => {
  const response = await api.get(`/favorite`);
  return response.data;
};

export default api;
