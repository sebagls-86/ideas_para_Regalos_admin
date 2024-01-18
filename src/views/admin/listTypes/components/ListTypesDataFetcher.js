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
  IconButton,
  Icon,
  Button,
  Input,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ListTypesDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/listtypes";
  const token = useContext(TokenContext).token;

  const {
    data: listTypes,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {listTypes.map((listType) => (
            <Tr key={listType.list_type_id}>
              <Td>{listType.list_type_id}</Td>
              <Td>
                {editingRows.includes(listType.list_type_id) ? (
                  <Input
                    value={listType.list_type_name}
                    onChange={(e) => handleEdit(listType.list_type_id)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  listType.list_type_name
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(listType.list_type_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(listType.list_type_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(listType.list_type_id)
                      ? handleSave(
                          listType.list_type_id,
                          "list_type_name",
                          listType.list_type_name
                        )
                      : handleEdit(listType.list_type_id)
                  }
                />
                {!editingRows.includes(listType.list_type_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(listType.list_type_id)
                    }
                  />
                )}
                {editingRows.includes(listType.list_type_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(listType.list_type_id)}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este tipo de lista?"
      )}
    </Box>
  );
}

export default ListTypesDataFetcher;
