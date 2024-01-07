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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes, FaComments } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListsDataFetcher() {
  const [lists, setLists] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [selectedListProducts, setSelectedListProducts] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [listIdToDelete, setListIdToDelete] = useState(null);
  const [originalLists, setOriginalLists] = useState([]);
  const [listProducts, setListProducts] = useState({});
  const [listNames, setListNames] = useState({});
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NzMyNzE2fQ.zroIVwP9rbRps8NcSpLDMxMVQz3hkxnOweCrjaZHVDY";
  const handleEdit = (listId) => {
    setEditingRows([...editingRows, listId]);
  };

  const handleSave = async (listId, field, value) => {
    try {
      if (field === "list_id") {
        console.error("No se puede editar el ID de la lista.");
        return;
      }

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

      console.log(
        `Campo ${field} de la lista ${listId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (listId) => {
    const updatedLists = lists.map((list) => {
      const originalList = originalLists.find(
        (originalList) => originalList.list_id === list.list_id
      );
      return originalList ? { ...originalList } : list;
    });
    setLists(updatedLists);
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

      const updatedLists = lists.filter((list) => list.list_id !== listId);
      setLists(updatedLists);

      console.log(`Lista con ID ${listId} eliminada`);
    } catch (error) {
      console.error("Error al eliminar la lista:", error);
    }
  };

  const handleViewProducts = async (listId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/lists/${listId}/listProducts`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedListProducts({
          list_id: data.data.list_id,
          list_name: listNames[data.data.list_id] || "Nombre no disponible",
        });

        setListProducts({ ...listProducts, [listId]: [data.data] });
      } else {
        console.error("Error en la respuesta de la API:", response.status);
        // Lógica para manejar errores de respuesta
      }
    } catch (error) {
      console.error("Error al obtener los productos de la lista:", error);
    }
  };

  const handleCloseProducts = () => {
    setSelectedListProducts(null);
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
          setOriginalLists(data.data);

          const names = {};
          data.data.forEach((list) => {
            names[list.list_id] = list.list_name;
          });
          setListNames(names);
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
            <Th>Tipo</Th>
            <Th>Nombre</Th>
            <Th>Usuario ID</Th>
            <Th>Productos</Th>
            <Th>Fecha de Creación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {lists.map((list) => (
            <Tr key={list.list_id}>
              <Td>{list.list_id}</Td>
              <Td>
                {editingRows.includes(list.list_id) ? (
                  <input
                    value={
                      lists.find((l) => l.list_id === list.list_id)
                        ?.list_type || ""
                    }
                    onChange={(e) => {
                      const updatedLists = lists.map((l) => {
                        if (l.list_id === list.list_id) {
                          return { ...l, list_type: e.target.value };
                        }
                        return l;
                      });
                      setLists(updatedLists);
                    }}
                  />
                ) : (
                  list.list_type
                )}
              </Td>
              <Td>
                {editingRows.includes(list.list_id) ? (
                  <input
                    value={
                      lists.find((l) => l.list_id === list.list_id)
                        ?.list_name || ""
                    }
                    onChange={(e) => {
                      const updatedLists = lists.map((l) => {
                        if (l.list_id === list.list_id) {
                          return { ...l, list_name: e.target.value };
                        }
                        return l;
                      });
                      setLists(updatedLists);
                    }}
                  />
                ) : (
                  list.list_name
                )}
              </Td>
              <Td>{list.user_id}</Td>
              <Td>
                <IconButton
                  aria-label="Ver Productos"
                  icon={<Icon as={FaComments} />}
                  onClick={() => handleViewProducts(list.list_id)}
                />
              </Td>
              <Td>{list.created_at}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(list.list_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<Icon as={FaCheck} />}
                        onClick={() =>
                          handleSave(list.list_id, "list_name", list.list_name)
                        }
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<Icon as={FaTimes} />}
                        onClick={() => handleCancel(list.list_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(list.list_id)}
                      mr={2}
                    />
                  )}
                  {!editingRows.includes(list.list_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(list.list_id)}
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
            ¿Estás seguro de que deseas eliminar esta lista?
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
      <Modal isOpen={selectedListProducts} onClose={handleCloseProducts}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {listNames[selectedListProducts?.list_id]
              ? `Productos de ${listNames[selectedListProducts?.list_id]}`
              : "No hay productos para mostrar"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {listProducts[selectedListProducts?.list_id] &&
            listProducts[selectedListProducts?.list_id].length > 0 ? (
              Array.isArray(listProducts[selectedListProducts?.list_id]) ? (
                listProducts[selectedListProducts?.list_id].map(
                  (listProduct) => (
                    <div key={listProduct.list_product_id}>
                      <p>List Product ID: {listProduct.list_product_id}</p>
                      <p>
                        Product Catalog ID: {listProduct.product_catalog_id}
                      </p>
                    </div>
                  )
                )
              ) : (
                <div>
                  <p>
                    List Product ID:{" "}
                    {
                      listProducts[selectedListProducts?.list_id]
                        .list_product_id
                    }
                  </p>
                  <p>
                    Product Catalog ID:{" "}
                    {
                      listProducts[selectedListProducts?.list_id]
                        .product_catalog_id
                    }
                  </p>
                </div>
              )
            ) : (
              <p>No hay productos disponibles para esta lista.</p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ListsDataFetcher;
