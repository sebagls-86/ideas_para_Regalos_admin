import React, { useEffect, useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useDarkMode from "assets/darkModeHook";
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

function ListTypesDataFetcher() {
  const entity = "listtypes";
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/listtypes`;
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();
  const { isDarkMode } = useDarkMode();

  const {
    data: ListTypes,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    editingData,
    isFieldModified,
    isFieldEmpty,
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

  const customFilter = (listtypes, searchTerm) => {
    return listtypes.list_type_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    ListTypes,
    customFilter
  );

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
    postData,
  } = useDataPoster(apiEndpoint, token, reloadData, setShowErrorModal);

  const [newListTypesData, setNewListTypesData] = useState({
    list_type_name: "",
  });

  const [newListTypesErrors, setNewListTypesErrors] = useState({
    list_type_name: "",
  });

  const handleNewListTypesChange = (e) => {
    const { name, value } = e.target;
    setNewListTypesErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewListTypesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateListTypesModalClose = () => {
    handleModalClose();
    setNewListTypesData({
      list_type_name: "",
    });
    setNewListTypesErrors({
      list_type_name: "",
    });
  };

  const handleCreateListTypesModalOpen = () => {
    handleModalOpen();
  };

  const validateNewListTypesForm = () => {
    const errors = {
      list_type_name: "",
    };

    if (!newListTypesData.list_type_name) {
      errors.list_type_name = "El nombre es obligatorio.";
    }

    setNewListTypesErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateListTypes = async () => {
    const isFormValid = validateNewListTypesForm();

    if (isFormValid) {
      postData(newListTypesData);
    } else {
      openFeedbackModal("Formulario inválido");
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

  useEffect(() => {
    editingRows.forEach(listTypeId => {
      setEditingData(prevEditingData => {
        const updatedEditingData = { ...prevEditingData };
        const listTypeToUpdate = updatedEditingData[listTypeId];
  
        const updatedListType = ListTypes.find(listType => listType.list_type_id === listTypeId);
        const updatedListTypeData = {
          ...listTypeToUpdate,
          ...updatedListType
        };
  
        updatedEditingData[listTypeId] = updatedListTypeData;
  
        return updatedEditingData;
      });
    });
  }, [editingRows, ListTypes, setEditingData]);

  const handleSaveChanges = (listTypeId) => {
    const modifiedFields = Object.keys(editingData[listTypeId]).filter(
      (fieldName) =>
        isFieldModified(
          editingData,
          listTypeId,
          fieldName,
          ListTypes.find((listType) => listType.list_type_id === listTypeId)[
            fieldName
          ]
        )
    );

    if (
      modifiedFields.some((fieldName) =>
        isFieldEmpty(editingData, listTypeId, fieldName)
      )
    ) {
      openFeedbackModal("No puedes dejar campos modificados vacíos.");
    } else {
      const updatedData = modifiedFields.reduce((acc, fieldName) => {
        acc[fieldName] = editingData[listTypeId][fieldName];
        return acc;
      }, {});

      handleSave(entity, listTypeId, updatedData, "formData");
    }
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
          onClick={handleCreateListTypesModalOpen}
        >
          Crear List Type
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateListTypesModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateListTypesModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Tipo de lista</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="list_type_name"
                value={newListTypesData.list_type_name}
                onChange={handleNewListTypesChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>
                {newListTypesErrors.list_type_name}
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateListTypes}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateListTypesModalClose}>
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
          <Tbody
            className="scrollable-content"
            style={{ maxHeight: "calc(100vh - 11rem)", overflow: "auto" }}
          >
            {filteredData.map((listtype) => (
              <Tr key={listtype.list_type_id}>
                <Td>{listtype.list_type_id}</Td>
                <Td className="Td-input">
                  {editingRows.includes(listtype.list_type_id) ? (
                    <Input
                      value={
                        editingData[listtype.list_type_id]?.list_type_name
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "list_type_name",
                          listtype.list_type_id
                        )
                      }
                      minWidth="100px"
                      color="white"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    />
                  ) : (
                    listtype.list_type_name
                  )}
                </Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(listtype.list_type_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(listtype.list_type_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(listtype.list_type_id)
                        ? handleSaveChanges(listtype.list_type_id)
                        : handleEdit(listtype.list_type_id)
                    }
                  />
                  {!editingRows.includes(listtype.list_type_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(listtype.list_type_id)
                      }
                    />
                  )}
                  {editingRows.includes(listtype.list_type_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(listtype.list_type_id)}
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
        "¿Estás seguro de que deseas eliminar este tipo de lista?"
      )}
    </Box>
  );
}

export default ListTypesDataFetcher;
