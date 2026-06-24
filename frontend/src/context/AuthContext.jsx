import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.access_token);
    localStorage.setItem('token', data.access_token);
  };

  const register = async (email, password) => {
    await registerUser(email, password);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
