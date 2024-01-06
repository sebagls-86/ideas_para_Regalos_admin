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
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function AgeRangeDataFetcher() {
  const [ageRanges, setAgeRanges] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const token = "your_access_token_here"; // Reemplaza con tu token de acceso

  const handleEdit = (ageRangeId) => {
    setEditingRows([...editingRows, ageRangeId]);
  };

  const handleSave = async (ageRangeId, field, value) => {
    try {
      if (field === "age_range_id") {
        console.error("No se puede editar el ID del rango de edad.");
        return;
      }

      const updatedAgeRanges = ageRanges.map((range) => {
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
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (ageRangeId) => {
    setEditingRows(editingRows.filter((row) => row !== ageRangeId));
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
        setAgeRanges(data);
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
          {ageRanges.map((range) => (
            <Tr key={range.age_range_id}>
              <Td>{range.age_range_id}</Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <Input
                    value={range.name}
                    onChange={(e) => (range.name = e.target.value)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  range.name
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <Input
                    value={range.minimum_age}
                    onChange={(e) =>
                      (range.minimum_age = parseInt(e.target.value))
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  range.minimum_age
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <Input
                    value={range.maximum_age}
                    onChange={(e) =>
                      (range.maximum_age = parseInt(e.target.value))
                    }
                    minWidth="100px"
                    color="white"
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
                    <Icon
                      as={
                        editingRows.includes(range.age_range_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(range.age_range_id)
                      ? handleSave(range.age_range_id)
                      : handleEdit(range.age_range_id)
                  }
                />
                <IconButton
                  aria-label="Eliminar"
                  icon={<Icon as={FaTrash} />}
                  onClick={() => handleDelete(range.age_range_id)}
                />
                {editingRows.includes(range.age_range_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(range.age_range_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AgeRangeDataFetcher;
