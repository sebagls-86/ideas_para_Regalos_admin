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
import illustration from "assets/img/logoIdeasParaRegalos.png";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";
import configJson from "../../../../auth_config.json";

function SignIn() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const { loginWithRedirect } = useAuth0();
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [tokenExists, setTokenExists] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const token = localStorage.getItem("token");
  const history = useHistory();
  const {
    isAuthenticated,
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

  useEffect(() => {
    const fetchTokenAndVerifyUser = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const userInfoData = localStorage.getItem("userInfo");

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

          console.log("newAccessToken", newAccessToken);

          setAccessToken(newAccessToken);
          localStorage.setItem("token", newAccessToken);

          let verifyUserCompleted = false;

          const timeoutId = setTimeout(() => {
            if (!verifyUserCompleted) {
              localStorage.removeItem("token");
              const userInfoFromStorage = localStorage.getItem("userInfo");
              if (!userInfoFromStorage) {
                setIsLoading(false);
                logout();
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
            console.log("first push");
           
          } catch (error) {
            console.error("Error verifying user:", error.message);
            setIsLoading(false);
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
            logout();
          }
          const userData = localStorage.getItem("userInfo");
          setUserInfo(userData);
          console.log("first push");
          if (newAccessToken && userData) {
            history.push("/admin/default");
          }
        }
        console.log("second push");
        if (storedToken && userInfoData) {
          history.push("/admin/default");
        }
      } catch (error) {
        console.error("Error fetching token:", error.message);
        setIsLoading(false);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        logout();
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
      console.log("verifyData", verifyData);
      console.log("role", verifyData.data.user_role);
      if (verifyData.data.user_role < 1 || verifyData.data.user_role > 3) {
        throw new Error("Failed to verify user");
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
