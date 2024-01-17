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
  Input,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

function ProductsCatalogDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/productsCatalog";
  const token = useContext(TokenContext).token;
  const [editingStatus, setEditingStatus] = useState({});

  const {
    data: productsCatalog,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleCloseTokenInvalidError,
    handleCloseErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

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
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {productsCatalog.map((product) => (
            <Tr key={product.product_catalog_id}>
              <Td>{product.product_catalog_id}</Td>
              <Td>
                {editingRows.includes(product.product_catalog_id) ? (
                  <Input
                    value={product.name}
                    onChange={(e) =>
                      handleEdit(
                        product.product_catalog_id,
                        "name",
                        e.target.value
                      )
                    }
                    style={{ color: "white" }}
                  />
                ) : (
                  product.name
                )}
              </Td>
              <Td>
            {editingRows.includes(product.product_catalog_id) ? (
              <select
                value={editingStatus[product.product_catalog_id] || product.status.toString()}
                onChange={(e) => {
                  handleEdit(product.product_catalog_id, "status", e.target.value);
                  setEditingStatus({
                    ...editingStatus,
                    [product.product_catalog_id]: e.target.value,
                  });
                }}
                style={{ color: "black" }}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
            ) : (
              product.status === 1 ? "Activo" : "Inactivo"
            )}
          </Td>
              
              <Td>
                {editingRows.includes(product.product_catalog_id) ? (
                  <Input
                    value={product.images}
                    onChange={(e) =>
                      handleEdit(
                        product.product_catalog_id,
                        "images",
                        e.target.value
                      )
                    }
                    style={{ color: "white" }}
                  />
                ) : product.images ? (
                  product.images.join(", ")
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(product.product_catalog_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(product.product_catalog_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(product.product_catalog_id)
                      ? handleSave(
                          product.product_catalog_id,
                          "name",
                          product.name
                        )
                      : handleEdit(product.product_catalog_id)
                  }
                />
                {!editingRows.includes(product.product_catalog_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(product.product_catalog_id)
                    }
                  />
                )}
                {editingRows.includes(product.product_catalog_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(product.product_catalog_id)}
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
        "¿Estás seguro de que deseas eliminar este producto?"
      )}
    </Box>
  );
}

export default ProductsCatalogDataFetcher;
