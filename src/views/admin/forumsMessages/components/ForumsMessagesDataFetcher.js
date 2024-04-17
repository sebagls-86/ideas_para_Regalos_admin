import React, { useState } from "react";
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
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function mapEditedValue(value) {
  return value === 1 ? "Sí" : "No";
}

function MessagesDataFetcher() {
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/messages`;
  const token = localStorage.getItem("token");
  const { FeedbackModal } = useFeedbackModal();

  const {
    data: messages,
    showTokenInvalidError,
    showErrorModal,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
    feedbackMessagePatch,
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

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
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
                <Td style={{ width: "500px", maxWidth: "500px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{message.message}</Td>
                <Td>{message.user_id}</Td>
                <Td>{message.forum_id}</Td>
                <Td>
                  {(message.images || []).map((imageUrl, index) => (
                    <Td key={index}>
                      <Image
                        src={`${process.env.REACT_APP_URL_IMAGES}${imageUrl}`}
                        alt={`Imagen ${index + 1}`}
                        maxH="50px"
                        maxW="50px"
                        objectFit="cover"
                        onClick={() =>
                          handleImageClick(`${process.env.REACT_APP_URL_IMAGES}${imageUrl}`)
                        }
                        cursor="pointer"
                      />
                    </Td>
                  ))}
                </Td>
                <Td>{new Date(message.date).toLocaleString()}</Td>
                <Td>{mapEditedValue(message.edited)}</Td>
                <Td>
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(message.message_id)
                    }
                  />
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
