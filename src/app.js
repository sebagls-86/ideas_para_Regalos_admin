// App.js
import React, { useContext } from "react";
import { TokenContext } from "./contexts/TokenContext";
import { TokenProvider } from "./contexts/TokenContext";
import PrivateRoute from "./contexts/PrivateRoutes";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RtlLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";

const App = () => {
  const { isAuthenticated, token } = useContext(TokenContext);
  console.log("token en app", token);

  return (
    <ChakraProvider theme={theme}>
      <ThemeEditorProvider>
        <TokenProvider>
          <HashRouter>
            <Switch>
              <Route path="/auth" component={AuthLayout} />
              <PrivateRoute path="/admin" component={AdminLayout} />
              <Route path="/rtl" component={RtlLayout} />
              <Route
                path="/"
                render={() =>
                  isAuthenticated ? (
                    <Redirect to="/admin" />
                  ) : (
                    <Redirect to="/auth/login" />
                  )
                }
              />
            </Switch>
          </HashRouter>
        </TokenProvider>
      </ThemeEditorProvider>
    </ChakraProvider>
  );
};

export default App;
