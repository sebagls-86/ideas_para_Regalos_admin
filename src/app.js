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

  // Función para verificar si el usuario tiene los permisos adecuados
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
            {/* Rutas de autenticación */}
            <Route path="/auth/sign-in">
              {/* Verificar si el usuario tiene token y userInfo */}
              {token && localStorage.getItem("userInfo") ? (
                // Si tiene token y userInfo, redirigir a la página de administrador
                <Redirect to="/admin/default" />
              ) : (
                // Si no tiene token o userInfo, mostrar la página de inicio de sesión
                <AuthLayout />
              )}
            </Route>
            {/* Rutas protegidas de administrador */}
            <Route path="/admin">
              {hasRequiredPermissions() ? (
                <AdminLayout />
              ) : (
                <Redirect to="/auth/sign-in" />
              )}
            </Route>
            <Route path="/error" component={ErrorLayout} />
            {/* Redirección por defecto */}
            <Redirect to="/auth/sign-in" />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </ChakraProvider>
  );
};

export default App;
