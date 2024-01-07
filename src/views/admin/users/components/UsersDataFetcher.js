import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Icon,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function UsersDataFetcher() {
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const { token } = useContext(TokenContext);
  console.log("token",token);
  const handleEdit = (userId) => {
    setEditingRows([...editingRows, userId]);
  };

  const handleSave = async (userId, field, value) => {
    try {
      const updatedUsers = users.map((user) => {
        if (user.user_id === userId) {
          return { ...user, [field]: value };
        }
        return user;
      });

      setUsers(updatedUsers);
      setEditingRows(editingRows.filter((row) => row !== userId));

      await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(`Campo ${field} del usuario ${userId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (userId) => {
    const updatedUsers = users.map((user) => {
      const originalUser = originalUsers.find(
        (originalUser) => originalUser.user_id === user.user_id
      );
      return originalUser ? { ...originalUser } : user;
    });
    setUsers(updatedUsers);
    setEditingRows(editingRows.filter((row) => row !== userId));
  };

  const handleDelete = async (userId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUsers = users.filter(
        (user) => user.user_id !== userId
      );
      setUsers(updatedUsers);

      console.log(`Usuario con ID ${userId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  const handleDeleteConfirmation = (userId) => {
    setDeleteConfirmationId(userId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(deleteConfirmationId);
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/users", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setUsers(data.data);
          setOriginalUsers(data.data); // Guarda la data original al cargar
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de usuarios:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID de Usuario</Th>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
            <Th>Email</Th>
            <Th>Fecha de Nacimiento</Th>
            <Th>Avatar</Th>
            <Th>Banner</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {users.map((user) => (
            <Tr key={user.user_id}>
              <Td>{user.user_id}</Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.name}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, name: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.name
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.last_name}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, last_name: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.last_name
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.email}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, email: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.email
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.birth_date}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, birth_date: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.birth_date
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.avatar}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, avatar: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.avatar
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.banner}
                    onChange={(e) =>
                      setUsers((prevUsers) =>
                        prevUsers.map((usr) =>
                          usr.user_id === user.user_id
                            ? { ...usr, banner: e.target.value }
                            : usr
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.banner
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(user.user_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(user.user_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(user.user_id)
                      ? handleSave(user.user_id, "name", user.name)
                      : handleEdit(user.user_id)
                  }
                />
                {!editingRows.includes(user.user_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(user.user_id)
                    }
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

      <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar este usuario?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Eliminar
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default UsersDataFetcher;
