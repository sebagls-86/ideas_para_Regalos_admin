import React, { useContext, useEffect, useState } from 'react';
import { TokenContext } from './contexts/TokenContext';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setToken } = useContext(TokenContext);

  useEffect(() => {
    const checkAuth = () => {
      const userToken = localStorage.getItem('token');
      if (userToken) {
        setToken(userToken);
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [setToken, setIsAuthenticated]);

  return (
    <ChakraProvider theme={theme}>
      <ThemeEditorProvider>
        <HashRouter>
          <Switch>
            <Route path="/auth" component={AuthLayout} />
            <Route path="/admin" component={AdminLayout} />
            <Route path="/rtl" component={RtlLayout} />
            <Route
              path="/"
              render={() => (isAuthenticated ? <Redirect to="/admin" /> : <Redirect to="/auth/login" />)}
            />
          </Switch>
        </HashRouter>
      </ThemeEditorProvider>
    </ChakraProvider>
  );
};

export default App;