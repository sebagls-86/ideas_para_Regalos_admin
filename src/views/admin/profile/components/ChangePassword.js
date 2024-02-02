// Chakra imports
import {
  Text,
  Input,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useContext, useState } from "react";
import { TokenContext } from "contexts/TokenContext";
import useFeedbackModal from "../../../../components/modals/feedbackModal";

export default function ChangePassword(props) {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const { token } = useContext(TokenContext);

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar que todos los campos estén llenos
    if (!oldPassword || !newPassword || !confirmPassword) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    // Validar que la nueva contraseña y la confirmación coincidan
    if (newPassword !== confirmPassword) {
      console.log("La nueva contraseña y la confirmación no coinciden");
      return;
    }

    // Preparar el objeto a enviar en el cuerpo de la solicitud
    const requestBody = {
      old_password: oldPassword,
      password: newPassword,
      confirm: confirmPassword,
    };

    try {
      // Realizar la solicitud PUT
      const response = await fetch("http://localhost:8080/api/v1/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        openFeedbackModal("Contraseña cambiada con éxito");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        openFeedbackModal("Hubo un error al cambiar la contrase;a");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error("Error de red al cambiar la contraseña:", error.message);
      // Puedes mostrar un mensaje de error al usuario si lo deseas
    }
  };

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
    <FeedbackModal />
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Cambiar Contraseña
      </Text>
      <form onSubmit={handleSubmit}>
        <Text color={textColorSecondary} fontSize="md" me="26px" mb="20px">
          Por favor, ingresa tu antigua contraseña y la nueva contraseña a continuación.
        </Text>
        <Input
          type="password"
          placeholder="Antigua Contraseña"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          mb="20px"
          color= "white"
        />
        <Input
          type="password"
          placeholder="Nueva Contraseña"
          value={newPassword}
          onChange={handlePasswordChange}
          mb="20px"
          color= "white"
        />
        <Input
          type="password"
          placeholder="Confirmar Nueva Contraseña"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          mb="20px"
          color= "white"
        />
        <Button
          type="submit"
          colorScheme="blue"
          boxShadow={cardShadow}
          _hover={{ boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.24)" }}
        >
          Cambiar Contraseña
        </Button>
      </form>
    </Card>
  );
}