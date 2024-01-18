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
  Button
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function MessagesDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/messages";
  const token = useContext(TokenContext).token;

  const {
    data: messages,
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
            <Th>Mensaje</Th>
            <Th>Usuario</Th>
            <Th>Foro ID</Th>
            <Th>Imágenes</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {messages.map((message) => (
            <Tr key={message.message_id}>
              <Td>{message.message_id}</Td>
              <Td>
                {editingRows.includes(message.message_id) ? (
                  <Input
                    value={message.message}
                    onChange={(e) => handleEdit(message.message_id)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  message.message
                )}
              </Td>
              <Td>{message.user_id}</Td>
              <Td>{message.forum_id}</Td>
              <Td>
                {editingRows.includes(message.message_id) ? (
                  <Input
                    value={message.message}
                    onChange={(e) => handleEdit(message.message_id)}
                    minWidth="100px"
                    color="white"
                  />
                ) : message.images ? (
                  message.images.join(", ")
                ) : (
                  "N/A"
                )}
              </Td>
              <Td>{new Date(message.date).toLocaleString()}</Td>
              <Td width="em">
                <IconButton
                  aria-label={
                    editingRows.includes(message.message_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(message.message_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(message.message_id)
                      ? handleSave(message.message_id, "name", message.name)
                      : handleEdit(message.message_id)
                  }
                />
                {!editingRows.includes(message.message_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(message.message_id)
                    }
                  />
                )}
                {editingRows.includes(message.message_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(message.message_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      )}
    </Box>
  );
}

export default MessagesDataFetcher;
