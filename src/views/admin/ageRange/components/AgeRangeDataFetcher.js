import React, { useState, useEffect } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useDarkMode from "../../../../assets/darkModeHook";
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
  Image,
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
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function AgeRangeDataFetcher() {
  const entity = "age-ranges";
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/age-ranges`;
  const token = localStorage.getItem("token");
  const { isDarkMode } = useDarkMode();
  const [imagePreview, setImagePreview] = useState("");

  const {
    data: ageRanges,
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

  const customFilter = (ageRange, searchTerm) => {
    const nameMatch = ageRange.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const minAgeMatch = ageRange.minimum_age
      .toString()
      .includes(searchTerm.toLowerCase());
    const maxAgeMatch = ageRange.maximum_age
      .toString()
      .includes(searchTerm.toLowerCase());
    const idMatch = ageRange.age_range_id
      .toString()
      .includes(searchTerm.toLowerCase());

    return nameMatch || minAgeMatch || maxAgeMatch || idMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    ageRanges,
    customFilter
  );

  const [newAgeRangeData, setNewAgeRangeData] = useState({
    name: "",
    minimum_age: 0,
    maximum_age: 0,
  });

  const [newAgeRangeErrors, setNewAgeRangeErrors] = useState({
    name: "",
    minimum_age: "",
    maximum_age: "",
  });

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
    postData,
  } = useDataPoster(apiEndpoint, token, reloadData, setShowErrorModal);

  const handleCreateAgeRangeModalClose = () => {
    handleModalClose();
    setNewAgeRangeData({
      name: "",
      minimum_age: 0,
      maximum_age: 0,
      image: "",
    });
    setNewAgeRangeErrors({
      name: "",
      minimum_age: "",
      maximum_age: "",
      image: "",
    });
  };

  const handleCreateAgeRangeModalOpen = () => {
    handleModalOpen();
  };

  const handleNewAgeRangeChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name.includes("age") ? parseInt(value, 10) : value;

    setNewAgeRangeData((prevData) => ({
      ...prevData,
      [name]: numericValue,
    }));
  };

  const validateNewAgeRangeForm = () => {
    const errors = {
      name: "",
      minimum_age: "",
      maximum_age: "",
      image: "",
    };

    if (!newAgeRangeData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (!newAgeRangeData.minimum_age || isNaN(newAgeRangeData.minimum_age)) {
      errors.minimum_age =
        "La edad mínima es obligatoria y debe ser un número.";
    }

    if (!newAgeRangeData.maximum_age || isNaN(newAgeRangeData.maximum_age)) {
      errors.maximum_age =
        "La edad máxima es obligatoria y debe ser un número.";
    }

    if (!newAgeRangeData.image) {
      errors.image = "La carga de la imagen es obligatoria.";
    }

    setNewAgeRangeErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  useEffect(() => {
    editingRows.forEach(ageRangeId => {
      setEditingData(prevEditingData => ({
        ...prevEditingData,
        [ageRangeId]: {
          ...prevEditingData[ageRangeId],
          ...ageRanges.find(ageRange => ageRange.age_range_id === ageRangeId)
        }
      }));
    });
  }, [editingRows, ageRanges, setEditingData]);

  const handleCreateAgeRange = () => {
    const isFormValid = validateNewAgeRangeForm();

    if (isFormValid) {
      postData(newAgeRangeData, "formData");
    } else {
      openFeedbackModal("Formulario inválido");
     }
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setNewAgeRangeData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleEditChange = (e, fieldName, categoryId) => {
    const newValue = e.target.type === "file" ? e.target.files[0] : e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [categoryId]: {
        ...prevEditingData[categoryId],
        [fieldName]: newValue === "" ? null : newValue,
      },
    }));

    if (e.target.type === "file") {
      const previewURL = URL.createObjectURL(e.target.files[0]);
      if (fieldName === "image") {
        setImagePreview(previewURL);
      }
    }
  };

  const handleSaveChanges = (ageRangeId) => {
      const modifiedFields = Object.keys(editingData[ageRangeId]).filter(fieldName =>
      isFieldModified(editingData, ageRangeId, fieldName, ageRanges.find(range => range.age_range_id === ageRangeId)[fieldName])
    );
  
    if (modifiedFields.length === 0) {
      handleCancel(ageRangeId);
      return;
    }
  
    if (modifiedFields.some(fieldName => isFieldEmpty(editingData, ageRangeId, fieldName))) {
      openFeedbackModal("No puedes dejar campos modificados vacíos.");
      return;
    }
  
    const updatedData = modifiedFields.reduce((acc, fieldName) => {
      acc[fieldName] = editingData[ageRangeId][fieldName];
      return acc;
    }, {});
  
    handleSave(entity, ageRangeId, updatedData, "formData");
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
          onClick={handleCreateAgeRangeModalOpen}
        >
          Crear Rango de Edad
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateAgeRangeModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateAgeRangeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Rango de Edad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newAgeRangeData.name}
                onChange={handleNewAgeRangeChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>{newAgeRangeErrors.name}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Edad Mínima</FormLabel>
              <Input
                type="number"
                name="minimum_age"
                value={newAgeRangeData.minimum_age}
                onChange={handleNewAgeRangeChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>
                {newAgeRangeErrors.minimum_age}
              </div>
            </FormControl>

            <FormControl>
              <FormLabel>Edad Máxima</FormLabel>
              <Input
                type="number"
                name="maximum_age"
                value={newAgeRangeData.maximum_age}
                onChange={handleNewAgeRangeChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>
                {newAgeRangeErrors.maximum_age}
              </div>
            </FormControl>
            <FormControl>
              <FormLabel>Imagen</FormLabel>
              <Input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "image")}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>{newAgeRangeErrors.image}</div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateAgeRange}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateAgeRangeModalClose}>
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
              <Th>Edad Mínima</Th>
              <Th>Edad Máxima</Th>
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
            {filteredData.map((range) => (
              <Tr key={range.age_range_id}>
                <Td>{range.age_range_id}</Td>
                <Td>
                  {editingRows.includes(range.age_range_id) ? (
                    <Input
                      value={
                        editingData[range.age_range_id]?.name
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "name",
                          range.age_range_id
                        )
                      }
                    
                      style={{ color: isDarkMode ? "white" : "black", minWidth: "100px"}}
                      color="white"
                    />
                  ) : (
                    range.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(range.age_range_id) ? (
                    <Input
                      value={
                        editingData[range.age_range_id]?.minimum_age
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "minimum_age",
                          range.age_range_id
                        )
                      }
                      style={{ color: isDarkMode ? "white" : "black", minWidth: "100px"}}
                      color="white"
                    />
                  ) : (
                    range.minimum_age
                  )}
                </Td>
                <Td>
                  {editingRows.includes(range.age_range_id) ? (
                    <Input
                      value={
                        editingData[range.age_range_id]?.maximum_age
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "maximum_age",
                          range.age_range_id
                        )
                      }
                      style={{ color: isDarkMode ? "white" : "black", minWidth: "100px"}}
                      color="white"
                    />
                  ) : (
                    range.maximum_age
                  )}
                </Td>
                <Td>
                  {editingRows.includes(range.age_range_id) ? (
                    <div>
                      <label htmlFor={`image-input-${range.age_range_id}`}>
                        <Input
                          id={`image-input-${range.age_range_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(e, "image", range.age_range_id)
                          }
                        />
                        <Image
                          src={
                            imagePreview ||
                            range.image
                          }
                          alt="Image Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(
                                `image-input-${range.age_range_id}`
                              )
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={range.image}
                      alt="Avatar"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(
                          range.image
                        )
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>
                <Td  className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(range.age_range_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(range.age_range_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(range.age_range_id)
                      ? handleSaveChanges(range.age_range_id)
                        : handleEdit(range.age_range_id)
                    }
                  />

                  {!editingRows.includes(range.age_range_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(range.age_range_id)
                      }
                    />
                  )}
                  {editingRows.includes(range.age_range_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<FaTimes />}
                      onClick={() => handleCancel(range.age_range_id)}
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
        "¿Estás seguro de que deseas eliminar este rango de edad?"
      )}
      <Modal
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Imagen seleccionada"
                maxH="80vh"
                maxW="80vw"
                objectFit="contain"
              />
            )}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default AgeRangeDataFetcher;
