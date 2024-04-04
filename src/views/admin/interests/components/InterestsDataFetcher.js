import React, { useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
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
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function InterestsDataFetcher() {
  const entity = "interests";
  const apiEndpoint = "http://localhost:8080/api/v1/interests";
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: interests,
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

  const customFilter = (interests, searchTerm) => {
    const idMatch = interests.interest_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = interests.interest
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    return idMatch || nameMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    interests,
    customFilter
  );

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
    postData,
  } = useDataPoster(
    apiEndpoint,
    token,
    reloadData,
    setShowErrorModal
  );

  const [newInterestsData, setnewInterestsData] = useState({
    interest: "",
  });

  const [newInterestsErrors, setnewInterestsErrors] = useState({
    interest: "",
  });

  const handlenewInterestsChange = (e) => {
    const { name, value } = e.target;
    setnewInterestsErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setnewInterestsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateinterestsModalClose = () => {
    handleModalClose();
    setnewInterestsData({
      interest: "",
    });
    setnewInterestsErrors({
      interest: "",
    });
  };

  const handleCreateinterestsModalOpen = () => {
    handleModalOpen();
  };

  const validatenewInterestsForm = () => {
    const errors = {
      interest: "",
    };

    if (!newInterestsData.interest) {
      errors.interest = "El nombre es obligatorio.";
    }

    setnewInterestsErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateinterests = async () => {
    const isFormValid = validatenewInterestsForm();

    if (isFormValid) {
      postData(newInterestsData);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const handleEditChange = (e, fieldName, interestId) => {
    const newValue = e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [interestId]: {
        ...prevEditingData[interestId],
        [fieldName]: newValue,
      },
    }));
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
          onClick={handleCreateinterestsModalOpen}
        >
          Crear interés
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateinterestsModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateinterestsModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear interés</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="interest"
                value={newInterestsData.interest}
                onChange={handlenewInterestsChange}
                color="white"
              />
              <div style={{ color: "red" }}>{newInterestsErrors.interest}</div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateinterests}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateinterestsModalClose}>
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
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <TokenInvalidError
            isOpen={showTokenInvalidError}
            onClose={handleCloseTokenInvalidError}
          />
          <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
          <Tbody className="scrollable-content">
            {filteredData.map((interest) => (
              <Tr key={interest.interest_id}>
                <Td>{interest.interest_id}</Td>
                <Td>
                  {editingRows.includes(interest.interest_id) ? (
                    <Input
                      value={
                        editingData[interest.interest_id]?.interest ||
                        interest.interest
                      }
                      onChange={(e) =>
                        handleEditChange(e, "interest", interest.interest_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    interest.interest
                  )}
                </Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(interest.interest_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(interest.interest_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(interest.interest_id)
                        ? handleSave(
                            entity,
                            interest.interest_id,
                            editingData[interest.interest_id]
                          )
                        : handleEdit(interest.interest_id)
                    }
                  />
                  {!editingRows.includes(interest.interest_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(interest.interest_id)
                      }
                    />
                  )}
                  {editingRows.includes(interest.interest_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(interest.interest_id)}
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
        "¿Estás seguro de que deseas eliminar este interés?"
      )}
    </Box>
  );
}

export default InterestsDataFetcher;
