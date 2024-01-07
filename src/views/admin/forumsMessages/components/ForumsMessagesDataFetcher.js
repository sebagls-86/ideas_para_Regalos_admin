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
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function MessagesDataFetcher() {
  const [messages, setMessages] = useState([]);
  const [originalMessages, setOriginalMessages] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

  const handleEdit = (messageId) => {
    setEditingRows([...editingRows, messageId]);
  };

  const handleSave = async (messageId, field, value) => {
    try {
      if (field === "message_id") {
        console.error("No se puede editar el ID de la categoría.");
        return;
      }

      const updatedMessages = messages.map((message) => {
        if (message.message_id === messageId) {
          return { ...message, [field]: value };
        }
        return message;
      });

      setMessages(updatedMessages);
      setEditingRows(editingRows.filter((row) => row !== messageId));

      await fetch(
        `http://localhost:8080/api/v1/forums/forum_id/messages/${messageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      console.log(
        `Campo ${field} del mensaje ${messageId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (messageId) => {
    const updatedMessages = messages.map((message) => {
      const originalMessage = originalMessages.find(
        (originalMessage) => originalMessage.message_id === message.message_id
      );
      return originalMessage ? { ...originalMessage } : message;
    });
    setMessages(updatedMessages);
    setEditingRows(editingRows.filter((row) => row !== messageId));
  };

  const handleDelete = async (messageId) => {
    try {
      await fetch(
        `http://localhost:8080/api/v1/forums/forum_id/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedMessages = messages.filter(
        (message) => message.message_id !== messageId
      );
      setMessages(updatedMessages);

      console.log(`Mensaje con ID ${messageId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el mensaje:", error);
    }
  };

  const handleDeleteConfirmation = (messageId) => {
    setDeleteConfirmationId(messageId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(deleteConfirmationId);
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
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
          setMessages(data.data);
          setOriginalMessages(data.data); // Guarda la data original al cargar
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de categorías:", error);
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
          {messages.map((message) => (
            <Tr key={message.message_id}>
              <Td>{message.message_id}</Td>
              <Td>
                {editingRows.includes(message.message_id) ? (
                  <Input
                    value={message.message}
                    onChange={(e) => {
                      const { value } = e.target;
                      const updatedMessages = messages.map((msg) =>
                        msg.message_id === message.message_id
                          ? { ...msg, message: value }
                          : msg
                      );
                      setMessages(updatedMessages);
                    }}
                    color="white"
                  />
                ) : (
                  message.message
                )}
              </Td>
              <Td>{message.user_id}</Td>
              <Td>{message.forum_id}</Td>
              <Td>
                {editingRows.includes(message.message_id) ? (
                  <Input
                    value={message.images ? message.images.join(', ') : ''}
                    onChange={(e) => {
                      const { value } = e.target;
                      const updatedMessages = messages.map((msg) =>
                        msg.message_id === message.message_id
                          ? { ...msg, images: value.split(', ') }
                          : msg
                      );
                      setMessages(updatedMessages);
                    }}
                    minWidth="100px"
                    color="white"
                  />
                ) : message.images ? (
                  message.images.join(', ')
                ) : (
                  'N/A'
                )}
              </Td>
              <Td>{new Date(message.date).toLocaleString()}</Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(message.message_id)
                      ? 'Guardar'
                      : 'Editar'
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(message.message_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(message.message_id)
                      ? handleSave(
                          message.message_id,
                          'message',
                          message.message
                        )
                      : handleEdit(message.message_id)
                  }
                />
                {!editingRows.includes(message.message_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(message.message_id)
                    }
                  />
                )}
                {editingRows.includes(message.message_id) && (
                  <IconButton
                    aria-label="Cancelar"
                    icon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(message.message_id)}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar esta categoría?
          </ModalBody>
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

export default MessagesDataFetcher;
