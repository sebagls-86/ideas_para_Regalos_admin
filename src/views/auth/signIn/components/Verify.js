import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import configJson from "../../auth_config.json";

function Verify() {
  const [loading, setLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { getAccessTokenWithPopup } = useAuth0();
  const history = useHistory();
  const audience = configJson.audience;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setAccessToken(storedToken);
      setTokenExists(true);
      
    }
  }, []);

  console.log("verify")

  useEffect(() => {
    console.log("ejecutando")
    const getUserInfo = async () => {
      try {
        const accessToken = await getAccessTokenWithPopup({
          audience: audience,
          scope: "read:current_user",
        });

        console.log("accessToken", accessToken);

        const response = await fetch(
          `http://localhost:8080/api/v1/users/verify`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const userData = await response.json();

        if (userData.user_role >= 1 && userData.user_role <= 3) {
          setAccessToken(accessToken);
          localStorage.setItem("token", accessToken);
          history.push("/admin/default");
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error.message);
        setLoading(false);
      }
    };

    if (!accessToken) {
      getUserInfo();
    }
    getUserInfo(); // Ejecutar siempre que se monte la página Verify
  }, [getAccessTokenWithPopup, audience, history, accessToken]);

  if (!tokenExists) {
    setLoading(true);
  }

  return (
    <div>
      {loading && <div>Loading ...</div>}
      {!loading && <div></div>}
    </div>
  );
}

export default Verify;
