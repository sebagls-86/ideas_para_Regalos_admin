import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Icon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes, FaComments } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ForumsMessagesDataFetcher() {
  const [forums, setForums] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [forumIdToDelete, setForumIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (forumId) => {
    setEditingRows([...editingRows, forumId]);
  };

  const handleSave = async (forumId, field, value) => {
    try {
      if (field === "message_id") {
        console.error("No se puede editar el ID del mensaje.");
        return;
      }

      const updatedForums = forums.map((message) => {
        if (message.message_id === forumId) {
          return { ...message, [field]: value };
        }
        return message;
      });

      setForums(updatedForums);
      setEditingRows(editingRows.filter((row) => row !== forumId));

      await fetch(`http://localhost:8080/api/v1/forums/forum_id/messages/${forumId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del mensaje ${forumId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (forumId) => {
    setEditingRows(editingRows.filter((row) => row !== forumId));
  };

  const handleDelete = async (forumId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/forums/forum_id/messages/${forumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedForums = forums.filter(
        (message) => message.message_id !== forumId
      );
      setForums(updatedForums);

      console.log(`Mensaje con ID ${forumId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const handleViewMessages = (forumId) => {
    const selected = forums.find((message) => message.message_id === forumId);
    setSelectedForum(selected);
  };

  const handleCloseMessages = () => {
    setSelectedForum(null);
  };

  const handleDeleteConfirmation = (forumId) => {
    setForumIdToDelete(forumId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(forumIdToDelete);
    setIsConfirmationOpen(false);
    setForumIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setForumIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/messages", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setForums(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de mensajes:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Mensaje</Th>
            <Th>Usuario</Th>
            <Th>Foro ID</Th>
            <Th>Imágenes</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {forums.map((message) => (
            <Tr key={message.message_id}>
              <Td>{message.message_id}</Td>
              <Td>{message.message}</Td>
              <Td>{message.user_id}</Td>
              <Td>{message.forum_id}</Td>
              <Td>{message.images ? message.images.join(', ') : 'N/A'}</Td>
              <Td>{new Date(message.date).toLocaleString()}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(message.message_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<Icon as={FaCheck} />}
                        onClick={() => handleSave(message.message_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        leftIcon={<Icon as={FaTimes} />}
                        onClick={() => handleCancel(message.message_id)}
                      >
                        Cancelar
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(message.message_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(message.message_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(message.message_id)}
                    />
                  )}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isConfirmationOpen} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Estás seguro de que deseas eliminar este mensaje?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ForumsMessagesDataFetcher;
