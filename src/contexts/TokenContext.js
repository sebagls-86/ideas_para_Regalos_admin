import React, { createContext, useState } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      setToken(userToken);
      setIsAuthenticated(true);
    }
  };

  // Ejecutar checkAuth al inicio para establecer los valores iniciales
  useState(() => {
    checkAuth();
  }, []);

  return (
    <TokenContext.Provider value={{ token, setToken, isAuthenticated, setIsAuthenticated }}>
      {children}
    </TokenContext.Provider>
  );
};