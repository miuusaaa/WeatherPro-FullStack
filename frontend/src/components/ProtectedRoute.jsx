import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // Token yoksa giriş sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Token varsa içeriği göster
  return children;
};

export default ProtectedRoute;
