import React, { useContext, useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useDarkMode from "../../../../assets/darkModeHook";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
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

function CategoriesDataFetcher() {
  const entity = "categories";
  const apiEndpoint = "http://localhost:8080/api/v1/categories";
  const token = localStorage.getItem("token");
  const { isDarkMode } = useDarkMode();

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: categories,
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

  const customFilter = (categories, searchTerm) => {
    return categories.name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    categories,
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

  const [newCategoriesData, setNewCategoriesData] = useState({
    name: "",
    image: 0,
  });

  const [newCategoriesErrors, setNewCategoriesErrors] = useState({
    name: "",
    image: "",
  });

  const handleNewCategoriesChange = (e) => {
    const { name, value } = e.target;
    setNewCategoriesErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewCategoriesData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setNewCategoriesData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleCreateCategoriesModalClose = () => {
    handleModalClose();
    setNewCategoriesData({
      name: "",
      image: "",
    });
    setNewCategoriesErrors({
      name: "",
      image: "",
    });
  };

  const handleCreateCategoriesModalOpen = () => {
    handleModalOpen();
  };

  const validateNewCategoriesForm = () => {
    const errors = {
      name: "",
      image: "",
    };

    if (!newCategoriesData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (!newCategoriesData.image) {
      errors.name = "La carga de la imagen es obligatoria.";
    }

    setNewCategoriesErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateCategories = async () => {
    const isFormValid = validateNewCategoriesForm();

    if (isFormValid) {
      postData(newCategoriesData, "formData");
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const [imagePreview, setImagePreview] = useState("");

  const handleEditChange = (e, fieldName, categoryId) => {
    const newValue =
      e.target.type === "file" ? e.target.files[0] : e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [categoryId]: {
        ...prevEditingData[categoryId],
        [fieldName]: newValue,
      },
    }));

    if (e.target.type === "file") {
      const previewURL = URL.createObjectURL(e.target.files[0]);
      if (fieldName === "image") {
        setImagePreview(previewURL);
      }
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
          onClick={handleCreateCategoriesModalOpen}
        >
          Crear Categoría
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateCategoriesModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateCategoriesModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Categoría</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newCategoriesData.name}
                onChange={handleNewCategoriesChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>{newCategoriesErrors.name}</div>
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
              <div style={{ color: "red" }}>{newCategoriesErrors.image}</div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateCategories}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateCategoriesModalClose}>
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
            {filteredData.map((category) => (
              <Tr key={category.category_id}>
                <Td>{category.category_id}</Td>
                <Td>
                  {editingRows.includes(category.category_id) ? (
                    <Input
                      value={
                        editingData[category.category_id]?.name || category.name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "name", category.category_id)
                      }
                      minWidth="100px"
                      color="white"
                      style={{ color: isDarkMode ? "white" : "black"}}
                    />
                  ) : (
                    category.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(category.category_id) ? (
                    <div>
                      <label htmlFor={`image-input-${category.category_id}`}>
                        <Input
                          id={`image-input-${category.category_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(e, "image", category.category_id)
                          }
                        />
                        <Image
                          src={
                            imagePreview ||
                            `http://localhost:8080${category.image}`
                          }
                          alt="Image Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(
                                `image-input-${category.category_id}`
                              )
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={`http://localhost:8080${category.image}`}
                      alt="Avatar"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(
                          `http://localhost:8080${category.image}`
                        )
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>
                <Td  className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(category.category_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(category.category_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(category.category_id)
                        ? handleSave(
                            entity,
                            category.category_id,
                            editingData[category.category_id],
                            "formData"
                          )
                        : handleEdit(category.category_id)
                    }
                  />
                  {!editingRows.includes(category.category_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(category.category_id)
                      }
                    />
                  )}
                  {editingRows.includes(category.category_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(category.category_id)}
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
        "¿Estás seguro de que deseas eliminar esta categoría?"
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

export default CategoriesDataFetcher;
