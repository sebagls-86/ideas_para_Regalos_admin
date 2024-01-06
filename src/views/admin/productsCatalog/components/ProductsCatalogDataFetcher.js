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

function ProductsCatalogDataFetcher() {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [productCatalogIdToDelete, setProductCatalogIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (productCatalogId) => {
    setEditingRows([...editingRows, productCatalogId]);
  };

  const handleSave = async (productCatalogId, field, value) => {
    try {
      const updatedProductsCatalog = productsCatalog.map((product) => {
        if (product.product_catalog_id === productCatalogId) {
          return { ...product, [field]: value };
        }
        return product;
      });

      setProductsCatalog(updatedProductsCatalog);
      setEditingRows(editingRows.filter((row) => row !== productCatalogId));

      await fetch(`http://localhost:8080/api/v1/productsCatalog/${productCatalogId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del producto ${productCatalogId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (productCatalogId) => {
    setEditingRows(editingRows.filter((row) => row !== productCatalogId));
  };

  const handleDelete = async (productCatalogId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/productsCatalog/${productCatalogId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProductsCatalog = productsCatalog.filter(
        (product) => product.product_catalog_id !== productCatalogId
      );
      setProductsCatalog(updatedProductsCatalog);

      console.log(`Producto con ID ${productCatalogId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleDeleteConfirmation = (productCatalogId) => {
    setProductCatalogIdToDelete(productCatalogId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(productCatalogIdToDelete);
    setIsConfirmationOpen(false);
    setProductCatalogIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setProductCatalogIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/productsCatalog", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setProductsCatalog(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los catálogos de productos:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Estado</Th>
            <Th>Imágenes</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {productsCatalog.map((product) => (
            <Tr key={product.product_catalog_id}>
              <Td>{product.product_catalog_id}</Td>
              <Td>
                {editingRows.includes(product.product_catalog_id) ? (
                  <input
                    value={product.name}
                    onChange={(e) => handleSave(product.product_catalog_id, "name", e.target.value)}
                  />
                ) : (
                  product.name
                )}
              </Td>
              <Td>
                {editingRows.includes(product.product_catalog_id) ? (
                  <input
                    value={product.status === 1 ? "Activo" : "Inactivo"}
                    onChange={(e) => handleSave(product.product_catalog_id, "status", e.target.value === "Activo" ? 1 : 0)}
                  />
                ) : (
                  product.status === 1 ? "Activo" : "Inactivo"
                )}
              </Td>
              <Td>{product.images ? product.images.join(", ") : "N/A"}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(product.product_catalog_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(product.product_catalog_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(product.product_catalog_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(product.product_catalog_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(product.product_catalog_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(product.product_catalog_id)
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
          <ModalBody>¿Estás seguro de que deseas eliminar este producto?</ModalBody>
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

export default ProductsCatalogDataFetcher;
