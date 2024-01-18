import React, { useContext } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modalError/modalTokenInvalidError";
import useDataFetcher from "../../../../components/fetchData/useDataFetcher";
import ErrorModal from "../../../../components/modalError/modalError";
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
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ScheduledEventsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/scheduledEvents";
  const token = useContext(TokenContext).token;

  const {
    data: scheduledEvents,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);
  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Tipo de Evento</Th>
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
          {scheduledEvents.map((event) => (
            <Tr key={event.scheduled_event_id}>
              <Td>{event.scheduled_event_id}</Td>
              <Td>
                {editingRows.includes(event.scheduled_event_id) ? (
                  <Input
                    value={event.event_type_id}
                    onChange={(e) =>
                      handleEdit(
                        event.scheduled_event_id,
                        "event_type_id",
                        e.target.value
                      )
                    }
                    minWidth="50px"
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
                      handleEdit(
                        event.scheduled_event_id,
                        "date",
                        e.target.value
                      )
                    }
                    minWidth="50px"
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este evento programado?"
      )}
    </Box>
  );
}

export default ScheduledEventsDataFetcher;
