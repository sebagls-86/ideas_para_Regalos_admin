import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import ErrorLayout from "views/error/ErrorPage";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";

const App = () => {
  const token = localStorage.getItem("token");

  const hasRequiredPermissions = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userRole = userInfo && userInfo.data ? userInfo.data.user_role : null;
    return token && userRole >= 1 && userRole <= 3;
  };

  return (
    <ChakraProvider theme={theme}>
      <ThemeEditorProvider>
        <Router>
          <Switch>
            <Route path="/auth/sign-in">
              {token && localStorage.getItem("userInfo") ? (
                <Redirect to="/admin/default" />
              ) : (
                <AuthLayout />
              )}
            </Route>
            <Route path="/admin">
              {hasRequiredPermissions() ? (
                <AdminLayout />
              ) : (
                <Redirect to="/auth/sign-in" />
              )}
            </Route>
            <Route path="/error" component={ErrorLayout} />
            <Redirect to="/auth/sign-in" />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </ChakraProvider>
  );
};

export default App;
