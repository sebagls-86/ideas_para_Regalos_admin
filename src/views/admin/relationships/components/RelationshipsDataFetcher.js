import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
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

function RelationshipsDataFetcher() {
  const entity = "relationships";
  const apiEndpoint = "http://localhost:8080/api/v1/relationships";
  const token = useContext(TokenContext).token;

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: Relationships,
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

  const customFilter = (relationships, searchTerm) => {
    return relationships.relationship_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    Relationships,
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
    "Categoria creada con éxito",
    "Error al crear categoria",
    reloadData,
    setShowErrorModal
  );

  const [newRelationshipsData, setNewRelationshipsData] = useState({
    name: "",
  });

  const [newRelationshipsErrors, setNewRelationshipsErrors] = useState({
    name: "",
  });

  const handleNewRelationshipsChange = (e) => {
    const { name, value } = e.target;
    setNewRelationshipsErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewRelationshipsData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateRelationshipsModalClose = () => {
    handleModalClose();
    setNewRelationshipsData({
      name: "",
    });
    setNewRelationshipsErrors({
      name: "",
    });
  };

  const handleCreateRelationshipsModalOpen = () => {
    handleModalOpen();
  };

  const validateNewRelationshipsForm = () => {
    const errors = {
      name: "",
    };

    if (!newRelationshipsData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    setNewRelationshipsErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateRelationships = async () => {
    const isFormValid = validateNewRelationshipsForm();

    if (isFormValid) {
      postData(newRelationshipsData);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const handleEditChange = (e, fieldName, categoryId) => {
    const newValue = e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [categoryId]: {
        ...prevEditingData[categoryId],
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
          onClick={handleCreateRelationshipsModalOpen}
        >
          Crear Categoria
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateRelationshipsModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateRelationshipsModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Relacion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newRelationshipsData.relationship_name}
                onChange={handleNewRelationshipsChange}
                color="white"
              />
              <div style={{ color: "red" }}>
                {newRelationshipsErrors.relationship_name}
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateRelationships}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateRelationshipsModalClose}>
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
            {filteredData.map((relationship) => (
              <Tr key={relationship.relationship_id}>
                <Td>{relationship.relationship_id}</Td>
                <Td>
                  {editingRows.includes(relationship.relationship_id) ? (
                    <Input
                      value={
                        editingData[relationship.relationship_id]?.relationship_name ||
                        relationship.relationship_name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "relationship_name", relationship.relationship_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    relationship.relationship_name
                  )}
                </Td>
                <Td>
                  <IconButton
                    aria-label={
                      editingRows.includes(relationship.relationship_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(relationship.relationship_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(relationship.relationship_id)
                        ? handleSave(
                            entity,
                            relationship.relationship_id,
                            editingData[relationship.relationship_id]
                          )
                        : handleEdit(relationship.relationship_id)
                    }
                  />
                  {!editingRows.includes(relationship.relationship_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(relationship.relationship_id)
                      }
                    />
                  )}
                  {editingRows.includes(relationship.relationship_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(relationship.relationship_id)}
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
        "¿Estás seguro de que deseas eliminar esta relacion?"
      )}
    </Box>
  );
}

export default RelationshipsDataFetcher;
