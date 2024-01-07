import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";

const PermissionErrorModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Error de permisos</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Ups, parece que no tienes permiso para realizar esta acción.
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

export default PermissionErrorModal;