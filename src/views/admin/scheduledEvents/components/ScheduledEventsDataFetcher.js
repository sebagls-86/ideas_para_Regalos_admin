import React, { useState, useEffect } from "react";
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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ScheduledEventsDataFetcher() {
  const [scheduledEvents, setScheduledEvents] = useState([]);
  const [originalScheduledEvents, setOriginalScheduledEvents] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

  const handleEdit = (eventId) => {
    setEditingRows([...editingRows, eventId]);
  };

  const handleSave = async (eventId, field, value) => {
    try {
      const updatedScheduledEvents = scheduledEvents.map((event) => {
        if (event.scheduled_event_id === eventId) {
          return { ...event, [field]: value };
        }
        return event;
      });

      setScheduledEvents(updatedScheduledEvents);
      setEditingRows(editingRows.filter((row) => row !== eventId));

      await fetch(`http://localhost:8080/api/v1/scheduledEvents/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del evento programado ${eventId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (eventId) => {
    const updatedScheduledEvents = scheduledEvents.map((event) => {
      const originalEvent = originalScheduledEvents.find(
        (originalEvent) => originalEvent.scheduled_event_id === event.scheduled_event_id
      );
      return originalEvent ? { ...originalEvent } : event;
    });
    setScheduledEvents(updatedScheduledEvents);
    setEditingRows(editingRows.filter((row) => row !== eventId));
  };

  const handleDelete = async (eventId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/scheduledEvents/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedScheduledEvents = scheduledEvents.filter(
        (event) => event.scheduled_event_id !== eventId
      );
      setScheduledEvents(updatedScheduledEvents);

      console.log(`Evento programado con ID ${eventId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el evento programado:", error);
    }
  };

  const handleDeleteConfirmation = (eventId) => {
    setDeleteConfirmationId(eventId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(deleteConfirmationId);
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/scheduledEvents", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setScheduledEvents(data.data);
          setOriginalScheduledEvents(data.data); // Guarda la data original al cargar
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de eventos programados:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Tipo de Evento</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {scheduledEvents.map((event) => (
            <Tr key={event.scheduled_event_id}>
              <Td>{event.scheduled_event_id}</Td>
              <Td>
                {editingRows.includes(event.scheduled_event_id) ? (
                  <Input
                    value={event.event_type_id}
                    onChange={(e) =>
                      setScheduledEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.scheduled_event_id === event.scheduled_event_id
                            ? { ...ev, event_type_id: e.target.value }
                            : ev
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  event.event_type_id
                )}
              </Td>
              <Td>
                {editingRows.includes(event.scheduled_event_id) ? (
                  <Input
                    value={event.date}
                    onChange={(e) =>
                      setScheduledEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.scheduled_event_id === event.scheduled_event_id
                            ? { ...ev, date: e.target.value }
                            : ev
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  event.date
                )}
              </Td>
              <Td>
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
                      ? handleSave(event.scheduled_event_id, "date", event.date)
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

      <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este evento programado?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ScheduledEventsDataFetcher;
