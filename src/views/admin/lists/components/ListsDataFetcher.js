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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListsDataFetcher() {
  const [lists, setLists] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [listIdToDelete, setListIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (listId) => {
    setEditingRows([...editingRows, listId]);
  };

  const handleSave = async (listId, field, value) => {
    try {
      const updatedLists = lists.map((list) => {
        if (list.list_id === listId) {
          return { ...list, [field]: value };
        }
        return list;
      });

      setLists(updatedLists);
      setEditingRows(editingRows.filter((row) => row !== listId));

      await fetch(`http://localhost:8080/api/v1/lists/${listId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} de la lista ${listId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (listId) => {
    setEditingRows(editingRows.filter((row) => row !== listId));
  };

  const handleDelete = async (listId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/lists/${listId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedLists = lists.filter(
        (list) => list.list_id !== listId
      );
      setLists(updatedLists);

      console.log(`Lista con ID ${listId} eliminada`);
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
    }
  };

  const handleDeleteConfirmation = (listId) => {
    setListIdToDelete(listId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(listIdToDelete);
    setIsConfirmationOpen(false);
    setListIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setListIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/lists", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setLists(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de las listas:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Tipo de lista</Th>
            <Th>Nombre de la lista</Th>
            <Th>ID de usuario</Th>
            <Th>Fecha de creación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {lists.map((list) => (
            <Tr key={list.list_id}>
              <Td>{list.list_id}</Td>
              <Td>{list.list_type}</Td>
              <Td>{list.list_name}</Td>
              <Td>{list.user_id}</Td>
              <Td>{new Date(list.created_at).toLocaleString()}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(list.list_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(list.list_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(list.list_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(list.list_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(list.list_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(list.list_id)
                      }
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
          <ModalBody>¿Estás seguro de que deseas eliminar esta lista?</ModalBody>
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

export default ListsDataFetcher;
