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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes, FaComments } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ForumsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/forums";
  const [selectedForum, setSelectedForum] = useState(null);
  const token = useContext(TokenContext).token;

  const {
    data: forums,
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


  const handleViewMessages = (forumId) => {
    const selected = forums.find((forum) => forum.forum_id === forumId);
    setSelectedForum(selected);
  };

  const handleCloseMessages = () => {
    setSelectedForum(null);
  };


  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Título</Th>
            <Th>Descripción</Th>
            <Th>Mensajes</Th>
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
          {forums.map((forum) => (
            <Tr key={forum.forum_id}>
              <Td>{forum.forum_id}</Td>
              <Td>
                {editingRows.includes(forum.forum_id) ? (
                  <Input
                    value={forum.title}
                    onChange={(e) => handleEdit(forum.forum_id)}
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
                    value={forum.description}
                    onChange={(e) => handleEdit(forum.forum_id)}
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
              <Td>{forum.created_at}</Td>
              <Td>{forum.likes}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(forum.forum_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<Icon as={FaCheck} />}
                        onClick={() => handleSave(forum.forum_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<Icon as={FaTimes} />}
                        onClick={() => handleCancel(forum.forum_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<Icon as={FaEdit} />}
                      onClick={() => handleEdit(forum.forum_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(forum.forum_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(forum.forum_id)}
                    />
                  )}
                </Box>
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
                <div key={message.message_id}>
                  <p>Usuario: {message.user_name}</p>
                  <p>Mensaje: {message.message}</p>
                </div>
              ))
            ) : (
              <p>No hay mensajes disponibles para este foro.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseMessages}>
              Cerrar Mensajes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este foro?"
        )}
    </Box>
  );
}

export default ForumsDataFetcher;
