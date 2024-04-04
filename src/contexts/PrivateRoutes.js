import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  console.log("isAuthenticated private route", isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/auth/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
