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

function RelationshipsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/relationships";
  const token = useContext(TokenContext).token;

  const {
    data: relationships,
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
          {relationships.map((relationship) => (
            <Tr key={relationship.relationship_id}>
              <Td>{relationship.relationship_id}</Td>
              <Td>
                {editingRows.includes(relationship.relationship_id) ? (
                  <Input
                    value={relationship.relationship_name}
                    onChange={(e) =>
                      handleEdit(relationship.relationship_id, "relationship_name", e.target.value)
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  relationship.relationship_name
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(relationship.relationship_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(relationship.relationship_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(relationship.relationship_id)
                      ? handleSave(relationship.relationship_id, "relationship_name", relationship.relationship_name)
                      : handleEdit(relationship.relationship_id)
                  }
                />
                {!editingRows.includes(relationship.relationship_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(relationship.relationship_id)
                    }
                  />
                )}
                {editingRows.includes(relationship.relationship_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(relationship.relationship_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderDeleteConfirmationModal(
        "¿Está seguro que desea eliminar esta relación?"
      )}
    </Box>
  );
}

export default RelationshipsDataFetcher;
