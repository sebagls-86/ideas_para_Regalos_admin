import React, { useContext, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useDataPoster from "../../../../components/dataManage/useDataPoster";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDarkMode from "../../../../assets/darkModeHook";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

function UsersDataFetcher() {
  const entity = "users";
  const apiEndpoint = "http://localhost:8080/api/v1/users";
  const { token } = useContext(TokenContext);
  const { isDarkMode } = useDarkMode();

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const {
    data: users,
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

  const customFilter = (users, searchTerm) => {
    const idMatch = users.user_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const userNameMatch = users.user_name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = users.name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const lastNameMatch = users.last_name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const emailMatch = users.email
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const birthDateMatch = users.birth_date
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      idMatch ||
      userNameMatch ||
      nameMatch ||
      lastNameMatch ||
      emailMatch ||
      birthDateMatch
    );
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    users,
    customFilter
  );

  const {
    showModal,
    FeedbackModal: FBModal,
    feedbackMessage,
    handleModalOpen,
    handleModalClose,
  } = useDataPoster(apiEndpoint, token, reloadData, setShowErrorModal);

  const [newUserData, setNewUserData] = useState({
    user_name: "",
    name: "",
    last_name: "",
    birth_date: "",
    email: "",
    password: "",
    avatar: "",
    banner: "",
    isAdmin: false,
    adminRole: "SuperAdmin",
  });

  const handleCreateUserModalOpen = () => {
    handleModalOpen();
  };

  const handleCreateUserModalClose = () => {
    handleModalClose();
    setNewUserData({
      user_name: "",
      name: "",
      last_name: "",
      birth_date: "",
      email: "",
      password: "",
      avatar: "",
      banner: "",
      isAdmin: false,
      adminRole: "SuperAdmin",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    setNewUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setNewUserData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const handleDateChange = (date, fieldName) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [fieldName]: date,
    }));
  };

  const formatToDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [errorMessages, setErrorMessages] = useState({
    user_name: "",
    name: "",
    last_name: "",
    birth_date: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {
      user_name: "",
      name: "",
      last_name: "",
      birth_date: "",
      email: "",
      password: "",
    };

    const firstNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ'´-]{1,29}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;
    const lastNameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ][a-zA-ZÀ-ÖØ-öø-ÿ'´-]{1,29}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const dateRegex =
      /^([0-9]{4})\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])$/;
    const passwordRegex = [/.{8,}/, /[a-z]/, /[A-Z]/, /\d/, /[^\\s<>"´']+/];

    if (!newUserData.user_name || !usernameRegex.test(newUserData.user_name)) {
      errors.user_name =
        "El nombre de usuario no cumple con el formato válido.";
    }

    if (!newUserData.name || !firstNameRegex.test(newUserData.name)) {
      errors.name = "El nombre no cumple con el formato válido.";
    }

    if (!newUserData.last_name || !lastNameRegex.test(newUserData.last_name)) {
      errors.last_name = "El apellido no cumple con el formato válido.";
    }

    if (!newUserData.email || !emailRegex.test(newUserData.email)) {
      errors.email = "El correo electrónico no cumple con el formato válido.";
    }

    if (
      !newUserData.password ||
      !passwordRegex.every((pattern) => newUserData.password.match(pattern))
    ) {
      errors.password = "La contraseña no cumple con el formato válido.";
    }

    setErrorMessages(errors);

    return Object.values(errors).every((error) => error === "");
  };

  const handleCreateUser = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      if (newUserData.birth_date instanceof Date) {
        const formattedDate = formatToDDMMYYYY(newUserData.birth_date);

        const formData = new FormData();
        formData.append("user_name", newUserData.user_name);
        formData.append("name", newUserData.name);
        formData.append("last_name", newUserData.last_name);
        formData.append("birth_date", formattedDate);
        formData.append("email", newUserData.email);
        formData.append("password", newUserData.password);
        formData.append("avatar", newUserData.avatar);
        formData.append("banner", newUserData.banner);

        if (newUserData.isAdmin) {
          formData.append("admin_role", Number(newUserData.adminRole));
        }

        const apiUrl = newUserData.isAdmin
          ? `http://localhost:8080/api/v1/users/${newUserData.adminRole}`
          : "http://localhost:8080/api/v1/users";

        console.log("Form Data:", formData);

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            handleCreateUserModalClose();
            openFeedbackModal("Usuario creado con éxito");
            reloadData();
          } else {
            if (response.status === 403) {
              setShowErrorModal(true);
            } else if (response.status === 400) {
              openFeedbackModal("Ocurrió un problema. Loguéate nuevamente.");
            } else if (response.status === 500) {
              openFeedbackModal(
                `Error al crear usuario: ${response.statusText}`
              );
            } else {
              openFeedbackModal(
                `Error al crear usuario: ${response.statusText}`
              );
              console.error("Error al crear usuario:", response.statusText);
            }
          }
        } catch (error) {
          openFeedbackModal("Error en la solicitud");
        }
      }
    } else {
      console.log("Formulario inválido");
    }
  };

  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");

  const handleEditChange = (e, fieldName, user_id) => {
    const newValue =
      e.target.type === "file" ? e.target.files[0] : e.target.value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [user_id]: {
        ...prevEditingData[user_id],
        [fieldName]: newValue,
      },
    }));

    // Actualizar la vista previa por fuera del estado principal
    if (e.target.type === "file") {
      const previewURL = URL.createObjectURL(e.target.files[0]);
      if (fieldName === "avatar") {
        setAvatarPreview(previewURL);
      } else if (fieldName === "banner") {
        setBannerPreview(previewURL);
      }
    }

    console.log("Editing Data:", editingData);
  };

  const convertToCorrectDateFormat = (backendDate) => {
    const [day, month, year] = backendDate.split("/");
    return `${month}-${day}-${year}`;
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
    <Box marginTop="5rem" height="100%">
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
          onClick={handleCreateUserModalOpen}
        >
          Crear Usuario
        </Button>
      </Flex>
      <Modal isOpen={showModal} onClose={handleCreateUserModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Usuario</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre de Usuario</FormLabel>
              <Input
                type="text"
                name="user_name"
                value={newUserData.user_name}
                onChange={handleInputChange}
                color="white"
                className="Td-input"
              />
              <div style={{ color: "red" }}>{errorMessages.user_name}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                type="text"
                name="name"
                value={newUserData.name}
                onChange={handleInputChange}
                color="white"
                className="Td-input"
              />
              <div style={{ color: "red" }}>{errorMessages.name}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Apellido</FormLabel>
              <Input
                type="text"
                name="last_name"
                value={newUserData.last_name}
                onChange={handleInputChange}
                color="white"
                className="Td-input"
              />
              <div style={{ color: "red" }}>{errorMessages.last_name}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <DatePicker
                selected={newUserData.birth_date}
                onChange={(date) => handleDateChange(date, "birth_date")}
                dateFormat="dd-MM-yyy"
                placeholderText="Seleccionar fecha"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={15}
                className="date-picker"
              />
              <div style={{ color: "red" }}>{errorMessages.birth_date}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
                color="white"
                className="Td-input"
              />
              <div style={{ color: "red" }}>{errorMessages.email}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={newUserData.password}
                onChange={handleInputChange}
                color="white"
                className="Td-input"
              />
              <div style={{ color: "red" }}>{errorMessages.password}</div>
            </FormControl>

            <FormControl>
              <FormLabel>Avatar</FormLabel>
              <Input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
                color="white"
                className="Td-input"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Banner</FormLabel>
              <Input
                type="file"
                name="banner"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "banner")}
                color="white"
                className="Td-input"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateUser}>
              Crear
            </Button>
            <Button variant="ghost" onClick={handleCreateUserModalClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {FBModal && (
        <FBModal
          isOpen={showModal}
          onClose={handleCreateUserModalClose}
          feedbackMessage={feedbackMessage}
        />
      )}
      <Box maxHeight="500px" overflowY="auto">
        <Table variant="simple" className="table-container">
          <Thead className="sticky-header">
            <Tr>
              <Th>ID de Usuario</Th>
              <Th>Nombre de Usuario</Th>
              <Th>Nombre</Th>
              <Th>Apellido</Th>
              <Th>Email</Th>
              <Th>Fecha de Nacimiento</Th>
              <Th>Avatar</Th>
              <Th>Banner</Th>
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
            {filteredData.map((user) => (
              <Tr key={user.user_id}>
                <Td>{user.user_id}</Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <Input
                      value={
                        editingData[user.user_id]?.user_name || user.user_name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "user_name", user.user_id)
                      }
                      color={isDarkMode ? "white" : "black"}
                    />
                  ) : (
                    user.user_name
                  )}
                </Td>
                <Td className="Td-input">
                  {editingRows.includes(user.user_id) ? (
                    <Input
                      value={editingData[user.user_id]?.name || user.name}
                      onChange={(e) =>
                        handleEditChange(e, "name", user.user_id)
                      }
                      color={isDarkMode ? "white" : "black"}
                    />
                  ) : (
                    user.name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <Input
                      value={
                        editingData[user.user_id]?.last_name || user.last_name
                      }
                      onChange={(e) =>
                        handleEditChange(e, "last_name", user.user_id)
                      }
                      color={isDarkMode ? "white" : "black"}
                    />
                  ) : (
                    user.last_name
                  )}
                </Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <Input
                      value={editingData[user.user_id]?.email || user.email}
                      onChange={(e) =>
                        handleEditChange(e, "email", user.user_id)
                      }
                      color={isDarkMode ? "white" : "black"}
                    />
                  ) : (
                    user.email
                  )}
                </Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <DatePicker
                      selected={
                        editingData[user.user_id]?.birth_date ||
                        new Date(convertToCorrectDateFormat(user.birth_date))
                      }
                      onChange={(date) =>
                        handleEditChange(date, "birth_date", user.user_id)
                      }
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      className="date-picker"
                    />
                  ) : (
                    user.birth_date
                  )}
                </Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <div>
                      <label htmlFor={`avatar-input-${user.user_id}`}>
                        <Input
                          id={`avatar-input-${user.user_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(e, "avatar", user.user_id)
                          }
                        />
                        <Image
                          src={
                            avatarPreview ||
                            `http://localhost:8080${user.avatar}`
                          }
                          alt="Avatar Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(`avatar-input-${user.user_id}`)
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={`http://localhost:8080${user.avatar}`}
                      alt="Avatar"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(`http://localhost:8080${user.avatar}`)
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <div>
                      <label htmlFor={`banner-input-${user.user_id}`}>
                        <Input
                          id={`banner-input-${user.user_id}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) =>
                            handleEditChange(e, "banner", user.user_id)
                          }
                        />
                        <Image
                          src={
                            bannerPreview ||
                            `http://localhost:8080${user.banner}`
                          }
                          alt="Banner Preview"
                          maxH="50px"
                          maxW="50px"
                          objectFit="cover"
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(`banner-input-${user.user_id}`)
                              .click();
                          }}
                          cursor="pointer"
                        />
                      </label>
                    </div>
                  ) : (
                    <Image
                      src={`http://localhost:8080${user.banner}`}
                      alt="Banner"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() =>
                        handleImageClick(`http://localhost:8080${user.banner}`)
                      }
                      cursor="pointer"
                    />
                  )}
                </Td>
                <Td className="Td-actions">
                  <IconButton
                    aria-label={
                      editingRows.includes(user.user_id) ? "Guardar" : "Editar"
                    }
                    icon={
                      <Icon
                        as={
                          editingRows.includes(user.user_id) ? FaCheck : FaEdit
                        }
                      />
                    }
                    onClick={() =>
                      editingRows.includes(user.user_id)
                        ? handleSave(
                            entity,
                            user.user_id,
                            editingData[user.user_id],
                            "formData"
                          )
                        : handleEdit(user.user_id)
                    }
                  />
                  {!editingRows.includes(user.user_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<Icon as={FaTrash} />}
                      onClick={() => handleDeleteConfirmation(user.user_id)}
                    />
                  )}
                  {editingRows.includes(user.user_id) && (
                    <Button
                      aria-label="Cancelar"
                      leftIcon={<Icon as={FaTimes} />}
                      onClick={() => handleCancel(user.user_id)}
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
        "¿Estás seguro de que deseas eliminar a este usuario?"
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

export default UsersDataFetcher;
