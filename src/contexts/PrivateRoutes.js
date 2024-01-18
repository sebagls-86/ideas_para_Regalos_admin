import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { TokenContext } from "contexts/TokenContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, updateLastVisitedRoute } = useContext(TokenContext);

  console.log("isAuthenticated private route", isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
         updateLastVisitedRoute(props.location.pathname);
          return <Redirect to="/auth/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
