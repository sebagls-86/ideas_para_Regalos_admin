import React, { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import TokenInvalidError from "../../../../components/modals/modalTokenInvalidError";
import ErrorModal from "../../../../components/modals/modalError";
import useFeedbackModal from "../../../../components/modals/feedbackModal";
import useDataFetcher from "../../../../components/dataManage/useDataFetcher";
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
  Input,
  Flex,
  Select,
  IconButton,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function ProfilesDataFetcher() {
  const entity = "profiles";
  const apiEndpoint = "http://localhost:8080/api/v1/profiles";
  const token = useContext(TokenContext).token;

  const {
    data: profiles,
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
  } = useDataFetcher(apiEndpoint, token);

  const { FeedbackModal } = useFeedbackModal();

  const customFilter = (profile, searchTerm) => {
    const matchId = profile.profile_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const userIdMatch = profile.user_id
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = profile.name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const lastNameMatch = profile.last_name
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const ageRangeMatch = profile.age_range
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const relationshipMatch = profile.relationship
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return (
      matchId ||
      userIdMatch ||
      nameMatch ||
      lastNameMatch ||
      ageRangeMatch ||
      relationshipMatch
    );
  };

  const { searchTerm, handleSearch, filteredData } = useCustomFilter(
    profiles,
    customFilter
  );

  const [ageRangeOptions, setAgeRangeOptions] = useState([]);

  useEffect(() => {
    const fetchAgeRanges = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/ageRanges");
        const result = await response.json();
        const ageRanges = result.data || [];
        setAgeRangeOptions(ageRanges);
      } catch (error) {
        console.error("Error fetching age ranges:", error);
      }
    };

    fetchAgeRanges();
  }, []);

  const [relationshipOptions, setRelationshipOptions] = useState([]);

  useEffect(() => {
    const fetchRelationships = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/relationships"
        );
        const result = await response.json();
        const relationships = result.data || [];
        setRelationshipOptions(relationships);
      } catch (error) {
        console.error("Error fetching relationships:", error);
      }
    };

    fetchRelationships();
  }, []);

  const handleEditChange = (value, fieldName, eventId) => {
    const numericValue =
      fieldName === "age_range_id" || fieldName === "relationship_id"
        ? parseInt(value, 10)
        : value;

    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [eventId]: {
        ...prevEditingData[eventId],
        [fieldName]: numericValue,
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
      </Flex>
      <Box maxHeight="500px" marginTop="1rem" overflowY="auto">
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
            {filteredData.map((profile) => (
              <Tr key={profile.profile_id}>
                <Td>{profile.profile_id}</Td>
                <Td>{profile.user_id}</Td>
                <Td>
                  {editingRows.includes(profile.profile_id) ? (
                    <Input
                      value={
                        editingData[profile.profile_id]?.name || profile.name
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e.target.value,
                          "name",
                          profile.profile_id
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
                      value={
                        editingData[profile.profile_id]?.last_name ||
                        profile.last_name
                      }
                      onChange={(e) =>
                        handleEditChange(
                          e.target.value,
                          "last_name",
                          profile.profile_id
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
                    <Select
                      value={
                        editingData[profile.profile_id]?.age_range_id !==
                        undefined
                          ? editingData[profile.profile_id].age_range_id
                          : ageRangeOptions.find(
                              (option) => option.name === profile.age_range
                            )?.age_range_id || ""
                      }
                      onChange={(e) =>
                        handleEditChange(
                          parseInt(e.target.value, 10),
                          "age_range_id",
                          profile.profile_id
                        )
                      }
                      style={{ width: "100px" }}
                    >
                      {ageRangeOptions.map((option) => (
                        <option
                          key={option.age_range_id}
                          value={option.age_range_id}
                        >
                          {option.name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    profile.age_range
                  )}
                </Td>
                <Td>
                  {editingRows.includes(profile.profile_id) ? (
                    <Select
                      value={
                        editingData[profile.profile_id]?.relationship_id !==
                        undefined
                          ? editingData[profile.profile_id].relationship_id
                          : relationshipOptions.find(
                              (option) =>
                                option.relationship_name ===
                                profile.relationship
                            )?.relationship_id || ""
                      }
                      onChange={(e) =>
                        handleEditChange(
                          parseInt(e.target.value, 10),
                          "relationship_id",
                          profile.profile_id
                        )
                      }
                    >
                      {relationshipOptions.map((option) => (
                        <option
                          key={option.relationship_id}
                          value={option.relationship_id}
                        >
                          {option.relationship_name}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    profile.relationship
                  )}
                </Td>
                <Td className="Td-actions">
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
                        ? handleSave(
                            entity,
                            profile.profile_id,
                            editingData[profile.profile_id]
                          )
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
        "¿Estás seguro de que deseas eliminar este perfil?"
      )}
    </Box>
  );
}

export default ProfilesDataFetcher;
