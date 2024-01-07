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

function AgeRangeDataFetcher() {
  const [ageRanges, setAgeRanges] = useState([]);
  const [originalAgeRanges, setOriginalAgeRanges] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

    const handleEdit = (ageRangeId) => {
      setEditingRows([...editingRows, ageRangeId]);
    };
  
    const handleCancel = (ageRangeId) => {
      const updatedAgeRanges = ageRanges.map((range) => {
        const originalRange = originalAgeRanges.find(
          (originalRange) => originalRange.age_range_id === range.age_range_id
        );
        return originalRange ? { ...originalRange } : range;
      });
      setAgeRanges(updatedAgeRanges);
      setEditingRows(editingRows.filter((row) => row !== ageRangeId));
    };

  const handleSave = async (ageRangeId, field, value, index) => {
    try {
      if (field === "age_range_id") {
        console.error("No se puede editar el ID del rango de edad.");
        return;
      }

      const updatedAgeRanges = ageRanges.map((range, i) => {
        if (range.age_range_id === ageRangeId) {
          return { ...range, [field]: value };
        }
        return range;
      });

      setAgeRanges(updatedAgeRanges);
      setEditingRows(editingRows.filter((row) => row !== ageRangeId));

      await fetch(`http://localhost:8080/api/v1/ageRanges/${ageRangeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(
        `Campo ${field} del rango de edad ${ageRangeId} actualizado a ${value}`
      );

      // Eliminar la entrada correspondiente en originalAgeRanges después de guardar
      const updatedOriginalAgeRanges = [...originalAgeRanges];
      updatedOriginalAgeRanges.splice(index, 1);
      setOriginalAgeRanges(updatedOriginalAgeRanges);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleDelete = async (ageRangeId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/ageRanges/${ageRangeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedAgeRanges = ageRanges.filter(
        (range) => range.age_range_id !== ageRangeId
      );
      setAgeRanges(updatedAgeRanges);

      console.log(`Rango de edad con ID ${ageRangeId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el rango de edad:", error);
    }
  };

  const handleDeleteConfirmation = (ageRangeId) => {
    setDeleteConfirmationId(ageRangeId);
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

    fetch("http://localhost:8080/api/v1/ageRanges", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setAgeRanges(data.data);
          setOriginalAgeRanges(data.data.map((range) => ({ ...range }))); // Guardar una copia de los datos originales
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de rangos de edad:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Edad Mínima</Th>
            <Th>Edad Máxima</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {ageRanges.map((range, index) => (
            <Tr key={range.age_range_id}>
              <Td>{range.age_range_id}</Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.name}
                    onChange={(e) => {
                      const updatedRange = { ...range, name: e.target.value };
                      setAgeRanges((prevRanges) => {
                        const updatedRanges = [...prevRanges];
                        updatedRanges[index] = updatedRange;
                        return updatedRanges;
                      });
                    }}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.name
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.minimum_age}
                    onChange={(e) => {
                      const updatedRange = { ...range, minimum_age: parseInt(e.target.value) };
                      setAgeRanges((prevRanges) => {
                        const updatedRanges = [...prevRanges];
                        updatedRanges[index] = updatedRange;
                        return updatedRanges;
                      });
                    }}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.minimum_age
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.maximum_age}
                    onChange={(e) => {
                      const updatedRange = { ...range, maximum_age: parseInt(e.target.value) };
                      setAgeRanges((prevRanges) => {
                        const updatedRanges = [...prevRanges];
                        updatedRanges[index] = updatedRange;
                        return updatedRanges;
                      });
                    }}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.maximum_age
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(range.age_range_id) ? "Guardar" : "Editar"
                  }
                  icon={
                    editingRows.includes(range.age_range_id) ? <FaCheck /> : <FaEdit />
                  }
                  onClick={() =>
                    editingRows.includes(range.age_range_id)
                      ? handleSave(range.age_range_id, "name", range.name, index)
                      : handleEdit(range.age_range_id)
                  }
                />
                {!editingRows.includes(range.age_range_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<FaTrash />}
                    onClick={() => handleDeleteConfirmation(range.age_range_id)}
                  />
                )}
                {editingRows.includes(range.age_range_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<FaTimes />}
                    onClick={() => handleCancel(range.age_range_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este rango de edad?
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

export default AgeRangeDataFetcher;
