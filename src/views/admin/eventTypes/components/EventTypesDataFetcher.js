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

function mapScheduledValue(value) {
  return value === 1 ? "Sí" : "No";
}


function EventsTypeDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/eventTypes";
  const token = useContext(TokenContext).token;

  const {
    data: eventTypes,
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
          {eventTypes.map((event) => (
            <Tr key={event.event_type_id}>
              <Td>{event.event_type_id}</Td>
              <Td>
                {editingRows.includes(event.event_id) ? (
                  <Input
                    value={event.name}
                    onChange={(e) => handleEdit(event.event_type_id)}
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
                    onChange={(e) => handleEdit(event.event_type_id)}
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
                    value={event.scheduled}
                    onChange={(e) => handleEdit(event.event_type_id)}
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
                    value={event.scheduled}
                    onChange={(e) => handleEdit(event.event_type_id)}
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
                    onClick={() => handleDeleteConfirmation(event.event_type_id)}
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este tipo de evento?"
        )}
   </Box>
  );
}

export default EventsTypeDataFetcher;
