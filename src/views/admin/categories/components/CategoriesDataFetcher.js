import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
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

function CategoriesDataFetcher() {
  const { token } = useContext(TokenContext);
  const [categories, setCategories] = useState([]);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
 
  const handleEdit = (categoryId) => {
    setEditingRows([...editingRows, categoryId]);
  };

  const handleSave = async (categoryId, field, value) => {
    try {
      if (field === "category_id") {
        console.error("No se puede editar el ID de la categoría.");
        return;
      }

      const updatedCategories = categories.map((category) => {
        if (category.category_id === categoryId) {
          return { ...category, [field]: value };
        }
        return category;
      });

      setCategories(updatedCategories);
      setEditingRows(editingRows.filter((row) => row !== categoryId));

      await fetch(`http://localhost:8080/api/v1/categories/${categoryId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} de la categoría ${categoryId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (categoryId) => {
    const updatedCategories = categories.map((category) => {
      const originalCategory = originalCategories.find(
        (originalCategory) => originalCategory.category_id === category.category_id
      );
      return originalCategory ? { ...originalCategory } : category;
    });
    setCategories(updatedCategories);
    setEditingRows(editingRows.filter((row) => row !== categoryId));
  };

  const handleDelete = async (categoryId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedCategories = categories.filter(
        (category) => category.category_id !== categoryId
      );
      setCategories(updatedCategories);

      console.log(`Categoría con ID ${categoryId} eliminada`);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const handleDeleteConfirmation = (categoryId) => {
    setDeleteConfirmationId(categoryId);
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

    fetch("http://localhost:8080/api/v1/categories", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setCategories(data.data);
          setOriginalCategories(data.data); // Guarda la data original al cargar
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
            <Th>Nombre</Th>
            <Th>Imagen</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {categories.map((category) => (
            <Tr key={category.category_id}>
              <Td>{category.category_id}</Td>
              <Td>
                {editingRows.includes(category.category_id) ? (
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      setCategories((prevCategories) =>
                        prevCategories.map((cat) =>
                          cat.category_id === category.category_id
                            ? { ...cat, name: e.target.value }
                            : cat
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  category.name
                )}
              </Td>
              <Td>
                {editingRows.includes(category.category_id) ? (
                  <Input
                    value={category["/images/categories/categoryImage"]}
                    onChange={(e) =>
                      setCategories((prevCategories) =>
                        prevCategories.map((cat) =>
                          cat.category_id === category.category_id
                            ? {
                                ...cat,
                                "/images/categories/categoryImage": e.target.value,
                              }
                            : cat
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  category["/images/categories/categoryImage"]
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(category.category_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(category.category_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(category.category_id)
                      ? handleSave(category.category_id, "name", category.name)
                      : handleEdit(category.category_id)
                  }
                />
                {!editingRows.includes(category.category_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleDeleteConfirmation(category.category_id)}
                  />
                )}
                {editingRows.includes(category.category_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(category.category_id)}
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

export default CategoriesDataFetcher;
