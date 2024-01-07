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

function EventsDataFetcher() {
  const [events, setEvents] = useState([]);
  const [originalEvents, setOriginalEvents] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/events", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setEvents(data.data);
          setOriginalEvents(data.data);
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

  const handleEdit = (eventId) => {
    setEditingRows([...editingRows, eventId]);
  };

  const handleSave = async (eventId, field, value) => {
    try {
      if (field === "event_id") {
        console.error("No se puede editar el ID del evento.");
        return;
      }

      const updatedEvents = events.map((event) => {
        if (event.event_id === eventId) {
          return { ...event, [field]: value };
        }
        return event;
      });

      setEvents(updatedEvents);
      setEditingRows(editingRows.filter((row) => row !== eventId));

      await fetch(`http://localhost:8080/api/v1/events/${eventId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(
        `Campo ${field} del evento ${eventId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (eventId) => {
    const updatedEvents = events.map((event) => {
      const originalEvent = originalEvents.find(
        (originalEvent) => originalEvent.event_id === event.event_id
      );
      return originalEvent ? { ...originalEvent } : event;
    });

    setEvents(updatedEvents);
    setEditingRows(editingRows.filter((row) => row !== eventId));
  };

  const handleDelete = async (eventId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedEvents = events.filter(
        (event) => event.event_id !== eventId
      );
      setEvents(updatedEvents);
      setShowDeleteConfirmation(false); // Close delete confirmation modal

      console.log(`Evento con ID ${eventId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Tipo de Evento</Th>
            <Th>Nombre</Th>
            <Th>Fecha</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {events.map((event) => (
            <Tr key={event.event_id}>
              <Td>{event.event_id}</Td>
              <Td>
                {editingRows.includes(event.event_id) ? (
                  <Input
                    value={event.event_type_id}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_id === event.event_id
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
                {editingRows.includes(event.event_id) ? (
                  <Input
                    value={event.name}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_id === event.event_id
                            ? { ...ev, name: e.target.value }
                            : ev
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  event.name
                )}
              </Td>
              <Td>
                {editingRows.includes(event.event_id) ? (
                  <Input
                    value={event.date}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_id === event.event_id
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
                    editingRows.includes(event.event_id) ? "Guardar" : "Editar"
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
                      ? handleSave(event.event_id)
                      : handleEdit(event.event_id)
                  }
                />
                {!editingRows.includes(event.event_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => {
                      setDeleteConfirmationId(event.event_id);
                      setShowDeleteConfirmation(true);
                    }}
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

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este evento?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleDelete(deleteConfirmationId)}>
              Eliminar
            </Button>
            <Button variant="ghost" onClick={() => setShowDeleteConfirmation(false)}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default EventsDataFetcher;
