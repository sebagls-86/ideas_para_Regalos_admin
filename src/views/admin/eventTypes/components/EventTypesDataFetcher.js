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

function mapScheduledValue(value) {
  return value === 1 ? "Sí" : "No";
}

function EventsTypeDataFetcher() {
  const [events, setEvents] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

  const handleEdit = (eventTypeId) => {
    setEditingRows([...editingRows, eventTypeId]);
  };

  const handleSave = async (eventTypeId, field, value) => {
    try {
      if (field === "event_type_id") {
        console.error("No se puede editar el ID del tipo de evento.");
        return;
      }

      const updatedEvents = events.map((event) => {
        if (event.event_type_id === eventTypeId) {
          return { ...event, [field]: value };
        }
        return event;
      });

      setEvents(updatedEvents);
      setEditingRows(editingRows.filter((row) => row !== eventTypeId));

      await fetch(`http://localhost:8080/api/v1/eventTypes/${eventTypeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(
        `Campo ${field} del tipo de evento ${eventTypeId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (eventTypeId) => {
    setEditingRows(editingRows.filter((row) => row !== eventTypeId));
  };

  const handleDelete = (eventTypeId) => {
    setEventToDelete(eventTypeId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDeleteAction(eventToDelete);
    setShowDeleteModal(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const handleDeleteAction = async (eventTypeId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/eventTypes/${eventTypeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedEvents = events.filter(
        (event) => event.event_type_id !== eventTypeId
      );
      setEvents(updatedEvents);

      console.log(`Tipo de evento con ID ${eventTypeId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el tipo de evento:", error);
    }
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/eventTypes", requestOptions)
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
        console.error("Error al obtener los datos de tipos de eventos:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
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
        <Tbody className="scrollable-content">
          {events.map((event) => (
            <Tr key={event.event_type_id}>
              <Td>{event.event_type_id}</Td>
              <Td>
                {editingRows.includes(event.event_type_id) ? (
                  <Input
                    value={event.name}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_type_id === event.event_type_id
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
                {editingRows.includes(event.event_type_id) ? (
                  <Input
                    value={event.scheduled}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_type_id === event.event_type_id
                            ? { ...ev, scheduled: e.target.value }
                            : ev
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  mapScheduledValue(event.scheduled)
                )}
              </Td>
              <Td>
                {editingRows.includes(event.event_type_id) ? (
                  <Input
                    value={event.image}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_type_id === event.event_type_id
                            ? { ...ev, image: e.target.value }
                            : ev
                        )
                      )
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
                  <Input
                    value={event.date}
                    onChange={(e) =>
                      setEvents((prevEvents) =>
                        prevEvents.map((ev) =>
                          ev.event_type_id === event.event_type_id
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
                      ? handleSave(event.event_type_id)
                      : handleEdit(event.event_type_id)
                  }
                />
                {!editingRows.includes(event.event_type_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleDelete(event.event_type_id)}
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
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este tipo de evento?
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

export default EventsTypeDataFetcher;
