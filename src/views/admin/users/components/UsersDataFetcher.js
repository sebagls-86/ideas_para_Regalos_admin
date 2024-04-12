import React, { useState } from "react";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
import useCustomFilter from "../../../../components/dataManage/useCustomFilter";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import ErrorModal from "../../../../components/modals/modalError";
import { SearchBar } from "../../../../components/navbar/searchBar/SearchBar";
import useDarkMode from "../../../../assets/darkModeHook";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
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
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Icon,
  Input,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function UsersDataFetcher() {
  const entity = "users";
  const apiEndpoint = `${process.env.REACT_APP_API_URL}/users`;
  const { isDarkMode } = useDarkMode();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [editedRoles, setEditedRoles] = useState({});
  const token = localStorage.getItem("token");
  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();
  const [avatarPreview, setAvatarPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const history = useHistory();

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

  const handleEditChange = (e, fieldName, user_id) => {
    let newValue = e.target.type === "file" ? e.target.files[0] : e.target.value;
  
   
    // Actualizar el estado de edición
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [user_id]: {
        ...prevEditingData[user_id],
        [fieldName]: newValue,
      },
    }));
  
    // Actualizar vista previa si es una imagen
    if (e.target.type === "file") {
      const previewURL = URL.createObjectURL(newValue);
      if (fieldName === "avatar") {
        setAvatarPreview(previewURL);
      } else if (fieldName === "banner") {
        setBannerPreview(previewURL);
      }
    }
  
    if (fieldName === "user_role") {
      setEditingData((prevEditingData) => ({
        ...prevEditingData,
        [user_id]: {
          ...prevEditingData[user_id],
          [fieldName]: newValue,
        },
      }));
    }
  
    };

  const handleDateChange = (date, fieldName, user_id) => {
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [user_id]: {
        ...prevEditingData[user_id],
        [fieldName]: date,
      },
    }));
  };

  const formatToDDMMYYYY = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const convertToCorrectDateFormat = (backendDate) => {
    const [day, month, year] = backendDate.split("/");
    return `${month}-${day}-${year}`;
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleSaveOrRoles = async (user_id) => {
    const editedAdminRole = editedRoles[user_id];
    const isAdminRoleComplete =
      editedAdminRole !== undefined && editedAdminRole !== null;
    const areOtherFieldsEdited = Object.keys(editingData[user_id] || {}).some(
      (field) => field !== "user_role"
    );
  
    if (isAdminRoleComplete) {
      await handleSaveRoles(user_id);
    } else if (areOtherFieldsEdited) {
      // Formatear la fecha antes de llamar a handleSave
      const formattedEditingData = { ...editingData[user_id] };
      if (formattedEditingData.birth_date) {
        formattedEditingData.birth_date = formatToDDMMYYYY(
          formattedEditingData.birth_date
        );
      }
      await handleSave(entity, user_id, formattedEditingData, "formData");
    }
  };

  const handleSaveRoles = async (userId) => {
    const roleValue = parseInt(editedRoles[userId], 10);
    if (roleValue !== undefined) {
      const apiUrl = `${process.env.REACT_APP_API_URL}/users/update-user-role`;

      try {
        const response = await fetch(apiUrl, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            role_id: roleValue,
          }),
        });

        if (response.ok) {
          openFeedbackModal("Rol actualizado con éxito");
          reloadData();
          handleCancel(userId);
        } else if (response.status === 403) {
          openFeedbackModal("No tienes permisos para realizar esta acción");
        } else if (response.status === 400) {
          openFeedbackModal("Hubo un error en la solicitud. Contacte al administrador");
          console.error("Error al actualizar el rol:", response.statusText);
        } else {
          openFeedbackModal("Error al actualizar el rol");
          console.error("Error al actualizar el rol:", response.statusText);
        }
      } catch (error) {
        history.replace("/error");
       }
    }
  };

  return (
    <Box marginTop="5rem" height="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Buscar..."
          value={searchTerm}
          style={{ color: isDarkMode ? "red" : "red" }}
        />
      </Flex>

      <Box maxHeight="500px" overflowY="auto">
        <Table variant="simple" className="table-container">
          <Thead className="sticky-header">
            <Tr>
              <Th>ID de Usuario</Th>
              <Th>ID de Auth0</Th>
              <Th>Rol</Th>
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
                <Td>{user.auth0_id}</Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <select
                      value={
                        editingData[user.user_id]?.user_role || user.user_role
                      }
                      onChange={(e) =>
                        handleEditChange(e, "user_role", user.user_id)
                      }
                      style={{ color: isDarkMode ? "white" : "black" }}
                      
                    >
                      <option value="1">SuperAdmin</option>
                      <option value="2">Medium</option>
                      <option value="3">Soft</option>
                      <option value="4">User</option>
                    </select>
                  ) : user.user_role === 1 ? (
                    "SuperAdmin"
                  ) : user.user_role === 2 ? (
                    "Medium"
                  ) : user.user_role === 3 ? (
                    "Soft"
                  ) : (
                    "User"
                  )}
                </Td>
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
                      style={{ color: isDarkMode ? "white" : "black" }}
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
                      style={{ color: isDarkMode ? "white" : "black" }}
                    />
                  ) : (
                    user.last_name
                  )}
                </Td>
                <Td>{user.email}</Td>
                <Td>
                  {editingRows.includes(user.user_id) ? (
                    <DatePicker
                      selected={
                        editingData[user.user_id]?.birth_date ||
                        (user.birth_date
                          ? new Date(
                              convertToCorrectDateFormat(user.birth_date)
                            )
                          : "")
                      }
                      onChange={(date) =>
                        handleDateChange(
                          date,
                          "birth_date",
                          user.user_id
                        )
                      }
                      dateFormat="dd-MM-yyyy"
                      placeholderText="Seleccionar fecha"
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      className="date-picker"
                    />
                  ) : user.birth_date ? (
                    user.birth_date
                  ) : (
                    ""
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
                          src={avatarPreview || user.avatar}
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
                      src={user.avatar}
                      alt="Avatar"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() => handleImageClick(user.avatar)}
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
                          src={bannerPreview || user.banner}
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
                      src={user.banner}
                      alt="Banner"
                      maxH="50px"
                      maxW="50px"
                      objectFit="cover"
                      onClick={() => handleImageClick(user.banner)}
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
                        ? handleSaveOrRoles(user.user_id)
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
