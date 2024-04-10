// App.js
import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import ErrorLayout from "views/error/ErrorPage";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { isAuthenticated } = useAuth0();
  const token = localStorage.getItem("token");

  console.log("isAuthenticated", isAuthenticated);
  console.log("token", token);

  // Componente de enrutamiento protegido para rutas de administrador
  const AdminRoute = ({ component: Component, path, ...rest }) => (
    <Route
      {...rest}
      render={(props) => {
        const isAuthenticated = localStorage.getItem("token") !== null;
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userRole = userInfo && userInfo.data ? userInfo.data.user_role : null;
  
        if ((isAuthenticated && userRole >= 1 && userRole <= 3) || path.startsWith("/admin")) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/auth" />;
        }
      }}
    />
  );

  return (
    <ChakraProvider theme={theme}>
      <ThemeEditorProvider>
        <Router>
          <Switch>
            {/* Rutas de autenticación */}
            <Route path="/auth" component={AuthLayout} />
            {/* Ruta de inicio de sesión */}
            <Route path="/admin/default" component={AdminLayout} />
            {/* Rutas protegidas de administrador */}
            <AdminRoute path="/admin" component={AdminLayout} />
            <AdminRoute path="/error" component={ErrorLayout} />
            {/* Redirección por defecto */}
            <Redirect to="/auth" />
          </Switch>
        </Router>
      </ThemeEditorProvider>
    </ChakraProvider>
  );
};

export default App;
