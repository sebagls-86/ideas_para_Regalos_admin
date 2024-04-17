import React, { useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
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
import { FaTrash, FaTimes } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import "../../../../assets/css/Tables.css";

function ListsDataFetcher() {
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/lists`;
  const token = localStorage.getItem("token");
  const [selectedListProducts, setSelectedListProducts] = useState(null);
  const [listNames, setListNames] = useState({});
  const [listProducts, setListProducts] = useState({});
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: lists,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
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
        `${process.env.REACT_APP_API_URL}/lists/${listId}`,
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
      }
    } catch (error) {
      openFeedbackModal("Hubo un error en el servidor. Intente mas tarde");
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
                    icon={<Icon as={FaGift} />}
                    onClick={() => {
                      console.log("ID de la lista seleccionada:", list.list_id);
                      handleViewProducts(list.list_id);
                    }}
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
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => showFeedbackModal(false)}
      />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage=""
        />
      )}
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar esta lista?"
      )}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => showFeedbackModal(false)}
      />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage=""
        />
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
  {listProducts[selectedListProducts?.list_id] ? (
    // Verifica si hay datos de la lista y sus productos
    <div>
      {console.log("Datos de productos:", listProducts[selectedListProducts?.list_id][0].products)}
      {listProducts[selectedListProducts?.list_id][0].products && listProducts[selectedListProducts?.list_id][0].products.length > 0 ? (
        // Si hay productos, mapea sobre ellos
        listProducts[selectedListProducts?.list_id][0].products.map((product) => (
          <div key={product.list_product_id}>
            <p>List Product ID: {product.list_product_id}</p>
            <p>Product Catalog ID: {product.product_catalog_id}</p>
           <p>Nombre: {product.product}</p>
           <p>----------------------------</p>
          </div>
        ))
      ) : (
        // Si no hay productos, muestra un mensaje indicando que no hay productos disponibles
        <p>No hay productos disponibles para esta lista.</p>
      )}
    </div>
  ) : (
    // Si no hay datos, muestra un mensaje indicando que no hay productos disponibles
    <p>No hay datos disponibles para esta lista.</p>
  )}
</ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ListsDataFetcher;
