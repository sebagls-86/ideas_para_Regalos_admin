import React, {useEffect} from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function EventsDataFetcher() {
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/events`;
  const token = localStorage.getItem("token");
  
  const { FeedbackModal } = useFeedbackModal();

  const {
    data: events,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    showFeedbackModal,
    FeedbackModal: FBModalPatch,
    feedbackMessagePatch,
    setEditingData,
    handleCancel,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  const customFilter = (EventType, searchTerm) => {
    return EventType.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    events,
    customFilter
  );

  useEffect(() => {
    editingRows.forEach((eventId) => {
      setEditingData((prevEditingData) => ({
        ...prevEditingData,
        [eventId]: {
          ...prevEditingData[eventId],
          ...events.find((event) => event.event_id === eventId),
        },
      }));
    });
  }, [editingRows, events, setEditingData]);


  return (
    <Box marginTop="5rem" maxHeight="500px">
      <Flex justifyContent="space-between" alignItems="center">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar..."
          value={searchTerm}
        />
      </Flex>

      <Box maxHeight="500px" overflowY="auto">
        <Table variant="simple" className="table-container">
          <Thead className="sticky-header">
            <Tr>
              <Th>ID</Th>
              <Th>User ID</Th>
              <Th>Nombre</Th>
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
              <Tr key={event.event_id}>
                <Td>{event.event_id}</Td>
                <Td>{event.user_id}</Td>
                <Td>{event.name}</Td>
                <Td>
                  {!editingRows.includes(event.event_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(event.event_id)}
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
      </Box>
      <FeedbackModal />
      <FeedbackModal />
      {FBModalPatch && (
        <FBModalPatch
          isOpen={showFeedbackModal}
          onClose={() => showFeedbackModal(false)}
          feedbackMessage={feedbackMessagePatch}
        />
      )}
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este evento?"
      )}
    </Box>
  );
}

export default EventsDataFetcher;
