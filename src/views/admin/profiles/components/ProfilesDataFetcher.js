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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ProfilesDataFetcher() {
  const [profiles, setProfiles] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [profileIdToDelete, setProfileIdToDelete] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY";

  const handleEdit = (profileId) => {
    setEditingRows([...editingRows, profileId]);
  };

  const handleSave = async (profileId, field, value) => {
    try {
      const updatedProfiles = profiles.map((profile) => {
        if (profile.profile_id === profileId) {
          return { ...profile, [field]: value };
        }
        return profile;
      });
  
      setProfiles(updatedProfiles);
      setEditingRows(editingRows.filter((row) => row !== profileId));
  
      await fetch(`http://localhost:8080/api/v1/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
  
      console.log(`Campo ${field} del perfil ${profileId} actualizado a ${value}`);
    } catch (error) {
      console.error("Error al actualizar el campo:", error);
    }
  };

  const handleCancel = (profileId) => {
    setEditingRows(editingRows.filter((row) => row !== profileId));
  };

  const handleDelete = async (profileId) => {
    try {
      await fetch(`http://localhost:8080/api/v1/profiles/${profileId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfiles = profiles.filter(
        (profile) => profile.profile_id !== profileId
      );
      setProfiles(updatedProfiles);

      console.log(`Perfil con ID ${profileId} eliminado`);
    } catch (error) {
      console.error("Error al eliminar el perfil:", error);
    }
  };

  const handleDeleteConfirmation = (profileId) => {
    setProfileIdToDelete(profileId);
    setIsConfirmationOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(profileIdToDelete);
    setIsConfirmationOpen(false);
    setProfileIdToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsConfirmationOpen(false);
    setProfileIdToDelete(null);
  };

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    fetch("http://localhost:8080/api/v1/profiles", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setProfiles(data.data);
        } else {
          console.error(
            "La respuesta del servidor no contiene los datos esperados:",
            data
          );
        }
      })
      .catch((error) => {
        console.error("Error al obtener los datos de perfiles:", error);
      });
  }, [token]);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
            <Th>ID de usuario</Th>
            <Th>Rango de edad</Th>
            <Th>Relación</Th>
            <Th>Fecha de creación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {profiles.map((profile) => (
            <Tr key={profile.profile_id}>
              <Td>{profile.profile_id}</Td>
              <Td>{profile.name}</Td>
              <Td>{profile.last_name}</Td>
              <Td>{profile.user_id}</Td>
              <Td>{profile.age_range_id}</Td>
              <Td>{profile.relationship_id}</Td>
              <Td>{new Date(profile.created_at).toLocaleString()}</Td>
              <Td>
                <Box display="flex" alignItems="center">
                  {editingRows.includes(profile.profile_id) ? (
                    <>
                      <IconButton
                        aria-label="Guardar"
                        icon={<FaCheck />}
                        onClick={() => handleSave(profile.profile_id)}
                        mr={2}
                      />
                      <IconButton
                        aria-label="Cancelar"
                        icon={<FaTimes />}
                        onClick={() => handleCancel(profile.profile_id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      aria-label="Editar"
                      icon={<FaEdit />}
                      onClick={() => handleEdit(profile.profile_id)}
                      mr={2}
                    />
                  )}

                  {!editingRows.includes(profile.profile_id) && (
                    <IconButton
                      aria-label="Eliminar"
                      icon={<FaTrash />}
                      onClick={() =>
                        handleDeleteConfirmation(profile.profile_id)
                      }
                    />
                  )}
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isConfirmationOpen} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>¿Estás seguro de que deseas eliminar este perfil?</ModalBody>
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

export default ProfilesDataFetcher;
