import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function UserDataFetcher() {
  const [userData, setUserData] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NDk0MjQ5fQ.mDEPvo6mZQo6EeudHx4uMUUNWJ2gkQV6a9FJcnNKQxo";

  const handleEdit = (userId) => {
    setEditingRows([...editingRows, userId]);
  };

  const handleSave = async (userId, field, value) => {
    try {
      if (field === "user_id") {
        console.error("No se puede editar el ID de usuario.");
        return;
      }

      const updatedUserData = userData.map((user) => {
        if (user.user_id === userId) {
          return { ...user, [field]: value };
        }
        return user;
      });

      setUserData(updatedUserData);
      setEditingRows(editingRows.filter((row) => row !== userId));

      await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      console.log(
        `Campo ${field} del usuario ${userId} actualizado a ${value}`
      );
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (userId) => {
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

      const updatedUserData = userData.filter(
        (user) => user.user_id !== userId
      );
      setUserData(updatedUserData);

      console.log(`Usuario con ID ${userId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  };

  useEffect(() => {
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/users", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setUserData(data.data);
        } else {
          console.error("Los datos de usuario no son un array:", data);
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de usuario:", error);
      });
  }, []);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
  <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>User ID</Th>
            <Th>Name</Th>
            <Th>Last Name</Th>
            <Th>Email</Th>
            <Th>Birth Day</Th>
            <Th>Avatar</Th>
            <Th>Banner</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {userData.map((user, index) => (
            <Tr key={index}>
              <Td>{user.user_id}</Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.name}
                    onChange={(e) => (user.name = e.target.value)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  <span style={{ display: "block", minWidth: "100px" }}>
                    {user.name}
                  </span>
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.last_name}
                    onChange={(e) => (user.last_name = e.target.value)}
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
                    onChange={(e) => (user.email = e.target.value)}
                    minWidth="200px"
                    color="white"
                  />
                ) : (
                  user.email
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.birth_day}
                    onChange={(e) => (user.birth_day = e.target.value)}
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  user.birth_day
                )}
              </Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.avatar}
                    onChange={(e) => (user.avatar = e.target.value)}
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
                    onChange={(e) => (user.banner = e.target.value)}
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
                    editingRows.includes(user.user_id) ? "Save" : "Edit"
                  }
                  icon={
                    <Icon
                      as={editingRows.includes(user.user_id) ? FaCheck : FaEdit}
                    />
                  }
                  onClick={() =>
                    editingRows.includes(user.user_id)
                      ? handleSave(user.user_id)
                      : handleEdit(user.user_id)
                  }
                />
                <IconButton
                  aria-label="Delete"
                  icon={<Icon as={FaTrash} />}
                  onClick={() => handleDelete(user.user_id)}
                />
                {editingRows.includes(user.user_id) && (
                  <Button
                    aria-label="Cancel"
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
  );
}

export default UserDataFetcher;
