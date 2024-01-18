import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modalError/modalTokenInvalidError";
import useDataFetcher from "../../../../components/fetchData/useDataFetcher";
import ErrorModal from "../../../../components/modalError/modalError";
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
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes, FaComments } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/lists";
  const token = useContext(TokenContext).token;
  const [selectedListProducts, setSelectedListProducts] = useState(null);
  const [listNames, setListNames] = useState({});
  const [listProducts, setListProducts] = useState({});

  const {
    data: lists,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleSave,
    handleCancel,
    handleDeleteConfirmation,
    handleCloseTokenInvalidError,
    handleCloseErrorModal,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

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
          list_name: data.data.list_name || "Nombre no disponible",
        });
  
        setListProducts({ ...listProducts, [listId]: [data.data] });
        setListNames({ ...listNames, [listId]: data.data.list_name });
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

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
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
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {lists.map((list) => (
            <Tr key={list.list_id}>
              <Td>{list.list_id}</Td>
              <Td>
                {editingRows.includes(list.list_id) ? (
                  <input
                    value={list.list_type}
                    onChange={(e) => handleEdit(list.list_id)}
                  />
                ) : (
                  list.list_type
                )}
              </Td>
              <Td>
                {editingRows.includes(list.list_id) ? (
                  <input
                    value={list.list_name}
                    onChange={(e) => handleEdit(list.list_id)}
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
                <IconButton
                  aria-label={
                    editingRows.includes(list.list_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(list.list_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(list.list_id)
                      ? handleSave(list.list_id, "list name", list.list_name)
                      : handleEdit(list.list_id)
                  }
                />
                {!editingRows.includes(list.list_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(list.list_id)
                    }
                  />
                )}
                {editingRows.includes(list.list_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(list.list_id)}
                  >
                    {" "}
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar esta lista?"
      )}
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
