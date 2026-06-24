import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(email, password);
      setSuccess('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
      setTimeout(() => {
        navigate('/login'); // 2 saniye sonra login'e yönlendir
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div className="brand-header">
          <span className="brand-icon">🌍</span>
          <h1 className="title glow-text">WeatherPro</h1>
        </div>
        <p className="subtitle">Hemen ücretsiz bir hesap oluştur ve havayı keşfet.</p>
        
        {error && <div className="error-msg animated-error">{error}</div>}
      {success && <div style={{color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.2)'}}>{success}</div>}
      
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
          {loading ? 'Lütfen bekleyin...' : 'Kayıt Ol'}
        </button>
      </form>
      
      <div className="toggle-text">
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </div>
      </div>
    </div>
  );
};

export default Register;
