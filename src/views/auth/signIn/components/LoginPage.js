import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustrationLight from "assets/img/logoIdeasParaRegalos.png";
import illustrationDark from "assets/img/logoIdeasParaRegalosDark.png";
import { useAuth0 } from "@auth0/auth0-react";
import configJson from "../../../../auth_config.json";
import useFeedbackModal from "../../../../components/modals/feedbackModal";

function SignIn() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [tokenExists, setTokenExists] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal: FeedbackModalComponent } =
    useFeedbackModal();
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenWithPopup,
    getAccessTokenSilently,
  } = useAuth0();
  const audience = configJson.audience;
  const API_URL = process.env.REACT_APP_API_URL;

  const textColor = useColorModeValue(
    isDarkMode ? "white" : "navy.700",
    "white"
  );

  const handleCloseServerErrorModal = () => {
    setShowServerErrorModal(false);
  };

  const illustration = isDarkMode ? illustrationDark : illustrationLight;

  useEffect(() => {
    const fetchTokenAndVerifyUser = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken && isAuthenticated) {
          setIsLoading(true);

          let newAccessToken;
          if (process.env.NODE_ENV === "development") {
            newAccessToken = await getAccessTokenWithPopup({
              authorizationParams: {
                audience: audience,
                scope: "read:current_user",
              },
            });
          } else {
            newAccessToken = await getAccessTokenSilently({
              authorizationParams: {
                audience: audience,
                scope: "read:current_user",
              },
            });
          }

          setAccessToken(newAccessToken);
          localStorage.setItem("token", newAccessToken);
          setTokenExists(true);

          let verifyUserCompleted = false;

          const timeoutId = setTimeout(() => {
            if (!verifyUserCompleted) {
              localStorage.removeItem("token");
              const userInfoFromStorage = localStorage.getItem("userInfo");
              if (!userInfoFromStorage) {
                setIsLoading(false);
                logout({
                  logoutParams: {
                    returnTo: process.env.REACT_APP_REDIRECT_LOGOUT,
                  },
                });
              }
            }
          }, 5000);

          try {
            await verifyUser(newAccessToken);
            setTokenExists(true);
            setIsLoading(false);
            verifyUserCompleted = true;
            clearTimeout(timeoutId);
            const userData = localStorage.getItem("userInfo");
            setUserInfo(userData);
          } catch (error) {
            console.error("Error verifying user:", error.message);
            setIsLoading(false);
            if (error.message === "unauthorized user") {
              openFeedbackModal("Usuario no autorizado");
            }
            if ((error.message === "Failed to verify user") || (error.message === "Failed to fetch")) {
              openFeedbackModal("Intente nuevamente mas tarde");
            }
            setTimeout(() => {}, 3000);
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            logout({
              logoutParams: { returnTo: process.env.REACT_APP_REDIRECT_LOGOUT },
            });
          }
          const userData = localStorage.getItem("userInfo");
          setUserInfo(userData);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error fetching token:", error.message);
        setIsLoading(false);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        logout({
          logoutParams: { returnTo: process.env.REACT_APP_REDIRECT_LOGOUT },
        });
      }
    };

    if (!tokenExists) {
      fetchTokenAndVerifyUser();
    }
  }, [tokenExists, isAuthenticated, token, userInfo]);

  const verifyUser = async (token) => {
    try {
      const verifyResponse = await fetch(`${API_URL}/users/verify`, {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      });

      if (verifyResponse.status === 401) {
        throw new Error("unauthorized user");
      }

      if (!verifyResponse.ok) {
        throw new Error("Failed to verify user");
      }

      const verifyData = await verifyResponse.json();
      if (verifyData.data.user_role < 1 || verifyData.data.user_role > 3) {
        throw new Error("unauthorized user");
      }

      localStorage.setItem("userInfo", JSON.stringify(verifyData));
      setUserInfo(verifyData);
    } catch (error) {
      console.error("Error verifying user:", error.message);
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        h="100vh"
        alignItems="left"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          maxW={{ base: "100%", md: "420px" }}
          w="100%"
          background={isDarkMode ? "gray.800" : "white"}
          p="4"
          boxShadow="lg"
          mt="40px"
        >
          <Box>
            <Heading color={textColor} fontSize="36px" mb="10px">
              Welcome Admin!
            </Heading>
          </Box>
          <Flex direction="column">
            <FormControl>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </Button>
            </FormControl>
          </Flex>
          <FeedbackModalComponent />
        </Box>
      </Flex>
      <Modal
        isOpen={showServerErrorModal}
        onClose={handleCloseServerErrorModal}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Error de servidor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            En este momento, el servidor no se encuentra disponible. Por favor,
            inténtelo de nuevo más tarde.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCloseServerErrorModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultAuth>
  );
}

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export default SignIn;
