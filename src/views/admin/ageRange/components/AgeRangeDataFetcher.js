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
  Button,
} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function AgeRangeDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/ageRanges";
  const token = useContext(TokenContext).token;

  const {
    data,
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
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Edad Mínima</Th>
            <Th>Edad Máxima</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {data.map((range, index) => (
            <Tr key={range.age_range_id}>
              <Td>{range.age_range_id}</Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.name}
                    onChange={(e) => handleEdit(range.age_range_id)}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.name
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.minimum_age}
                    onChange={(e) => handleEdit(range.age_range_id)}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.minimum_age
                )}
              </Td>
              <Td>
                {editingRows.includes(range.age_range_id) ? (
                  <input
                    value={range.maximum_age}
                    onChange={(e) => handleEdit(range.age_range_id)}
                    style={{ minWidth: "100px" }}
                  />
                ) : (
                  range.maximum_age
                )}
              </Td>
              <Td width="100px">
                <IconButton
                  aria-label={
                    editingRows.includes(range.age_range_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(range.age_range_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(range.age_range_id)
                      ? handleSave(
                          range.age_range_id,
                          "name",
                          range.name,
                          index
                        )
                      : handleEdit(range.age_range_id)
                  }
                />

                {!editingRows.includes(range.age_range_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<FaTrash />}
                    onClick={() => handleDeleteConfirmation(range.age_range_id)}
                  />
                )}
                {editingRows.includes(range.age_range_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<FaTimes />}
                    onClick={() => handleCancel(range.age_range_id)}
                  ></Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {renderDeleteConfirmationModal(
        "¿Estás seguro de que deseas eliminar este rango de edad?"
        )}          
    </Box>
  );
}

export default AgeRangeDataFetcher;
