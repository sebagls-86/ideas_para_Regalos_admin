import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
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

function ProductsCatalogDataFetcher() {
  const entity = "productsCatalog";
  const apiEndpoint = "http://localhost:8080/api/v1/productsCatalog";
  const token = useContext(TokenContext).token;

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: productsCatalog,
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
    scheduled: false,
    image: null,
    date: null,
  });

  const [newProductCatalogErrors, setNewProductCatalogErrors] = useState({
    name: "",
    scheduled: false,
    image: null,
    date: "",
  });

  const handleNewProductCatalogChange = (value, name) => {
    setNewProductCatalogErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    const newValue =
      name === "scheduled" ? value === "1" : name === "date" ? value : value;

    setNewProductCatalogData((prevData) => ({
      ...prevData,
      [name]: newValue,
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
      scheduled: false,
      image: null,
      date: null,
    });
    setNewProductCatalogErrors({
      name: "",
      scheduled: false,
      image: null,
      date: null,
    });
  };

  const handleCreateProductCatalogModalOpen = () => {
    handleModalOpen();
  };

  const validateNewProductCatalogForm = () => {
    const errors = {
      name: "",
      scheduled: "",
      image: "",
    };

    if (!newProductCatalogData.name) {
      errors.name = "El nombre es obligatorio.";
    }

    if (
      newProductCatalogData.scheduled !== true &&
      newProductCatalogData.scheduled !== false
    ) {
      errors.scheduled = "Marcar si es un evento calendarizado o no.";
    }

    if (
      !newProductCatalogData.image ||
      !(newProductCatalogData.image instanceof File) ||
      !newProductCatalogData.image.name
    ) {
      errors.image = "La carga de la imagen es obligatoria.";
    }

    setNewProductCatalogErrors(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateProductCatalog = async () => {
    const isFormValid = validateNewProductCatalogForm();

    if (isFormValid) {
      postData(newProductCatalogData);
    } else {
      openFeedbackModal("Formulario inválido");
      console.log("Formulario inválido");
    }
  };

  const handleEditChange = (e, fieldName, productCatalogId) => {
    const newValue =
      e.target.type === "file" ? e.target.files[0] : e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [productCatalogId]: {
        ...prevEditingData[productCatalogId],
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
          <ModalHeader>Crear Tipo de Evento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newProductCatalogData.name}
                onChange={(e) =>
                  handleNewProductCatalogChange(e.target.value, "name")
                }
                color="white"
              />
              <div style={{ color: "red" }}>{newProductCatalogErrors.name}</div>
            </FormControl>
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={newProductCatalogData.scheduled ? "1" : "0"}
                onChange={(e) =>
                  handleNewProductCatalogChange(e.target.value, "status")
                }
                color="white"
              >
                <option value="0">Inactivo</option>
                <option value="1">Activo</option>
              </Select>
              <div style={{ color: "red" }}>
                {newProductCatalogErrors.scheduled}
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
                        editingData[product.product_catalog_id]?.name ||
                        product.name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "name", product.product_catalog_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    product.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <select
                      value={
                        editingData[product.product_catalog_id] ||
                        product.status.toString()
                      }
                      onChange={(e) => {
                        handleEditChange(
                          e,
                          "status",
                          product.product_catalog_id
                        );
                        setEditingData({
                          ...editingData,
                          [product.product_catalog_id]:
                            product.product_catalog_id,
                        });
                      }}
                      style={{ color: "black" }}
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  ) : product.status === 1 ? (
                    "Activo"
                  ) : (
                    "Inactivo"
                  )}
                </Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditChange(e, "image", product.product_catalog_id)
                      }
                      minWidth="100px"
                      color="white"
                    />
                  ) : (
                    product.images
                  )}
                </Td>
                <Td>
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
                        ? handleSave(
                            entity,
                            product.product_catalog_id,
                            editingData[product.product_catalog_id]
                          )
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este producto?"
      )}
    </Box>
  );
}

export default ProductsCatalogDataFetcher;
