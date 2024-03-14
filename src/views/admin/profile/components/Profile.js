import React, { useEffect, useState } from "react";
import { useColorModeValue, Text } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import ProfileAvatar from "./ProfileAvatar";
import ProfileBanner from "./ProfileBanner";
import { useHistory } from "react-router-dom";
import useFeedbackModal from "components/modals/feedbackModal";

const Banner = () => {
  const token = localStorage.getItem("token");
  const [userData, setUserData] = useState(null);
  const userInfoString = localStorage.getItem("userInfo");
  const userInfo = JSON.parse(userInfoString);
  const userId = userInfo.data.user_id;
  const history = useHistory();
  const { openFeedbackModal, FeedbackModal: FeedbackModalComponent } =
  useFeedbackModal();

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
            openFeedbackModal("Error en la solicitud");
          }
        } catch (error) {
          history.replace("/error");
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
      history.replace("/error");
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
        bannerURL={userData?.banner}
        onConfirm={handleBannerConfirm}
      />
       <FeedbackModalComponent />
      <ProfileAvatar
        avatarURL={userData?.avatar}
        onConfirm={handleAvatarConfirm}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {`${userData?.name} ${userData?.last_name}`}
      </Text>
    </Card>
  );
};

export default Banner;
