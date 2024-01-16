import React, { createContext, useEffect, useState } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const userToken = localStorage.getItem('token');
    if (userToken) {
      setToken(userToken);
      setIsAuthenticated(true);
    } else {
      setToken('');
      setIsAuthenticated(false);
    }
  };

  const updateToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <TokenContext.Provider value={{ token, updateToken, isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </TokenContext.Provider>
  );
};
