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

function InterestsDataFetcher() {
  const [interests, setInterests] = useState([]);
  const [originalInterests, setOriginalInterests] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

  const handleEdit = (interestId) => {
    setEditingRows([...editingRows, interestId]);
  };

  const handleSave = async (interestId, field, value) => {
    try {
      if (field === "interest_id") {
        console.error("No se puede editar el ID del interés.");
        return;
      }

      const updatedInterests = interests.map((interest) => {
        if (interest.interest_id === interestId) {
          return { ...interest, [field]: value };
        }
        return interest;
      });

      setInterests(updatedInterests);
      setEditingRows(editingRows.filter((row) => row !== interestId));

      await fetch(`http://localhost:8080/api/v1/interests/${interestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del interés ${interestId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (interestId) => {
    const updatedInterests = interests.map((interest) => {
      const originalInterest = originalInterests.find(
        (originalInterest) => originalInterest.interest_id === interest.interest_id
      );
      return originalInterest ? { ...originalInterest } : interest;
    });
    setInterests(updatedInterests);
    setEditingRows(editingRows.filter((row) => row !== interestId));
  };

  const handleDelete = async (interestId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/interests/${interestId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedInterests = interests.filter(
        (interest) => interest.interest_id !== interestId
      );
      setInterests(updatedInterests);

      console.log(`Interés con ID ${interestId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el interés:", error);
    }
  };

  const handleDeleteConfirmation = (interestId) => {
    setDeleteConfirmationId(interestId);
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

    fetch("http://localhost:8080/api/v1/interests", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setInterests(data.data);
          setOriginalInterests(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los intereses:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Interés</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {interests.map((interest) => (
            <Tr key={interest.interest_id}>
              <Td>{interest.interest_id}</Td>
              <Td>
                {editingRows.includes(interest.interest_id) ? (
                  <Input
                    value={interest.interest}
                    onChange={(e) =>
                      setInterests((prevInterests) =>
                        prevInterests.map((int) =>
                          int.interest_id === interest.interest_id
                            ? { ...int, interest: e.target.value }
                            : int
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  interest.interest
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(interest.interest_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(interest.interest_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(interest.interest_id)
                      ? handleSave(interest.interest_id, "interest", interest.interest)
                      : handleEdit(interest.interest_id)
                  }
                />
                {!editingRows.includes(interest.interest_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleDeleteConfirmation(interest.interest_id)}
                  />
                )}
                {editingRows.includes(interest.interest_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(interest.interest_id)}
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
            ¿Estás seguro de que deseas eliminar este interés?
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

export default InterestsDataFetcher;
