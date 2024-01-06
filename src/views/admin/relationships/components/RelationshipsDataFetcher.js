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

function RelationshipsDataFetcher() {
  const [relationships, setRelationships] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [relationshipIdToDelete, setRelationshipIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (relationshipId) => {
    setEditingRows([...editingRows, relationshipId]);
  };

  const handleSave = async (relationshipId, field, value) => {
    try {
      const updatedRelationships = relationships.map((relationship) => {
        if (relationship.relationship_id === relationshipId) {
          return { ...relationship, [field]: value };
        }
        return relationship;
      });

      setRelationships(updatedRelationships);
      setEditingRows(editingRows.filter((row) => row !== relationshipId));

      await fetch(`http://localhost:8080/api/v1/relationships/${relationshipId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} de la relación ${relationshipId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (relationshipId) => {
    setEditingRows(editingRows.filter((row) => row !== relationshipId));
  };

  const handleDelete = async (relationshipId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/relationships/${relationshipId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedRelationships = relationships.filter(
        (relationship) => relationship.relationship_id !== relationshipId
      );
      setRelationships(updatedRelationships);

      console.log(`Relación con ID ${relationshipId} eliminada`);
    } catch (error) {
      console.error("Error al eliminar la relación:", error);
    }
  };

  const handleDeleteConfirmation = (relationshipId) => {
    setRelationshipIdToDelete(relationshipId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(relationshipIdToDelete);
    setIsConfirmationOpen(false);
    setRelationshipIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setRelationshipIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/relationships", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setRelationships(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los tipos de relación:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre de la relación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {relationships.map((relationship) => (
            <Tr key={relationship.relationship_id}>
              <Td>{relationship.relationship_id}</Td>
              <Td>{relationship.relationship_name}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(relationship.relationship_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(relationship.relationship_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(relationship.relationship_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(relationship.relationship_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(relationship.relationship_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(relationship.relationship_id)
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
          <ModalBody>¿Estás seguro de que deseas eliminar esta relación?</ModalBody>
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

export default RelationshipsDataFetcher;
