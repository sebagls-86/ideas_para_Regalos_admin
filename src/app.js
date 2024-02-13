// App.js
import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "./contexts/TokenContext";
import { TokenProvider } from "./contexts/TokenContext";
import PrivateRoute from "./contexts/PrivateRoutes";
import "assets/css/App.css";
//import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";
import "./assets/css/Spinner.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: white;
`;

const App = () => {
  const { isAuthenticated, lastVisitedRoute, checkAuth } =
    useContext(TokenContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth();
        setLoading(false);
      } catch (error) {
        console.error("Error en checkAuth:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="cargando">
        <ClipLoader
          color={"white"}
          loading={loading}
          css={override}
          size={150}
        />
      </div>
    );
  }

  return (
    <TokenProvider>
      <ChakraProvider theme={theme}>
        <ThemeEditorProvider>
          <Router>
            <Switch>
              <Route path="/auth" component={AuthLayout} />
              {isAuthenticated ? (
                lastVisitedRoute === "/auth/login" ? (
                  <Redirect to="/admin" />
                ) : (
                  <PrivateRoute path="/admin" component={AdminLayout} />
                )
              ) : (
                <Redirect to="/auth/login" />
              )}
              <Route
                path="/"
                render={() => <Redirect to={lastVisitedRoute || "/admin"} />}
              />
            </Switch>
          </Router>
        </ThemeEditorProvider>
      </ChakraProvider>
    </TokenProvider>
  );
};

export default App;
