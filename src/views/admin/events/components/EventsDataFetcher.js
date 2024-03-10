import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  IconButton,
  Icon,
  Input,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function EventsDataFetcher() {
  const entity = "events";
  const apiEndpoint = "http://localhost:8080/api/v1/events";
  const token = useContext(TokenContext).token;

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: events,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    editingData,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
    feedbackMessagePatch,
    setEditingData,
    setShowErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
    reloadData,
  } = useDataFetcher(apiEndpoint, token);

  const customFilter = (EventType, searchTerm) => {
    return EventType.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    events,
    customFilter
  );

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
    postData,
  } = useDataPoster(
    apiEndpoint,
    token,
    "Evento creada con éxito",
    "Error al crear evento",
    reloadData,
    setShowErrorModal
  );

  const [newEventsData, setNewEventsData] = useState({
    name: "",
    image: 0,
  });

  const [newEventsErrors, setNewEventsErrors] = useState({
    name: "",
    image: "",
  });

  const handleNewEventsChange = (e) => {
    const { name, value } = e.target;
    setNewEventsErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewEventsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateEventsModalClose = () => {
    handleModalClose();
    setNewEventsData({
      name: "",
      image: "",
    });
    setNewEventsErrors({
      name: "",
      image: "",
    });
  };

  const handleCreateEventsModalOpen = () => {
    handleModalOpen();
  };

  const validateNewEventsForm = () => {
    const errors = {
      name: "",
      image: "",
    };

    if (!newEventsData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (!newEventsData.image) {
      errors.name = "La carga de la imagen es obligatoria.";
    }

    setNewEventsErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateEvents = async () => {
    const isFormValid = validateNewEventsForm();

    if (isFormValid) {
      postData(newEventsData);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const handleEditChange = (e, fieldName, eventId) => {
    const newValue = e.target.type === "file" ? e.target.files[0] : e.target.value;
  
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [eventId]: {
        ...prevEditingData[eventId],
        [fieldName]: newValue,
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
      <Button
        fontSize="sm"
        variant="brand"
        fontWeight="500"
        w="25%"
        h="50"
        mb="24px"
        onClick={handleCreateEventsModalOpen}
      >
        Crear Evento
      </Button>
    </Flex>
    {FBModal && (
      <FBModal
        isOpen={showModal}
        onClose={handleCreateEventsModalClose}
        feedbackMessage={feedbackMessage}
      />
    )}
    <Modal isOpen={showModal} onClose={handleCreateEventsModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Crear Evento</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              type="text"
              name="name"
              value={newEventsData.name}
              onChange={handleNewEventsChange}
              color="white"
            />
            <div style={{ color: "red" }}>{newEventsErrors.name}</div>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleCreateEvents}>
            Crear
          </Button>
          <Button variant="ghost" onClick={handleCreateEventsModalClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <Box maxHeight="500px" overflowY="auto">
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
            {filteredData.map((event) => (
              <Tr key={event.event_id}>
                <Td>{event.event_id}</Td>
                <Td>
                  {editingRows.includes(event.event_id) ? (
                    <Input
                      value={
                        editingData[event.event_id]?.name || event.name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "name", event.event_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    event.name
                  )}
                </Td>
                <Td>
                  <IconButton
                    aria-label={
                      editingRows.includes(event.event_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(event.event_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(event.event_id)
                        ? handleSave(
                            entity,
                            event.event_id,
                            editingData[event.event_id],
                            'formData'
                          )
                        : handleEdit(event.event_id)
                    }
                  />
                  {!editingRows.includes(event.event_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(event.event_id)
                      }
                    />
                  )}
                  {editingRows.includes(event.event_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(event.event_id)}
                    ></Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <FeedbackModal />
      <FeedbackModal />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage={feedbackMessagePatch}
        />
      )}
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este evento?"
      )}
    </Box>
  );
}

export default EventsDataFetcher;
