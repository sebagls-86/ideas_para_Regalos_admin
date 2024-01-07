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

function ProfilesDataFetcher() {
  const [profiles, setProfiles] = useState([]);
  const [originalProfiles, setOriginalProfiles] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluIiwidXNlcl9pZCI6OSwiZXhwIjoxNzA0NjQ2MjI1fQ.71pwKibJqOWTYJFWq1XwVVaqESzh1z9vrgdAgIVcEKY"; // Reemplaza con tu token

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
    const updatedProfiles = profiles.map((profile) => {
      const originalProfile = originalProfiles.find(
        (originalProfile) => originalProfile.profile_id === profile.profile_id
      );
      return originalProfile ? { ...originalProfile } : profile;
    });
    setProfiles(updatedProfiles);
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
    setDeleteConfirmationId(profileId);
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

    fetch("http://localhost:8080/api/v1/profiles", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setProfiles(data.data);
          setOriginalProfiles(data.data); // Guarda la data original al cargar
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
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody className="scrollable-content">
          {profiles.map((profile) => (
            <Tr key={profile.profile_id}>
              <Td>{profile.profile_id}</Td>
              <Td>
                {editingRows.includes(profile.profile_id) ? (
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfiles((prevProfiles) =>
                        prevProfiles.map((prof) =>
                          prof.profile_id === profile.profile_id
                            ? { ...prof, name: e.target.value }
                            : prof
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  profile.name
                )}
              </Td>
              <Td>
                {editingRows.includes(profile.profile_id) ? (
                  <Input
                    value={profile.last_name}
                    onChange={(e) =>
                      setProfiles((prevProfiles) =>
                        prevProfiles.map((prof) =>
                          prof.profile_id === profile.profile_id
                            ? { ...prof, last_name: e.target.value }
                            : prof
                        )
                      )
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  profile.last_name
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(profile.profile_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(profile.profile_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(profile.profile_id)
                      ? handleSave(profile.profile_id, "name", profile.name)
                      : handleEdit(profile.profile_id)
                  }
                />
                {!editingRows.includes(profile.profile_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() =>
                      handleDeleteConfirmation(profile.profile_id)
                    }
                  />
                )}
                {editingRows.includes(profile.profile_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(profile.profile_id)}
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
            ¿Estás seguro de que deseas eliminar este perfil?
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

export default ProfilesDataFetcher;
