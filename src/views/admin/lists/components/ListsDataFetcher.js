import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import ErrorModal from "../../../../components/modals/modalError";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
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
import { FaTrash, FaTimes, FaComments } from "react-icons/fa";
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
   handleCancel,
    handleDeleteConfirmation,
    handleCloseTokenInvalidError,
    handleCloseErrorModal,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  const customFilter = (list, searchTerm) => {
    const matchId = list.list_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const listTypeMatch = list.list_type
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = list.list_name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const userIdMatch = list.user_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchId || listTypeMatch || nameMatch || userIdMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    lists,
    customFilter
  );

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
    <Box marginTop="5rem" maxHeight="500px">
      <Flex justifyContent="space-between" alignItems="center">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar..."
          value={searchTerm}
        />
      </Flex>
      <Box maxHeight="500px" marginTop="1rem" overflowY="auto">
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
            {filteredData.map((list) => (
              <Tr key={list.list_id}>
                <Td>{list.list_id}</Td>
                <Td>{list.list_type}</Td>
                <Td>{list.list_name}</Td>
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
                  {!editingRows.includes(list.list_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(list.list_id)}
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
      </Box>
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
