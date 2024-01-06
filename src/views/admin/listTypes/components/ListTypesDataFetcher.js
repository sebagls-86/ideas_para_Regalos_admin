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

function ListTypesDataFetcher() {
  const [listTypes, setListTypes] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [listTypeIdToDelete, setListTypeIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (listTypeId) => {
    setEditingRows([...editingRows, listTypeId]);
  };

  const handleSave = async (listTypeId, field, value) => {
    try {
      const updatedListTypes = listTypes.map((listType) => {
        if (listType.list_type_id === listTypeId) {
          return { ...listType, [field]: value };
        }
        return listType;
      });

      setListTypes(updatedListTypes);
      setEditingRows(editingRows.filter((row) => row !== listTypeId));

      await fetch(`http://localhost:8080/api/v1/listtypes/${listTypeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del tipo de lista ${listTypeId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (listTypeId) => {
    setEditingRows(editingRows.filter((row) => row !== listTypeId));
  };

  const handleDelete = async (listTypeId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/listtypes/${listTypeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedListTypes = listTypes.filter(
        (listType) => listType.list_type_id !== listTypeId
      );
      setListTypes(updatedListTypes);

      console.log(`Tipo de lista con ID ${listTypeId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el tipo de lista:", error);
    }
  };

  const handleDeleteConfirmation = (listTypeId) => {
    setListTypeIdToDelete(listTypeId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(listTypeIdToDelete);
    setIsConfirmationOpen(false);
    setListTypeIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setListTypeIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/listtypes", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setListTypes(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de lista:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre del tipo de lista</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {listTypes.map((listType) => (
            <Tr key={listType.list_type_id}>
              <Td>{listType.list_type_id}</Td>
              <Td>{listType.list_type_name}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(listType.list_type_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(listType.list_type_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(listType.list_type_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(listType.list_type_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(listType.list_type_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(listType.list_type_id)
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
          <ModalBody>¿Estás seguro de que deseas eliminar este tipo de lista?</ModalBody>
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

export default ListTypesDataFetcher;
