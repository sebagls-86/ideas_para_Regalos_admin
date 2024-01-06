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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ScheduledEventsDataFetcher() {
  const [events, setEvents] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (eventId) => {
    setEditingRows([...editingRows, eventId]);
  };

  const handleSave = async (eventId, field, value) => {
    try {
      const updatedEvents = events.map((event) => {
        if (event.scheduled_event_id === eventId) {
          return { ...event, [field]: value };
        }
        return event;
      });
  
      setEvents(updatedEvents);
      setEditingRows(editingRows.filter((row) => row !== eventId));
  
      await fetch(`http://localhost:8080/api/v1/scheduledEvents/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
  
      console.log(`Campo ${field} del evento ${eventId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (eventId) => {
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

      const updatedEvents = events.filter(
        (event) => event.scheduled_event_id !== eventId
      );
      setEvents(updatedEvents);

      console.log(`Evento con ID ${eventId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const handleDeleteConfirmation = (eventId) => {
    setEventIdToDelete(eventId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(eventIdToDelete);
    setIsConfirmationOpen(false);
    setEventIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setEventIdToDelete(null);
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
          setEvents(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de eventos:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Tipo de evento</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {events.map((event) => (
            <Tr key={event.scheduled_event_id}>
              <Td>{event.scheduled_event_id}</Td>
              <Td>{event.event_type_id}</Td>
              <Td>{event.date}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(event.scheduled_event_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(event.scheduled_event_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(event.scheduled_event_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(event.scheduled_event_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(event.scheduled_event_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(event.scheduled_event_id)
                      }
                    />
                  )}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isConfirmationOpen} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Estás seguro de que deseas eliminar este evento?</ModalBody>
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
