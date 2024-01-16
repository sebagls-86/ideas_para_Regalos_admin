import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";

const ModalTokenInvalidError = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error de Autenticacion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Parece que tu token esta vencido. Logueate nuevamente.
        </ModalBody>
        <ModalFooter>
        <Button colorScheme="blue" mr={3} onClick={onClose}>
            Aceptar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalTokenInvalidError;