import React, { useEffect, useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDarkMode from "assets/darkModeHook";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Image,
  Td,
  Flex,
  Select,
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

function mapStatusValue(value) {
  return value === 1 ? "Activo" : "Inactivo";
}

function mapFeaturedValue(value) {
  return value === 1 ? "Si" : "No";
}

function ProductsCatalogDataFetcher() {
  const entity = "products-catalog";
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/products-catalog`;
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();
  const { isDarkMode } = useDarkMode();

  const {
    data: productsCatalog,
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

  const customFilter = (productsCatalog, searchTerm) => {
    const idMatch = productsCatalog.product_catalog_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = productsCatalog.name
      .toString()
      .includes(searchTerm.toLowerCase());
    const statusMatch = productsCatalog.status
      .toString()
      .includes(searchTerm.toLowerCase());

    return idMatch || nameMatch || statusMatch;
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    productsCatalog,
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

  const [newProductCatalogData, setNewProductCatalogData] = useState({
    name: "",
    status: false,
    images: null,
    featured: false,
  });

  const [newProductCatalogErrors, setNewProductCatalogErrors] = useState({
    name: "",
    status: false,
    images: null,
    featured: false,
  });

  const handleNewProductCatalogChange = (e) => {
    const { value, name } = e.target;
    setNewProductCatalogErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewProductCatalogData((prevData) => ({
      ...prevData,
      name: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setNewProductCatalogData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleCreateProductCatalogModalClose = () => {
    handleModalClose();
    setNewProductCatalogData({
      name: "",
      status: false,
      images: null,
      featured: false,
    });
    setNewProductCatalogErrors({
      name: "",
      status: false,
      images: null,
      featured: false,
    });
  };

  const handleCreateProductCatalogModalOpen = () => {
    handleModalOpen();
  };

  const validateNewProductCatalogForm = () => {
    const errors = {
      name: "",
      status: "",
      images: "",
      featured: "",
    };

    if (!newProductCatalogData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (
      newProductCatalogData.status !== true &&
      newProductCatalogData.status !== false
    ) {
      errors.status = "Marcar si es un evento calendarizado o no.";
    }

    if (
      !newProductCatalogData.images ||
      !(newProductCatalogData.images instanceof File) ||
      !newProductCatalogData.images.name
    ) {
      errors.images = "La carga de la imagen es obligatoria.";
    }

    if (
      newProductCatalogData.featured !== true &&
      newProductCatalogData.featured !== false
    ) {
      errors.status = "Marcar si es un evento calendarizado o no.";
    }

    setNewProductCatalogErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateProductCatalog = async () => {
    const isFormValid = validateNewProductCatalogForm();

    if (
      newProductCatalogData.images &&
      newProductCatalogData.images.length > 5
    ) {
      openFeedbackModal("Solo se permiten hasta 5 imágenes");
      return;
    }

    if (isFormValid) {
      postData(newProductCatalogData, "formData");
    } else {
      openFeedbackModal("Formulario inválido");
     }
  };

  const [imagesPreview, setImagesPreview] = useState("");

  const handleEditChange = (e, fieldName, productId) => {
    if (!productId) {
      console.error("eventTypeId is not defined");
      return;
    }

    const newValue =
      e?.target?.type === "file" ? e.target.files[0] : e?.target?.value;

    if (newValue !== undefined) {
      setEditingData((prevEditingData) => ({
        ...prevEditingData,
        [productId]: {
          ...(prevEditingData[productId] || {}),
          [fieldName]: newValue,
        },
      }));

      if (e?.target?.type === "file") {
        const previewURL = URL.createObjectURL(e.target.files[0]);
        if (fieldName === "images") {
          setImagesPreview(previewURL);
        }
      }
    }
  };

  useEffect(() => {
    editingRows.forEach(productId => {
      setEditingData(prevEditingData => ({
        ...prevEditingData,
        [productId]: {
          ...prevEditingData[productId],
          ...productsCatalog.find(product => product.product_catalog_id === productId)
        }
      }));
    });
  }, [editingRows, productsCatalog, setEditingData]);
  

  const handleStatusSave = (productId) => {
    const modifiedFields = Object.keys(editingData[productId]).filter(fieldName =>
        fieldName !== "status" && isFieldModified(editingData, productId, fieldName, productsCatalog.find(product => product.product_catalog_id === productId)[fieldName])
    );

    const editedStatus = editingData[productId]?.status;
    const isStatusComplete = editedStatus !== undefined && editedStatus !== null;

    if (isStatusComplete && isFieldModified(editingData, productId, "status", parseInt(editedStatus, 10))) {
        modifiedFields.push("status");
    }

    if (modifiedFields.length === 0) {
        handleCancel(productId);
        return;
    }

    if (modifiedFields.some(fieldName => isFieldEmpty(editingData, productId, fieldName))) {
        openFeedbackModal("No puedes dejar campos modificados vacíos.");
    } else {
        const updatedData = modifiedFields.reduce((acc, fieldName) => {
            acc[fieldName] = editingData[productId][fieldName];
            return acc;
        }, {});

        handleSave(entity, productId, updatedData, "formData");
    }
};

  const handleStatusChange = (e) => {
    const { value } = e.target;
    setNewProductCatalogData((prevData) => ({
      ...prevData,
      status: value === "1" ? true : false,
    }));
  };

  const handleFeaturedChange = (e) => {
    const { value } = e.target;
    setNewProductCatalogData((prevData) => ({
      ...prevData,
      featured: value === "1" ? true : false,
    }));
  };

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
          onClick={handleCreateProductCatalogModalOpen}
        >
          Crear Producto
        </Button>
      </Flex>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateProductCatalogModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Modal isOpen={showModal} onClose={handleCreateProductCatalogModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar nuevo producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newProductCatalogData.name}
                onChange={handleNewProductCatalogChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>{newProductCatalogErrors.name}</div>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={newProductCatalogData.status ? "1" : "0"}
                onChange={handleStatusChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                <option value="0">Inactivo</option>
                <option value="1">Activo</option>
              </Select>
              <div style={{ color: "red" }}>
                {newProductCatalogErrors.status}
              </div>
            </FormControl>
            <FormControl>
              <FormLabel>Destacado</FormLabel>
              <Select
                name="featured"
                value={newProductCatalogData.featured ? "1" : "0"}
                onChange={handleFeaturedChange}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              >
                <option value="0">No</option>
                <option value="1">Si</option>
              </Select>
              <div style={{ color: "red" }}>
                {newProductCatalogErrors.featured}
              </div>
            </FormControl>
            <FormControl>
              <FormLabel>Imagen</FormLabel>
              <Input
                type="file"
                name="images"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "images")}
                color="white"
                style={{ color: isDarkMode ? "white" : "black" }}
              />
              <div style={{ color: "red" }}>
                {newProductCatalogErrors.image}
              </div>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleCreateProductCatalog}
            >
              Crear
            </Button>
            <Button
              variant="ghost"
              onClick={handleCreateProductCatalogModalClose}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box maxHeight="500px" overflowY="auto">
        <Table variant="simple" mt={8} className="table-container">
          <Thead className="sticky-header">
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Estado</Th>
              <Th>Destacado</Th>
              <Th>Imágenes</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <TokenInvalidError
            isOpen={showTokenInvalidError}
            onClose={handleCloseTokenInvalidError}
          />
          <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
          <Tbody className="scrollable-content">
            {filteredData.map((product) => (
              <Tr key={product.product_catalog_id}>
                <Td>{product.product_catalog_id}</Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <Input
                      value={
                        editingData[product.product_catalog_id]?.name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "name", product.product_catalog_id)
                      }
                      minWidth="100px"
                      color="white"
                      style={{ color: isDarkMode ? "white" : "black" }}
                    />
                  ) : (
                    product.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <Select
                      value={
                        editingData[product.product_catalog_id]?.status ||
                        product.status
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "status",
                          product.product_catalog_id
                        )
                      }
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </Select>
                  ) : (
                    mapStatusValue(product.status)
                  )}
                </Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <Select
                      value={
                        editingData[product.product_catalog_id]?.featured ||
                        product.featured
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e,
                          "featured",
                          product.product_catalog_id
                        )
                      }
                    >
                      <option value="1">Si</option>
                      <option value="0">No</option>
                    </Select>
                  ) : (
                    mapFeaturedValue(product.featured)
                  )}
                </Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <div>
                      <label
                        htmlFor={`images-input-${product.product_catalog_id}`}
                      >
                        <Input
                          id={`images-input-${product.product_catalog_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(
                              e,
                              "images",
                              product.product_catalog_id
                            )
                          }
                        />
                        <Image
                          src={
                            imagesPreview ||
                            `${process.env.REACT_APP_URL_IMAGES}${product.images}`
                          }
                          alt="Images Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(
                                `images-input-${product.product_catalog_id}`
                              )
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={`${process.env.REACT_APP_URL_IMAGES}${product.images}`}
                      alt="Images"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(
                          `${process.env.REACT_APP_URL_IMAGES}${product.images}`
                        )
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(product.product_catalog_id)
                        ? "Guardar"
                        : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(product.product_catalog_id)
                            ? FaCheck
                            : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(product.product_catalog_id)
                        ? handleStatusSave(product.product_catalog_id)
                        : handleEdit(product.product_catalog_id)
                    }
                  />
                  {!editingRows.includes(product.product_catalog_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() =>
                        handleDeleteConfirmation(product.product_catalog_id)
                      }
                    />
                  )}
                  {editingRows.includes(product.product_catalog_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(product.product_catalog_id)}
                    >
                      {" "}
                    </Button>
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este producto?"
      )}
    </Box>
  );
}

export default ProductsCatalogDataFetcher;
