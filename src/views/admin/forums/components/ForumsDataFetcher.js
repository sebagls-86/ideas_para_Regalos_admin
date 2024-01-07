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

function ForumsDataFetcher() {
  const [forums, setForums] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [forumIdToDelete, setForumIdToDelete] = useState(null);
  const [originalForums, setOriginalForums] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NzMyNzE2fQ.zroIVwP9rbRps8NcSpLDMxMVQz3hkxnOweCrjaZHVDY"
  const handleEdit = (forumId) => {
    setEditingRows([...editingRows, forumId]);
  };

  const handleSave = async (forumId, field, value) => {
    try {
      if (field === "forum_id") {
        console.error("No se puede editar el ID del foro.");
        return;
      }

      const updatedForums = forums.map((forum) => {
        if (forum.forum_id === forumId) {
          return { ...forum, [field]: value };
        }
        return forum;
      });

      setForums(updatedForums);
      setEditingRows(editingRows.filter((row) => row !== forumId));

      await fetch(`http://localhost:8080/api/v1/forums/${forumId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del foro ${forumId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (forumId) => {
    const updatedForums = forums.map((forum) => {
      const originalForum = originalForums.find(
        (originalForum) => originalForum.forum_id === forum.forum_id
      );
      return originalForum ? { ...originalForum } : forum;
    });
    setForums(updatedForums);
    setEditingRows(editingRows.filter((row) => row !== forumId));
  };

  const handleDelete = async (forumId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/forums/${forumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedForums = forums.filter(
        (forum) => forum.forum_id !== forumId
      );
      setForums(updatedForums);

      console.log(`Foro con ID ${forumId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el foro:", error);
    }
  };

  const handleViewMessages = (forumId) => {
    const selected = forums.find((forum) => forum.forum_id === forumId);
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

    fetch("http://localhost:8080/api/v1/forums", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setForums(data.data);
          setOriginalForums(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de foros:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Título</Th>
            <Th>Descripción</Th>
            <Th>Mensajes</Th>
            <Th>Fecha de Creación</Th>
            <Th>Likes</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {forums.map((forum) => (
            <Tr key={forum.forum_id}>
              <Td>{forum.forum_id}</Td>
              <Td>
                {editingRows.includes(forum.forum_id) ? (
                  <input
                    value={
                      forums.find((f) => f.forum_id === forum.forum_id)
                        ?.title || ""
                    }
                    onChange={(e) => {
                      const updatedForums = forums.map((f) => {
                        if (f.forum_id === forum.forum_id) {
                          return { ...f, title: e.target.value };
                        }
                        return f;
                      });
                      setForums(updatedForums);
                    }}
                  />
                ) : (
                  forum.title
                )}
              </Td>
              <Td>
                {editingRows.includes(forum.forum_id) ? (
                  <input
                    value={
                      forums.find((f) => f.forum_id === forum.forum_id)
                        ?.description || ""
                    }
                    onChange={(e) => {
                      const updatedForums = forums.map((f) => {
                        if (f.forum_id === forum.forum_id) {
                          return { ...f, description: e.target.value };
                        }
                        return f;
                      });
                      setForums(updatedForums);
                    }}
                  />
                ) : (
                  forum.description
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label="Ver Mensajes"
                  icon={<Icon as={FaComments} />}
                  onClick={() => handleViewMessages(forum.forum_id)}
                />
              </Td>
              <Td>{forum.created_at}</Td>
              <Td>{forum.likes}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(forum.forum_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<Icon as={FaCheck} />}
                        onClick={() => handleSave(forum.forum_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<Icon as={FaTimes} />}
                        onClick={() => handleCancel(forum.forum_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(forum.forum_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(forum.forum_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(forum.forum_id)}
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
          <ModalBody>¿Estás seguro de que deseas eliminar este foro?</ModalBody>
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
      <Modal isOpen={selectedForum} onClose={handleCloseMessages}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Mensajes de {selectedForum ? selectedForum.title : ""}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedForum && selectedForum.messages ? (
              selectedForum.messages.map((message) => (
                <div key={message.message_id}>
                  <p>Usuario: {message.user_name}</p>
                  <p>Mensaje: {message.message}</p>
                </div>
              ))
            ) : (
              <p>No hay mensajes disponibles para este foro.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseMessages}>
              Cerrar Mensajes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ForumsDataFetcher;
