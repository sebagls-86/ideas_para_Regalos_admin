import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorMode,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/logoIdeasParaRegalos.png";

function ForgotPassword() {
  const history = useHistory();
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";
  const textColor = useColorModeValue(
    isDarkMode ? "white" : "navy.700",
    "white"
  );
  const textColorSecondary = isDarkMode ? "gray.300" : "gray.400";
  const textColorBrand = useColorModeValue(
    isDarkMode ? "brand.300" : "brand.500",
    "white"
  );

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleForgotPassword = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/reset-link", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        setModalContent("Vas a recibir un email con los pasos a seguir");
        setModalIsOpen(true);
        //history.push("/auth/login");
      } else if (response.status === 404) {
        setModalContent("No se encontró el email");
        setModalIsOpen(true);
      } else {
        setModalContent("Ups! Algo salió mal");
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error("Error al enviar correo de recuperación:", error);
      setErrorMessage("Error al enviar correo de recuperación");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
              Forgot Password
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="md"
            >
              Enter your email to reset your password.
            </Text>
          </Box>
          <Flex direction="column">
            <FormControl>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errorMessage && (
                <Text color="red.500" fontSize="sm" mb="16px">
                  {errorMessage}
                </Text>
              )}
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
                onClick={handleForgotPassword}
              >
                Reset Password
              </Button>
              <NavLink to="/auth/sign-in">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  fontWeight="500"
                  textAlign="center"
                >
                  Back to Sign In
                </Text>
              </NavLink>
            </FormControl>
          </Flex>
        </Box>
      </Flex>
      {/* Modal para mostrar mensajes */}
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recuperación de Contraseña</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalContent}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={closeModal}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultAuth>
  );
}

export default ForgotPassword;
