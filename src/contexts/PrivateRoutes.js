import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { TokenContext } from "contexts/TokenContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useContext(TokenContext);

  console.log("isAuthenticated", isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
