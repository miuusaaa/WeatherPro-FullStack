import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); // Giriş başarılı olunca Dashboard'a yönlendir
    } catch (err) {
      setError(err.response?.data?.detail || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="brand-header">
          <span className="brand-icon">🌤️</span>
          <h1 className="title glow-text">WeatherPro</h1>
        </div>
        <p className="subtitle">Dünyanın havası parmaklarının ucunda.<br/>Devam etmek için giriş yap.</p>
        
        {error && <div className="error-msg animated-error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="email" 
            className="input-field" 
            placeholder="Email adresi" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            className="input-field" 
            placeholder="Şifre" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Lütfen bekleyin...' : 'Giriş Yap'}
        </button>
      </form>
            <div className="toggle-text">
          Hesabın yok mu? <Link to="/register">Hemen Kayıt Ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
