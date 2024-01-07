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

function ListProductsDataFetcher() {
  const [productsCatalog, setProductsCatalog] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [originalProductsCatalog, setOriginalProductsCatalog] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [productCatalogIdToDelete, setProductCatalogIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"
  ;

  const handleEdit = (productCatalogId) => {
    setEditingRows([...editingRows, productCatalogId]);
  };

  const handleSave = async (productCatalogId) => {
    try {
      const updatedProductsCatalog = productsCatalog.map((product) =>
        product.product_catalog_id === productCatalogId
          ? { ...product }
          : product
      );

      setProductsCatalog(updatedProductsCatalog);

      const productToUpdate = updatedProductsCatalog.find(
        (product) => product.product_catalog_id === productCatalogId
      );

      if (!productToUpdate) {
        console.error("No se encontró el producto a actualizar");
        return;
      }

      await fetch(
        `http://localhost:8080/api/v1/productsCatalog/${productCatalogId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: productToUpdate.status }), // Enviar el campo 'status' del producto actualizado
        }
      );

      // Eliminar el ID del producto de editingRows para indicar que la edición ha finalizado
      setEditingRows(editingRows.filter((row) => row !== productCatalogId));

      console.log(
        `Campo status del producto ${productCatalogId} actualizado a ${productToUpdate.status}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (productCatalogId) => {
    const updatedProductsCatalog = originalProductsCatalog.map((product) => {
      return product.product_catalog_id === productCatalogId
        ? { ...product }
        : product;
    });

    setProductsCatalog(updatedProductsCatalog);
    setEditingRows(editingRows.filter((row) => row !== productCatalogId));
  };

  const handleStatusChange = async (event, productCatalogId) => {
    const { value } = event.target;
  
    try {
      const updatedProductsCatalog = productsCatalog.map((product) =>
        product.product_catalog_id === productCatalogId
          ? { ...product, status: parseInt(value) }
          : product
      );
  
      setProductsCatalog(updatedProductsCatalog);
  
      await fetch(
        `http://localhost:8080/api/v1/productsCatalog/${productCatalogId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: parseInt(value) }),
        }
      );
  
      console.log(
        `Campo status del producto ${productCatalogId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleDelete = async (productCatalogId) => {
    try {
      await fetch(
        `http://localhost:8080/api/v1/productsCatalog/${productCatalogId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
          setOriginalProductsCatalog(data.data);
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

  const handleInputChange = (event, productCatalogId, field) => {
    const { value } = event.target;

    setProductsCatalog((prevProductsCatalog) =>
      prevProductsCatalog.map((product) =>
        product.product_catalog_id === productCatalogId
          ? { ...product, [field]: value }
          : product
      )
    );
  };

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
                    onChange={(e) =>
                      handleInputChange(e, product.product_catalog_id, "name")
                    }
                  />
                ) : (
                  product.name
                )}
              </Td>
              <Td>
                {editingRows.includes(product.product_catalog_id) ? (
                  <select
                    value={product.status === 1 ? "1" : "0"} // Seleccionar dinámicamente el valor del estado
                    onChange={(e) =>
                      handleStatusChange(e, product.product_catalog_id)
                    }
                    style={{ color: 'black' }}
                  >
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                ) : product.status === 1 ? (
                  "Activo"
                ) : (
                  "Inactivo"
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
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este producto?
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

export default ListProductsDataFetcher;
