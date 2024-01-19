import React, { useContext } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Input,
  IconButton,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function mapEditedValue(value) {
  return value === 1 ? "Sí" : "No";
}

function MessagesDataFetcher() {
  const entity = "messages";
  const apiEndpoint = "http://localhost:8080/api/v1/messages";
  const token = useContext(TokenContext).token;

  const { FeedbackModal } = useFeedbackModal();

  const {
    data: messages,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    editingData,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
    feedbackMessagePatch,
    setEditingData,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  const customFilter = (messages, searchTerm) => {
    const idMatch = messages.message_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const messageMatch = messages.message
      .toString()
      .includes(searchTerm.toLowerCase());
    const userMatch = messages.user_id
      .toString()
      .includes(searchTerm.toLowerCase());
    const forumMatch = messages.forum_id
      .toString()
      .includes(searchTerm.toLowerCase());

    return idMatch || messageMatch || userMatch || forumMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    messages,
    customFilter
  );

  const handleEditChange = (e, fieldName, productCatalogId) => {
    let newValue;
  
    if (e.target.type === "file") {
      newValue = e.target.files[0];
    } else {
      newValue = e.target.value;
    }
  
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [productCatalogId]: {
        ...prevEditingData[productCatalogId],
        [fieldName]: fieldName === "images" ? [newValue] : newValue,
        // ^ Si el campo es 'images', asigna un array con el nuevo valor
      },
    }));
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
              <Th>Mensaje</Th>
              <Th>Usuario</Th>
              <Th>Foro ID</Th>
              <Th>Imágenes</Th>
              <Th>Fecha</Th>
              <Th>Editado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <TokenInvalidError
            isOpen={showTokenInvalidError}
            onClose={handleCloseTokenInvalidError}
          />
          <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
          <Tbody className="scrollable-content">
            {filteredData.map((message) => (
              <Tr key={message.message_id}>
                <Td>{message.message_id}</Td>
                <Td>
                  {editingRows.includes(message.message_id) ? (
                    <Input
                      value={
                        editingData[message.message_id]?.message ||
                        message.message
                      }
                      onChange={(e) =>
                        handleEditChange(e, "message", message.message_id)
                      }
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
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditChange(e, "image", message.message_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    message.images
                  )}
                </Td>
                <Td>{new Date(message.date).toLocaleString()}</Td>
                <Td>{mapEditedValue(message.edited)}</Td>
                <Td>
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
                        ? handleSave(
                            entity,
                            message.message_id,
                            editingData[message.message_id]
                          )
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
      </Box>
      <FeedbackModal />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage={feedbackMessagePatch}
        />
      )}
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      )}
    </Box>
  );
}

export default MessagesDataFetcher;
