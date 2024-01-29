import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
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
  const token = useContext(TokenContext).token;

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
    date: null,
  });

  const [newEventTypeErrors, setNewEventTypeErrors] = useState({
    name: "",
    scheduled: false,
    image: null,
    date: "",
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
      date: null,
    });
    setNewEventTypeErrors({
      name: "",
      scheduled: false,
      image: null,
      date: null,
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
      newEventTypeData.scheduled !== true &&
      newEventTypeData.scheduled !== false
    ) {
      errors.scheduled = "Marcar si es un evento calendarizado o no.";
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

    if (isFormValid) {
      postData(newEventTypeData);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const [scheduledValue, setScheduledValue] = useState("0");

  const handleEditChange = (value, field, eventTypeId, e) => {
    // Validación para fecha cuando "Programado" es "Sí"
    if (field === "date" && scheduledValue === "1" && !value) {
      // Si la fecha está vacía y "Programado" es "Sí", no actualizamos el estado
      return;
    }
  
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [eventTypeId]: {
        ...prevEditingData[eventTypeId],
        [field]: field === "image" ? (e.target.type === "file" ? e.target.files[0] : null) : value,
      },
    }));
  
    // Actualiza el valor de "Programado" si se está editando ese campo
    if (field === "scheduled") {
      setScheduledValue(value);
  
      // Si se cambia a "No", limpia la fecha
      if (value === "0") {
        setEditingData((prevEditingData) => ({
          ...prevEditingData,
          [eventTypeId]: {
            ...prevEditingData[eventTypeId],
            date: null,
          },
        }));
      } else if (value === "1" && !editingData[eventTypeId]?.date) {
        // Si se cambia a "Sí" y la fecha está vacía, establece la fecha actual
        setEditingData((prevEditingData) => ({
          ...prevEditingData,
          [eventTypeId]: {
            ...prevEditingData[eventTypeId],
            date: new Date(),
          },
        }));
      }
    }
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
            {newEventTypeData.scheduled && (
              <FormControl>
                <FormLabel>Fecha</FormLabel>
                <DatePicker
                  selected={newEventTypeData.date}
                  onChange={(date) => handleNewEventTypeChange(date, "date")}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="Seleccionar fecha"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                  className="useDataFetcher"
                />
                <div style={{ color: "red" }}>{newEventTypeErrors.date}</div>
              </FormControl>
            )}
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
                      value={editingData[event.event_type_id]?.scheduled || "0"}
                      onChange={(e) =>
                        handleEditChange(
                          e.target.value,
                          "scheduled",
                          event.event_type_id,
                          e
                        )
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
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditChange(e, "image", event.event_type_id, e)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    event.image
                  )}
                </Td>
                <Td>
                  {editingRows.includes(event.event_type_id) ? (
                    <DatePicker
                      selected={
                        editingData[event.event_type_id]?.date ||
                        (event.date
                          ? new Date(convertToCorrectDateFormat(event.date))
                          : null)
                      }
                      onChange={(date) =>
                        handleEditChange(date, "date", event.event_type_id)
                      }
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      className="date-picker"
                      disabled={scheduledValue === "0"}
                    />
                  ) : (
                    event.date
                  )}
                </Td>
                <Td>
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
                        ? handleSave(
                            entity,
                            event.event_type_id,
                            editingData[event.event_type_id],
                            "formData"
                          )
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
    </Box>
  );
}

export default EventsTypeDataFetcher;
