import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth0();
  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated || (token && userInfo)) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/auth/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
