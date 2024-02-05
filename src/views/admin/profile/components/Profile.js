import React, { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import { useColorModeValue, Text } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { jwtDecode } from "jwt-decode";
import ProfileAvatar from "./ProfileAvatar";
import ProfileBanner from "./ProfileBanner";

const Banner = () => {
  const { token } = useContext(TokenContext);
  const [userData, setUserData] = useState(null);

  const baseURL = "http://localhost:8080";
  const avatarURL = userData?.avatar;
  const bannerURL = userData?.banner;

  const absoluteAvatarURL = `${baseURL}${avatarURL}`;
  const absoluteBannerURL = `${baseURL}${bannerURL}`;

  const decoded = jwtDecode(token);
  const userId = decoded.user_id;

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUserData(data?.data);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, userId]);

  const handleAvatarConfirm = async (newAvatarFile) => {
    try {
      const formData = new FormData();
      formData.append("avatar", newAvatarFile);

      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      window.location.reload();
      console.error("Error en la solicitud PATCH para el avatar:", error);
    }
  };

  const handleBannerConfirm = async (newBannerFile) => {
    try {
      const formData = new FormData();
      formData.append("banner", newBannerFile);

      const response = await fetch(
        `http://localhost:8080/api/v1/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        window.location.reload();
      }
    } catch (error) {
      window.location.reload();
      console.error("Error en la solicitud PATCH para el banner:", error);
    }
  };

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <ProfileBanner
        bannerURL={absoluteBannerURL}
        onConfirm={handleBannerConfirm}
      />
      <ProfileAvatar
        avatarURL={absoluteAvatarURL}
        onConfirm={handleAvatarConfirm}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {`${userData?.name} ${userData?.last_name}`}
      </Text>
    </Card>
  );
};

export default Banner;
