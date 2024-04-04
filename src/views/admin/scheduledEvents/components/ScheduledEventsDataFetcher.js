import React, { useContext, useState, useEffect } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import DatePicker from "react-datepicker";
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
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ScheduledEventsDataFetcher() {
  const entity = "scheduledEvents";
  const apiEndpoint = "http://localhost:8080/api/v1/scheduledEvents";
  const token = localStorage.getItem("token");
  const {
    data: scheduledEvents,
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

  const customFilter = (ScheduledEvent, searchTerm) => {
    const eventTypeId = ScheduledEvent.scheduled_event_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const eventTypeMatch = ScheduledEvent.event_type_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateMatch = ScheduledEvent.date
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return eventTypeMatch || dateMatch || eventTypeId;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    scheduledEvents,
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

  const [eventOptions, setEventOptions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [newScheduledEventData, setNewScheduledEventData] = useState({
    event_type_id: selectedEvent,
    date: null,
  });

  const [newScheduledEventErrors, setNewScheduledEventErrors] = useState({
    event_type_id: "",
    date: null,
  });

  const handleNewScheduledEventChange = (value, name) => {
    setNewScheduledEventErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    const newValue =
      name === "event_type_id" ? value : name === "date" ? value : value;

    setNewScheduledEventData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleCreateScheduledEventModalClose = () => {
    handleModalClose();
    setNewScheduledEventData({
      event_type_id: selectedEvent,
      date: null,
    });
    setNewScheduledEventErrors({
      event_type_id: "",
      date: null,
    });
  };

  const handleCreateScheduledEventModalOpen = () => {
    handleModalOpen();
    setNewScheduledEventData({
      event_type_id: "",
      date: null,
    });
    setNewScheduledEventErrors({
      event_type_id: "",
      date: null,
    });
  };

  const validateNewScheduledEventForm = () => {
    const errors = {
      event_type_id: null,
      date: null,
    };

    if (
      !newScheduledEventData.event_type_id &&
      newScheduledEventData.event_type_id !== null
    ) {
      errors.event_type_id = "El evento es obligatorio";
    }

    if (!newScheduledEventData.date && newScheduledEventData.date !== null) {
      errors.date = "La fecha del evento es obligatoria";
    }

    setNewScheduledEventErrors(errors);

    return Object.values(errors).every(
      (error) => error === null || error === ""
    );
  };

  const handleCreateScheduledEvent = async () => {
    const isFormValid = validateNewScheduledEventForm();

    if (isFormValid) {
      const eventDataToSend = {
        ...newScheduledEventData,
        event_type_id: parseInt(newScheduledEventData.event_type_id, 10),
      };
      postData(eventDataToSend);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  useEffect(() => {
    const fetchEventOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/scheduledEvents"
        );
        const result = await response.json();
        const eventData = result.data || [];

        setEventOptions(eventData);
      } catch (error) {
        console.error("Error fetching event options:", error);
      }
    };
    fetchEventOptions();
  }, []);

  const handleEditChange = (value, fieldName, eventId) => {
    const numericValue =
      fieldName === "event_type_id" ? parseInt(value, 10) : value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [eventId]: {
        ...prevEditingData[eventId],
        [fieldName]: numericValue,
      },
    }));
  };

  const convertToCorrectDateFormat = (backendDate) => {
    const [day, month, year] = backendDate.split("/");
    return `${month}-${day}-${year}`;
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
          onClick={handleCreateScheduledEventModalOpen}
        >
          Crear Evento Calendarizado
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateScheduledEventModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateScheduledEventModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Evento Calendarizado</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Evento</FormLabel>
              <Select
                value={newScheduledEventData.event_type_id}
                onChange={(e) =>
                  handleNewScheduledEventChange(e.target.value, "event_type_id")
                }
              >
                {eventOptions ? (
                  Array.isArray(eventOptions) && eventOptions.length > 0 ? (
                    eventOptions.map((option) => (
                      <option
                        key={option.event_type_id}
                        value={option.event_type_id}
                      >
                        {option.event_type_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      No hay opciones disponibles
                    </option>
                  )
                ) : (
                  <option value="" disabled>
                    Cargando opciones...
                  </option>
                )}
              </Select>
              <div style={{ color: "red" }}>
                {newScheduledEventErrors.event_type_id}
              </div>
            </FormControl>
            <FormControl>
              <FormLabel>Fecha</FormLabel>
              <DatePicker
                selected={newScheduledEventData.date}
                onChange={(date) => handleNewScheduledEventChange(date, "date")}
                dateFormat="dd-MM-yyyy"
                placeholderText="Seleccionar fecha"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                className="useDataFetcher"
              />
              <div style={{ color: "red" }}>{newScheduledEventErrors.date}</div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateScheduledEvent}
            >
              Crear
            </Button>
            <Button
              variant="ghost"
              onClick={handleCreateScheduledEventModalClose}
            >
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
            {filteredData.map((event) => (
              <Tr key={event.scheduled_event_id}>
                <Td>{event.scheduled_event_id}</Td>
                <Td>
                  {editingRows.includes(event.scheduled_event_id) ? (
                    <Select
                      value={
                        editingData[event.scheduled_event_id]?.event_type_id ||
                        event.event_type_id
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e.target.value,
                          "event_type_id",
                          event.scheduled_event_id
                        )
                      }
                    >
                      {eventOptions ? (
                        eventOptions.map((option) => (
                          <option
                            key={option.event_type_id}
                            value={option.event_type_id}
                          >
                            {option.event_type_name}
                          </option>
                        ))
                      ) : (
                        <option value="">No hay opciones disponibles</option>
                      )}
                    </Select>
                  ) : (
                    event.event_type_name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(event.scheduled_event_id) ? (
                    <DatePicker
                      selected={
                        editingData[event.scheduled_event_id]?.date ||
                        new Date(convertToCorrectDateFormat(event.date))
                      }
                      onChange={(date) =>
                        handleEditChange(date, "date", event.scheduled_event_id)
                      }
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      className="date-picker"
                    />
                  ) : (
                    event.date
                  )}
                </Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(event.scheduled_event_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(event.scheduled_event_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(event.scheduled_event_id)
                        ? handleSave(
                            entity,
                            event.scheduled_event_id,
                            editingData[event.scheduled_event_id]
                          )
                        : handleEdit(event.scheduled_event_id)
                    }
                  />
                  {!editingRows.includes(event.scheduled_event_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(event.scheduled_event_id)
                      }
                    />
                  )}
                  {editingRows.includes(event.scheduled_event_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(event.scheduled_event_id)}
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
        "¿Estás seguro de que deseas eliminar este evento programado?"
      )}
    </Box>
  );
}

export default ScheduledEventsDataFetcher;
