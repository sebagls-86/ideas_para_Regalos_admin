import React, { useContext } from "react";
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
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListProductsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/lists/listProducts";
  const token = useContext(TokenContext).token;
  
  const {
    data: productsCatalog,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleCustomDeleteConfirmation,
    handleCancel,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderCustomDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
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
          {productsCatalog.map((product) => (
            <Tr key={product.list_id}>
              <Td>{product.list_id}</Td>
              <Td>{product.product_catalog_id}</Td>
              <Td>
                <Button
                  aria-label="Eliminar"
                  leftIcon={<Icon as={FaTrash} />}
                  onClick={() =>
                    handleCustomDeleteConfirmation(
                      `http://localhost:8080/api/v1/lists/${product.list_id}/listProducts/${product.product_catalog_id}`,
                      product.list_id
                    )
                  }
                />
                {editingRows.includes(product.list_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(product.list_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderCustomDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      )}
    </Box>
  );
}

export default ListProductsDataFetcher;
