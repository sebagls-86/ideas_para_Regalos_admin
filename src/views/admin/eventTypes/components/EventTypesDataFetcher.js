import React, { useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Image,
  Select,
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
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function mapScheduledValue(value) {
  return value === 1 ? "Sí" : "No";
}

function EventsTypeDataFetcher() {
  const entity = "eventTypes";
  const apiEndpoint = "http://localhost:8080/api/v1/eventTypes";
  const token = localStorage.getItem("token");

  const {
    data: eventTypes,
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

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const customFilter = (EventType, searchTerm) => {
    return EventType.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    eventTypes,
    customFilter
  );

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
    postData,
  } = useDataPoster(apiEndpoint, token, reloadData, setShowErrorModal);

  const [newEventTypeData, setNewEventTypeData] = useState({
    name: "",
    scheduled: false,
    image: null,
  });

  const [newEventTypeErrors, setNewEventTypeErrors] = useState({
    name: "",
    scheduled: false,
    image: null,
  });

  const handleNewEventTypeChange = (value, name) => {
    setNewEventTypeErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    const newValue =
      name === "scheduled" ? value === "1" : name === "date" ? value : value;

    setNewEventTypeData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setNewEventTypeData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleCreateEventTypeModalClose = () => {
    handleModalClose();
    setNewEventTypeData({
      name: "",
      scheduled: false,
      image: null,
    });
    setNewEventTypeErrors({
      name: "",
      scheduled: false,
      image: null,
    });
  };

  const handleCreateEventTypeModalOpen = () => {
    handleModalOpen();
  };

  const validateNewEventTypeForm = () => {
    const errors = {
      name: "",
      scheduled: "",
      image: "",
    };

    if (!newEventTypeData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (
      !newEventTypeData.image ||
      !(newEventTypeData.image instanceof File) ||
      !newEventTypeData.image.name
    ) {
      errors.image = "La carga de la imagen es obligatoria.";
    }

    setNewEventTypeErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateEventType = async () => {
    const isFormValid = validateNewEventTypeForm();
    const scheduledValue = newEventTypeData.scheduled === true ? 1 : 0;

    const updatedEventTypeData = {
      ...newEventTypeData,
      scheduled: scheduledValue,
    };

    if (isFormValid) {
      postData(updatedEventTypeData, "formData");
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const [imagePreview, setImagePreview] = useState("");

  const handleEditChange = (e, fieldName, eventTypeId) => {
    if (!eventTypeId) {
      console.error("eventTypeId is not defined");
      return;
    }

    const newValue =
      e?.target?.type === "file" ? e.target.files[0] : e?.target?.value;

    if (newValue !== undefined) {
      setEditingData((prevEditingData) => ({
        ...prevEditingData,
        [eventTypeId]: {
          ...(prevEditingData[eventTypeId] || {}),
          [fieldName]: newValue,
        },
      }));

      if (e?.target?.type === "file") {
        const previewURL = URL.createObjectURL(e.target.files[0]);
        if (fieldName === "image") {
          setImagePreview(previewURL);
        }
      }
    }
  };

  const handleScheduledSave = async (eventTypeId) => {
    const editedScheduled = editingData[eventTypeId]?.scheduled;
    const isScheduledComplete =
      editedScheduled !== undefined && editedScheduled !== null;
    const areOtherFieldsEdited = Object.keys(editingData[eventTypeId] || {}).some(
      (field) => field !== "scheduled"
    );
  
    const scheduledToSend = isScheduledComplete
      ? parseInt(editedScheduled, 10)
      : editedScheduled;
  
    if (isScheduledComplete || areOtherFieldsEdited) {
      const updatedData = {
        ...editingData[eventTypeId],
        ...(scheduledToSend !== undefined && { scheduled: scheduledToSend }),
      };
  
      await handleSave(entity, eventTypeId, updatedData, "formData");
    }
  };

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
        <Button
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="25%"
          h="50"
          mb="24px"
          onClick={handleCreateEventTypeModalOpen}
        >
          Crear Tipo de Evento
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateEventTypeModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateEventTypeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Tipo de Evento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newEventTypeData.name}
                onChange={(e) =>
                  handleNewEventTypeChange(e.target.value, "name")
                }
                color="white"
              />
              <div style={{ color: "red" }}>{newEventTypeErrors.name}</div>
            </FormControl>
            <FormControl>
              <FormLabel>Programado</FormLabel>
              <Select
                name="scheduled"
                value={newEventTypeData.scheduled ? "1" : "0"}
                onChange={(e) =>
                  handleNewEventTypeChange(e.target.value, "scheduled")
                }
                color="white"
              >
                <option value="0">No</option>
                <option value="1">Sí</option>
              </Select>
              <div style={{ color: "red" }}>{newEventTypeErrors.scheduled}</div>
            </FormControl>
            <FormControl>
              <FormLabel>Imagen</FormLabel>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                color="white"
              />
              <div style={{ color: "red" }}>{newEventTypeErrors.image}</div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateEventType}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateEventTypeModalClose}>
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
              <Th>Programado</Th>
              <Th>Imagen</Th>
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
              <Tr key={event.event_type_id}>
                <Td>{event.event_type_id}</Td>
                <Td>
                  {editingRows.includes(event.event_type_id) ? (
                    <Input
                      value={
                        editingData[event.event_type_id]?.name || event.name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "name", event.event_type_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    event.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(event.event_type_id) ? (
                    <Select
                      name="scheduled"
                      value={
                        editingData[event.event_type_id]?.scheduled ||
                        event.scheduled
                      }
                      onChange={(e) =>
                        handleEditChange(e, "scheduled", event.event_type_id)
                      }
                      minWidth="100px"
                      color="white"
                    >
                      <option value="0">No</option>
                      <option value="1">Sí</option>
                    </Select>
                  ) : (
                    mapScheduledValue(event.scheduled)
                  )}
                </Td>
                <Td>
                  {editingRows.includes(event.event_type_id) ? (
                    <div>
                      <label htmlFor={`image-input-${event.event_type_id}`}>
                        <Input
                          id={`image-input-${event.event_type_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(e, "image", event.event_type_id)
                          }
                        />
                        <Image
                          src={
                            imagePreview ||
                            `http://localhost:8080${event.image}`
                          }
                          alt="Image Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(
                                `image-input-${event.event_type_id}`
                              )
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={`http://localhost:8080${event.image}`}
                      alt="Avatar"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(`http://localhost:8080${event.image}`)
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>

                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(event.event_type_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(event.event_type_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(event.event_type_id)
                      ? handleScheduledSave(event.event_type_id)
                        : handleEdit(event.event_type_id)
                    }
                  />
                  {!editingRows.includes(event.event_type_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(event.event_type_id)
                      }
                    />
                  )}
                  {editingRows.includes(event.event_type_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(event.event_type_id)}
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
        "¿Estás seguro de que deseas eliminar este tipo de evento?"
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
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default EventsTypeDataFetcher;
