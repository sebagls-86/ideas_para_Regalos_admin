import React, { createContext, useEffect, useState, useCallback } from 'react';

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastVisitedRoute, setLastVisitedRoute] = useState('/');
  const [loading, setLoading] = useState(true); // Initialize loading state

  const checkAuth = useCallback(() => {
    return new Promise((resolve, reject) => {
      try {
        const userToken = localStorage.getItem('token');
        if (userToken) {
          setToken(userToken);
          setIsAuthenticated(true);
        } else {
          setToken('');
          setIsAuthenticated(false);
        }
        resolve(); // Resolve the promise
      } catch (error) {
        console.error('Error al leer el token del localStorage:', error);
        setToken('');
        setIsAuthenticated(false);
        reject(error); // Reject the promise in case of an error
      }
    });
  }, []);

  const updateToken = (newToken) => {
    try {
      setToken(newToken);
      if (newToken) {
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error al escribir el token en el localStorage:', error);
    }
  };

  const logout = () => {
    try {
      setToken('');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al limpiar el token del localStorage:', error);
    }
  };

  const updateLastVisitedRoute = useCallback((route) => {
    setLastVisitedRoute(route);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth();
        setLoading(false);
      } catch (error) {
        console.error('Error en checkAuth:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [checkAuth, setLoading]);

  if (loading) {
    return <div>Cargando...</div>;
  }


  return (
    <TokenContext.Provider value={{ token, updateToken, isAuthenticated, logout, lastVisitedRoute, updateLastVisitedRoute }}>
      {children}
    </TokenContext.Provider>
  );
};
