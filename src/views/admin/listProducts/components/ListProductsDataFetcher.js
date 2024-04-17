import React, { useContext } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
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
} from "@chakra-ui/react";
import { FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListProductsDataFetcher() {
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/lists/list-products`;
  const token = localStorage.getItem("token");
  const { FeedbackModal } = useFeedbackModal();

  const {
    data: listProducts,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
    feedbackMessagePatch,
    handleCancel,
    handleCustomDeleteConfirmation,
    handleCloseTokenInvalidError,
    handleCloseErrorModal,
    renderCustomDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  const customFilter = (list, searchTerm) => {
    const matchId = list.list_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const listProductMatch = list.list_product
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchId || listProductMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    listProducts,
    customFilter
  );

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
              <Th>ID Lista</Th>
              <Th>Producto</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <TokenInvalidError
            isOpen={showTokenInvalidError}
            onClose={handleCloseTokenInvalidError}
          />
          <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
          <Tbody className="scrollable-content">
            {filteredData.map((listProducts) => (
              <Tr key={listProducts.list_id}>
                <Td>{listProducts.list_id}</Td>
                <Td>{listProducts.list_product}</Td>
                <Td>
                  {!editingRows.includes(listProducts.list_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleCustomDeleteConfirmation(
                          `${process.env.REACT_APP_API_URL}/lists/${listProducts.list_id}/list-products`,
                          listProducts.list_product_id
                        )
                      }
                    />
                  )}
                  {editingRows.includes(listProducts.list_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(listProducts.list_id)}
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
      <FeedbackModal />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage={feedbackMessagePatch}
        />
      )}
      {renderCustomDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este producto de esta lista?"
      )}
    </Box>
  );
}

export default ListProductsDataFetcher;
