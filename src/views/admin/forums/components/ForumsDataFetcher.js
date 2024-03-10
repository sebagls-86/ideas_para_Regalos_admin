import React, { useContext, useState } from "react";
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
  Text,
  Tr,
  Th,
  Td,
  Flex,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  IconButton,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes, FaComments } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function mapStatusValue(value) {
  return value === 1 ? "Activo" : "Inactivo";
}

function ForumsDataFetcher() {
  const entity = "forums";
  const apiEndpoint = "http://localhost:8080/api/v1/forums";
  const [selectedForum, setSelectedForum] = useState(null);
  const token = useContext(TokenContext).token;

  const { FeedbackModal } = useFeedbackModal();

  const {
    data: forums,
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

  const customFilter = (forums, searchTerm) => {
    const idMatch = forums.forum_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const userMatch = forums.user_id
      .toString()
      .includes(searchTerm.toLowerCase());
    const titleMatch = forums.title
      .toString()
      .includes(searchTerm.toLowerCase());
    const descrMatch = forums.description
      .toString()
      .includes(searchTerm.toLowerCase());

    return idMatch || userMatch || titleMatch || descrMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    forums,
    customFilter
  );

  const handleViewMessages = (forumId) => {
    const selected = forums.find((forum) => forum.forum_id === forumId);
    setSelectedForum(selected);
  };

  const handleCloseMessages = () => {
    setSelectedForum(null);
  };

  const handleEditChange = (e, fieldName, forumId) => {
    const newValue = e.target.value;
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [forumId]: {
        ...prevEditingData[forumId],
        [fieldName]: newValue,
      },
    }));
  };

  const handleStatuSave = async (forumId) => {
    const editedStatus = editingData[forumId]?.status;
    const isStatusComplete =
      editedStatus !== undefined && editedStatus !== null;
    const areOtherFieldsEdited = Object.keys(editingData[forumId] || {}).some(
      (field) => field !== "status"
    );

    const statusToSend = isStatusComplete
      ? parseInt(editedStatus, 10)
      : editedStatus;

    if (isStatusComplete || areOtherFieldsEdited) {
      // Si status está completo o hay otros campos editados, enviar a handleSave estándar
      await handleSave(entity, forumId, {
        ...editingData[forumId],
        status: statusToSend,
      });
    }
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
              <Th>User</Th>
              <Th>Título</Th>
              <Th>Descripción</Th>
              <Th>Mensajes</Th>
              <Th>Evento</Th>
              <Th>Estado</Th>
              <Th>Fecha de Creación</Th>
              <Th>Likes</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <TokenInvalidError
            isOpen={showTokenInvalidError}
            onClose={handleCloseTokenInvalidError}
          />
          <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
          <Tbody className="scrollable-content">
            {filteredData.map((forum) => (
              <Tr key={forum.forum_id}>
                <Td>{forum.forum_id}</Td>
                <Td>{forum.user_id}</Td>
                <Td>
                  {editingRows.includes(forum.forum_id) ? (
                    <Input
                      value={editingData[forum.forum_id]?.title || forum.title}
                      onChange={(e) =>
                        handleEditChange(e, "title", forum.forum_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    forum.title
                  )}
                </Td>
                <Td>
                  {editingRows.includes(forum.forum_id) ? (
                    <Input
                      value={
                        editingData[forum.forum_id]?.description ||
                        forum.description
                      }
                      onChange={(e) =>
                        handleEditChange(e, "description", forum.forum_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    forum.description
                  )}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Ver Mensajes"
                    icon={<Icon as={FaComments} />}
                    onClick={() => handleViewMessages(forum.forum_id)}
                  />
                </Td>
                <Td>{forum.event}</Td>
                <Td>
                  {editingRows.includes(forum.forum_id) ? (
                    <Select
                      value={
                        editingData[forum.forum_id]?.status || forum.status
                      }
                      onChange={(e) =>
                        handleEditChange(e, "status", forum.forum_id)
                      }
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </Select>
                  ) : (
                    mapStatusValue(forum.status)
                  )}
                </Td>
                <Td>{forum.created_at}</Td>
                <Td>{forum.likes}</Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(forum.forum_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(forum.forum_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(forum.forum_id)
                        ? handleStatuSave(forum.forum_id)
                        : handleEdit(forum.forum_id)
                    }
                  />
                  {!editingRows.includes(forum.forum_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(forum.forum_id)}
                    />
                  )}
                  {editingRows.includes(forum.forum_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(forum.forum_id)}
                    ></Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Modal isOpen={selectedForum} onClose={handleCloseMessages}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Mensajes de {selectedForum ? selectedForum.title : ""}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedForum && selectedForum.messages ? (
                selectedForum.messages.map((message) => (
                  <Box
                    key={message.message_id}
                    mb={4}
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    backgroundColor="teal.100"
                    color="teal.800"
                  >
                    <Text fontWeight="bold" fontSize="lg" color="teal.900">
                      Usuario: {message.user_name}
                    </Text>
                    <Text mt={2} color="teal.800">
                      {message.message}
                    </Text>
                  </Box>
                ))
              ) : (
                <Box
                  textAlign="center"
                  p={4}
                  borderRadius="md"
                  backgroundColor="teal.100"
                  color="teal.800"
                >
                  {" "}
                  {/* Ajusta colores aquí también */}
                  <Text>No hay mensajes disponibles para este foro.</Text>
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCloseMessages}>
                Cerrar Mensajes
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
        "¿Estás seguro de que deseas eliminar este foro?"
      )}
    </Box>
  );
}

export default ForumsDataFetcher;
