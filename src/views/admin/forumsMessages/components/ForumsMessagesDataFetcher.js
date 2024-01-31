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
  Tr,
  Th,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Image,
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

  const handleEditChange = (e, fieldName, forumMessageId, imageIndex) => {
    let newValue;

    if (e.target.type === "file") {
      newValue = e.target.files[0];

      // Actualizar temporalmente la imagen seleccionada
      setTemporaryImages((prevTemporaryImages) => ({
        ...prevTemporaryImages,
        [forumMessageId]: {
          ...(prevTemporaryImages[forumMessageId] || {}),
          [imageIndex]: URL.createObjectURL(newValue),
        },
      }));
    } else {
      newValue = e.target.value;
    }

    setEditingData((prevEditingData) => {
      const currentData = prevEditingData[forumMessageId] || {};
      const updatedImages = Array.isArray(currentData[fieldName])
        ? [...currentData[fieldName]]
        : [];

      // Actualizar las imágenes solo en la vista (sin enviar al formulario)
      updatedImages[imageIndex] = newValue;

      const updatedData = {
        ...prevEditingData,
        [forumMessageId]: {
          ...currentData,
          [fieldName]: updatedImages,
        },
      };

      return updatedData;
    });
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [temporaryImages, setTemporaryImages] = useState({});

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleEditImageClick = (forumMessageId, imageIndex) => {
    const fileInput = document.getElementById(
      `image-input-${forumMessageId}-${imageIndex}`
    );
    fileInput && fileInput.click();
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
                  {Array.isArray(message.images) &&
                    message.images.map((imageUrl, index) => (
                      <Td key={index}>
                        {editingRows.includes(message.message_id) ? (
                          <>
                            <Input
                              type="file"
                              accept="image/*"
                              id={`image-input-${message.message_id}-${index}`}
                              style={{ display: "none" }}
                              onChange={(e) =>
                                handleEditChange(
                                  e,
                                  "images",
                                  message.message_id,
                                  index
                                )
                              }
                            />
                            <Image
                              src={
                                temporaryImages[message.message_id]?.[index] ||
                                `http://localhost:8080${imageUrl}`
                              }
                              alt={`Imagen ${index + 1}`}
                              maxH="50px"
                              maxW="50px"
                              objectFit="cover"
                              onClick={() =>
                                handleEditImageClick(message.message_id, index)
                              }
                              cursor="pointer"
                            />
                          </>
                        ) : (
                          <Image
                            src={`http://localhost:8080${imageUrl}`}
                            alt={`Imagen ${index + 1}`}
                            maxH="50px"
                            maxW="50px"
                            objectFit="cover"
                            onClick={() =>
                              handleImageClick(
                                `http://localhost:8080${imageUrl}`
                              )
                            }
                            cursor="pointer"
                          />
                        )}
                      </Td>
                    ))}
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
                            editingData[message.message_id],
                            "formData"
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
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Imagen seleccionada"
                maxH="80vh"
                maxW="80vw"
                objectFit="contain"
              />
            )}
          </ModalBody>
          <ModalFooter>
            {/* Puedes agregar botones de acciones adicionales aquí */}
          </ModalFooter>
        </ModalContent>
      </Modal>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este mensaje?"
      )}
    </Box>
  );
}

export default MessagesDataFetcher;
