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
  Badge,
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
  const [categories, setCategories] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [eventTypeMap, setEventTypeMap] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();
  const { isDarkMode } = useDarkMode();
  const endpoint = process.env.REACT_APP_API_URL;
  const [currentEditingProduct, setCurrentEditingProduct] = useState(null);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [originalCategories, setOriginalCategories] = useState({});
  const [isEventsModalOpen, setEventsModalOpen] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState({});
  const [originalEvents, setOriginalEvents] = useState({});


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
      .toLowerCase()
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, eventTypesRes] = await Promise.all([
          fetch(endpoint + "/categories").then((res) => res.json()),
          fetch(endpoint + "/eventTypes").then((res) => res.json()),
        ]);

        const categoriesData = categoriesRes.data.reduce((map, category) => {
          map[category.category_id] = category.name;
          return map;
        }, {});

        const eventTypesData = eventTypesRes.data.reduce((map, eventType) => {
          map[eventType.event_type_id] = eventType.name;
          return map;
        }, {});

        setCategories(categoriesRes.data);
        setEventTypes(eventTypesRes.data);
        setCategoryMap(categoriesData);
        setEventTypeMap(eventTypesData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

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
      categories: [],
      events: [],
    });
    setNewProductCatalogErrors({
      name: "",
      status: false,
      images: null,
      featured: false,
      categories: "",
      events: "",
    });
  };

  const handleCreateProductCatalogModalOpen = () => {
    handleModalOpen();
  };


  const [currentProductCatalogId, setCurrentProductCatalogId] = useState(null);

  const handleEditCategories = (product) => {
    setCurrentProductCatalogId(product.product_catalog_id);
    setCurrentEditingProduct(product);
    setSelectedCategories((prevData) => ({
      ...prevData,
      [product.product_catalog_id]: product.categories,
    }));
    setOriginalCategories((prevData) => ({
      ...prevData,
      [product.product_catalog_id]: product.categories,
    }));
    setCategoryModalOpen(true);
  };

  const handleEditEventTypes = (product) => {
    setCurrentProductCatalogId(product.product_catalog_id);
    setCurrentEditingProduct(product);
    setSelectedEvents((prevData) => ({
      ...prevData,
      [product.product_catalog_id]: product.event_types,
    }));
    setOriginalEvents((prevData) => ({
      ...prevData,
      [product.product_catalog_id]: product.event_types,
    }));
    setEventsModalOpen(true);
  };


  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewProductCatalogData((prevData) => ({
      ...prevData,
      categories: selectedCategories,
    }));
  };


  const determineCategoryChanges = (productCatalogId, selectedCategories) => {
    const original = originalCategories[productCatalogId] || [];
    const selected = selectedCategories || [];

    const categoriesToAdd = selected.filter(
      (category) => !original.includes(category)
    );
    const categoriesToRemove = original.filter(
      (category) => !selected.includes(category)
    );

    return { categoriesToAdd, categoriesToRemove };
  };

  const determineEventsChanges = (productCatalogId, selectedEvents) => {
    const original = originalEvents[productCatalogId] || [];
    const selected = selectedEvents || [];

    const eventsToAdd = selected.filter(
      (event_types) => !original.includes(event_types)
    );
    const eventsToRemove = original.filter(
      (event_types) => !selected.includes(event_types)
    );

    return { eventsToAdd, eventsToRemove };
  };

  const saveCategoryChanges = async (
    productCatalogId,
    categoriesToAdd,
    categoriesToRemove
  ) => {
    try {
      if (categoriesToAdd.length > 0) {
        await fetch(endpoint + "/productsCatalogAssociations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_catalog_id: productCatalogId,
            categories_ids: categoriesToAdd,
          }),
        });
      }

      if (categoriesToRemove.length > 0) {
        await fetch(endpoint + "/productsCatalogAssociations/"+categoriesToRemove[0], {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_catalog_id: productCatalogId,
            categories_ids: categoriesToRemove,
          }),
        });
      }

      setCategories((prevCategories) => {
        const updatedCategories = prevCategories.filter(
          (category) => !categoriesToRemove.includes(category.category_id)
        );
        return [
          ...updatedCategories,
          ...categoriesToAdd.map((id) => ({ category_id: id })),
        ];
      });

      reloadData();
      handleCancel(productCatalogId)
    } catch (error) {
      console.error("Error saving category changes", error);
    }
  };

  const saveEventsChanges = async (
    productCatalogId,
    eventsToAdd,
    eventsToRemove
  ) => {
    try {
      if (eventsToAdd.length > 0) {
        await fetch(endpoint + "/productsCatalogAssociations", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_catalog_id: productCatalogId,
            event_types_ids: eventsToAdd,
          }),
        });
        reloadData();
        handleCancel(productCatalogId)
      }

      if (eventsToRemove.length > 0) {
        await fetch(endpoint + "/productsCatalogAssociations/"+eventsToRemove[0], {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_catalog_id: productCatalogId,
            event_types_ids: eventsToRemove,
          }),
        });
      }

        setEventTypes((prevEvents) => {
          const updateEvents = prevEvents.filter(
            (eventTypes) => !eventsToRemove.includes(eventTypes.event_type_id)
          );
          return [
            ...updateEvents,
            ...eventsToAdd.map((id) => ({ event_type_id: id })),
          ];
        });

        reloadData();
        handleCancel(productCatalogId)
      
    } catch (error) {
      console.error("Error saving category changes", error);
    }
  };

  const handleSaveCategories = async (
    productCatalogId,
    selectedCategoryIds
  ) => {
    const { categoriesToAdd, categoriesToRemove } = determineCategoryChanges(
      productCatalogId,
      selectedCategoryIds
    );

    await saveCategoryChanges(
      productCatalogId,
      categoriesToAdd,
      categoriesToRemove
    );

    setSelectedCategories((prevSelected) => ({
      ...prevSelected,
      [productCatalogId]: selectedCategoryIds,
    }));
  };

  const handleSaveEvents = async (productCatalogId, selectedEventsIds) => {
    const { eventsToAdd, eventsToRemove } = determineEventsChanges(
      productCatalogId,
      selectedEventsIds
    );

    await saveEventsChanges(productCatalogId, eventsToAdd, eventsToRemove);

    setSelectedEvents((prevSelected) => ({
      ...prevSelected,
      [productCatalogId]: selectedEventsIds,
    }));
  };


  const handleEventChange = (e) => {
    const selectedEvents = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setNewProductCatalogData((prevData) => ({
      ...prevData,
      events: selectedEvents,
    }));
  };

  const validateNewProductCatalogForm = () => {
    const errors = {
      name: "",
      status: "",
      images: "",
      featured: "",
      categories: "",
      events: "",
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
      errors.featured = "Marcar si el producto es destacado o no.";
    }

    if (newProductCatalogData.categories.length === 0) {
      errors.categories = "Selecciona al menos una categoría.";
    }

    if (newProductCatalogData.events.length === 0) {
      errors.events = "Selecciona al menos un evento.";
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
    editingRows.forEach((productId) => {
      setEditingData((prevEditingData) => ({
        ...prevEditingData,
        [productId]: {
          ...prevEditingData[productId],
          ...productsCatalog.find(
            (product) => product.product_catalog_id === productId
          ),
        },
      }));
    });
  }, [editingRows, productsCatalog, setEditingData]);

  const handleStatusSave = (productId) => {
    const modifiedFields = Object.keys(editingData[productId]).filter(
      (fieldName) =>
        fieldName !== "status" &&
        isFieldModified(
          editingData,
          productId,
          fieldName,
          productsCatalog.find(
            (product) => product.product_catalog_id === productId
          )[fieldName]
        )
    );

    const editedStatus = editingData[productId]?.status;
    const isStatusComplete =
      editedStatus !== undefined && editedStatus !== null;

    if (
      isStatusComplete &&
      isFieldModified(
        editingData,
        productId,
        "status",
        parseInt(editedStatus, 10)
      )
    ) {
      modifiedFields.push("status");
    }

    if (modifiedFields.length === 0) {
      handleCancel(productId);
      return;
    }

    if (
      modifiedFields.some((fieldName) =>
        isFieldEmpty(editingData, productId, fieldName)
      )
    ) {
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

  const CategoryModal = ({
    isOpen,
    onClose,
    categories,
    selectedCategories,
    currentProductCatalogId,
    onSave,
  }) => {
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    useEffect(() => {
      setSelectedCategoryIds(selectedCategories[currentProductCatalogId] || []);
    }, [selectedCategories, currentProductCatalogId]);

    const toggleCategory = (categoryId) => {
      setSelectedCategoryIds((prevSelected) => {
        if (prevSelected.includes(categoryId)) {
          return prevSelected.filter((id) => id !== categoryId);
        } else {
          return [...prevSelected, categoryId];
        }
      });
    };

    useEffect(() => {
      console.log("Updated selectedCategoryIds:", selectedCategoryIds);
    }, [selectedCategoryIds]);

    const handleSaveCat = () => {
      setSelectedCategories((prevSelected) => ({
        ...prevSelected,
        [currentProductCatalogId]: selectedCategoryIds,
      }));

      onSave(currentProductCatalogId, selectedCategoryIds);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecciona Categorías</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {categories.map((category) => (
              <Badge
                key={category.category_id}
                colorScheme={
                  selectedCategoryIds.includes(category.category_id)
                    ? "red"
                    : "blue"
                }
                m={1}
                p={2}
                cursor="pointer"
                onClick={() => toggleCategory(category.category_id)}
              >
                {category.name}
              </Badge>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveCat}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const EventsModal = ({
    isOpen,
    onClose,
    events,
    selectedEvents,
    currentProductCatalogId,
    onSave,
  }) => {
    const [selectedEventsIds, setSelectedEventsIds] = useState([]);

    useEffect(() => {
      setSelectedEventsIds(selectedEvents[currentProductCatalogId] || []);
    }, [selectedEvents, currentProductCatalogId]);

    const toggleEvent = (eventId) => {
      setSelectedEventsIds((prevSelected) => {
        if (prevSelected.includes(eventId)) {
          return prevSelected.filter((id) => id !== eventId);
        } else {
          return [...prevSelected, eventId];
        }
      });
    };

    const handleSaveEv = () => {
      onSave(currentProductCatalogId, selectedEventsIds);
      onClose();
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecciona Eventos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {events.map((event) => (
              <Badge
                key={event.event_type_id}
                colorScheme={
                  selectedEventsIds.includes(event.event_type_id)
                    ? "red"
                    : "blue"
                }
                m={1}
                p={2}
                cursor="pointer"
                onClick={() => toggleEvent(event.event_type_id)}
              >
                {event.name}
              </Badge>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEv}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const sortedData = [...filteredData].sort((a, b) => a.product_catalog_id - b.product_catalog_id);

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
      <Modal isOpen={showModal} onClose={handleModalClose}>
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
              >
                <option value="0">No</option>
                <option value="1">Sí</option>
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

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                name="categories"
                multiple
                value={newProductCatalogData.categories}
                onChange={handleCategoryChange}
              >
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Eventos</FormLabel>
              <Select
                name="events"
                multiple
                value={newProductCatalogData.events}
                onChange={handleEventChange}
              >
                {eventTypes.map((eventType) => (
                  <option
                    key={eventType.event_type_id}
                    value={eventType.event_type_id}
                  >
                    {eventType.name}
                  </option>
                ))}
              </Select>
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
              <Th>Categorias</Th>
              <Th>Eventos</Th>
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
            {sortedData.map((product) => (
              <Tr key={product.product_catalog_id}>
                <Td>{product.product_catalog_id}</Td>
                <Td>
                  {editingRows.includes(product.product_catalog_id) ? (
                    <Input
                      value={editingData[product.product_catalog_id]?.name}
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
                  {product.categories.map((categoryId) => (
                    <span key={categoryId}>
                      {categoryMap[categoryId]}
                      {"  "}
                    </span>
                  ))}
                  {editingRows.includes(product.product_catalog_id) && (
                    <Button onClick={() => handleEditCategories(product)}>
                      Edit
                    </Button>
                  )}
                </Td>
                <Td>
                  {product.event_types.map((eventTypeId) => (
                    <span key={eventTypeId}>
                      {eventTypeMap[eventTypeId]}
                      {"  "}
                    </span>
                  ))}
                  {editingRows.includes(product.product_catalog_id) && (
                    <Button onClick={() => handleEditEventTypes(product)}>
                      Edit
                    </Button>
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
                          src={imagesPreview || `${product.images}`}
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
                      src={`${product.images}`}
                      alt="Images"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() => handleImageClick(`${product.images}`)}
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
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        currentProductCatalogId={currentProductCatalogId}
        onSave={handleSaveCategories}
      />
      <EventsModal
        isOpen={isEventsModalOpen}
        onClose={() => setEventsModalOpen(false)}
        events={eventTypes}
        selectedEvents={selectedEvents}
        currentProductCatalogId={currentProductCatalogId}
        onSave={handleSaveEvents}
      />
    </Box>
  );
}

export default ProductsCatalogDataFetcher;
