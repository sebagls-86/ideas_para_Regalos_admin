import React, { useContext } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modalError/modalTokenInvalidError";
import useDataFetcher from "../../../../components/fetchData/useDataFetcher";
import ErrorModal from "../../../../components/modalError/modalError";
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

function ProfilesDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/profiles";
  const token = useContext(TokenContext).token;

  const {
    data: profiles,
    editingRows,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
  } = useDataFetcher(apiEndpoint, token);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>Profile ID</Th>
            <Th>User ID</Th>
            <Th>Nombre</Th>
            <Th>Apellido</Th>
            <Th>Rango de Edad</Th>
            <Th>Relacion</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {profiles.map((profile) => (
            <Tr key={profile.profile_id}>
              <Td>{profile.profile_id}</Td>
              <Td>{profile.user_id}</Td>
              <Td>
                {editingRows.includes(profile.profile_id) ? (
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      handleEdit(profile.profile_id, "name", e.target.value)
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
                      handleEdit(
                        profile.profile_id,
                        "last_name",
                        e.target.value
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
                {editingRows.includes(profile.profile_id) ? (
                  <Input
                    value={profile.age_range_id}
                    onChange={(e) =>
                      handleEdit(
                        profile.profile_id,
                        "age_range_id",
                        e.target.value
                      )
                    }
                    minWidth="50px"
                    color="white"
                  />
                ) : (
                  profile.age_range_id
                )}
              </Td>
              <Td>
                {editingRows.includes(profile.profile_id) ? (
                  <Input
                    value={profile.relationship_id}
                    onChange={(e) =>
                      handleEdit(
                        profile.profile_id,
                        "relationship_id",
                        e.target.value
                      )
                    }
                    minWidth="50px"
                    color="white"
                  />
                ) : (
                  profile.relationship_id
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
                      ? handleSave(profile.profile_id)
                      : handleEdit(profile.profile_id)
                  }
                />
                {!editingRows.includes(profile.profile_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleDeleteConfirmation(profile.profile_id)}
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
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este perfil?"
      )}
    </Box>
  );
}

export default ProfilesDataFetcher;
