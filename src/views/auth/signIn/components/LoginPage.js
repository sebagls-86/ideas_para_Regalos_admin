import React, { useState} from "react";
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

function SignIn() {
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const [showServerErrorModal, setShowServerErrorModal] = useState(false);
  const { loginWithRedirect } = useAuth0();

  const textColor = useColorModeValue(
    isDarkMode ? "white" : "navy.700",
    "white"
  );
  
 const handleCloseServerErrorModal = () => {
    setShowServerErrorModal(false);
  };

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
