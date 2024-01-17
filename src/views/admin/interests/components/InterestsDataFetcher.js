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
  Input,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function InterestsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/interests";
  const token = useContext(TokenContext).token;

  const {
    data: interests,
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
            <Th>Interés</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {interests.map((interest) => (
            <Tr key={interest.interest_id}>
              <Td>{interest.interest_id}</Td>
              <Td>
                {editingRows.includes(interest.interest_id) ? (
                  <Input
                    value={interest.interest}
                    onChange={(e) => handleEdit(interest.interest_id)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  interest.interest
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(interest.interest_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(interest.interest_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(interest.interest_id)
                      ? handleSave(interest.interest_id, "name", interest.name)
                      : handleEdit(interest.interest_id)
                  }
                />
                {!editingRows.includes(interest.interest_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(interest.interest_id)
                    }
                  />
                )}
                {editingRows.includes(interest.interest_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(interest.interest_id)}
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
        "¿Estás seguro de que deseas eliminar este interés?"
      )}
    </Box>
  );
}

export default InterestsDataFetcher;
