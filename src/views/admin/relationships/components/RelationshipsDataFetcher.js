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

function RelationshipsDataFetcher() {
  const [relationships, setRelationships] = useState([]);
  const [originalRelationships, setOriginalRelationships] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token = "tu_token_aqui"; // Reemplaza con tu token

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
    const updatedRelationships = relationships.map((relationship) => {
      const originalRelationship = originalRelationships.find(
        (originalRelationship) => originalRelationship.relationship_id === relationship.relationship_id
      );
      return originalRelationship ? { ...originalRelationship } : relationship;
    });
    setRelationships(updatedRelationships);
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
    setDeleteConfirmationId(relationshipId);
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

    fetch("http://localhost:8080/api/v1/relationships", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setRelationships(data.data);
          setOriginalRelationships(data.data); // Guarda la data original al cargar
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de relaciones:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {relationships.map((relationship) => (
            <Tr key={relationship.relationship_id}>
              <Td>{relationship.relationship_id}</Td>
              <Td>
                {editingRows.includes(relationship.relationship_id) ? (
                  <Input
                    value={relationship.relationship_name}
                    onChange={(e) =>
                      setRelationships((prevRelationships) =>
                        prevRelationships.map((rel) =>
                          rel.relationship_id === relationship.relationship_id
                            ? { ...rel, relationship_name: e.target.value }
                            : rel
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  relationship.relationship_name
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(relationship.relationship_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(relationship.relationship_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(relationship.relationship_id)
                      ? handleSave(relationship.relationship_id, "relationship_name", relationship.relationship_name)
                      : handleEdit(relationship.relationship_id)
                  }
                />
                {!editingRows.includes(relationship.relationship_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(relationship.relationship_id)
                    }
                  />
                )}
                {editingRows.includes(relationship.relationship_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(relationship.relationship_id)}
                  ></Button>
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
            ¿Estás seguro de que deseas eliminar esta relación?
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

export default RelationshipsDataFetcher;
