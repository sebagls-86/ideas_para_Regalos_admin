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
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function EventsDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/events";
  const token = useContext(TokenContext).token;

  const {
    data: events,
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
            <Th>Nombre</Th>
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
          {events.map((event) => (
            <Tr key={event.event_id}>
              <Td>{event.event_id}</Td>
              <Td>
                {editingRows.includes(event.event_id) ? (
                  <Input
                    value={event.name}
                    onChange={(e) => handleEdit(event.event_id)}
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
                    value={event.image}
                    onChange={(e) => handleEdit(event.event_id)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  event.image
                )}
              </Td>
              <Td width="em">
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
                      ? handleSave(event.event_id, "name", event.name)
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este evento?"
        )}
   </Box>
  );
}

export default EventsDataFetcher;
