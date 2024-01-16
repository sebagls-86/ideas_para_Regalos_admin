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

function CategoriesDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/categories";
  const token = useContext(TokenContext).token;

  const {
    data: categories,
    editingRows,
    showDeleteConfirmation,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirmation,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
  } = useDataFetcher(apiEndpoint, token);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" mt={8} className="table-container">
        <Thead className="sticky-header">
          <Tr>
            <Th>ID</Th>
            <Th>Nombre</Th>
            <Th>Imagen</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody className="scrollable-content">
          {categories.map((category) => (
            <Tr key={category.category_id}>
              <Td>{category.category_id}</Td>
              <Td>
                {editingRows.includes(category.category_id) ? (
                  <Input
                    value={category.name}
                    onChange={(e) =>
                      handleEdit(category.category_id)
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  category.name
                )}
              </Td>
              <Td>
                {editingRows.includes(category.category_id) ? (
                  <Input
                    value={category["/images/categories/categoryImage"]}
                    onChange={(e) =>
                      handleEdit(category.category_id)
                    }
                    minWidth="100px"
                    color="white"
                  />
                ) : (
                  category["/images/categories/categoryImage"]
                )}
              </Td>
              <Td>
                <IconButton
                  aria-label={
                    editingRows.includes(category.category_id)
                      ? "Guardar"
                      : "Editar"
                  }
                  icon={
                    <Icon
                      as={
                        editingRows.includes(category.category_id)
                          ? FaCheck
                          : FaEdit
                      }
                    />
                  }
                  onClick={() =>
                    editingRows.includes(category.category_id)
                      ? handleSave(category.category_id, "name", category.name)
                      : handleEdit(category.category_id)
                  }
                />
                {!editingRows.includes(category.category_id) && (
                  <IconButton
                    aria-label="Eliminar"
                    icon={<Icon as={FaTrash} />}
                    onClick={() => handleDeleteConfirmation(category.category_id)}
                  />
                )}
                {editingRows.includes(category.category_id) && (
                  <Button
                    aria-label="Cancelar"
                    leftIcon={<Icon as={FaTimes} />}
                    onClick={() => handleCancel(category.category_id)}
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
            ¿Estás seguro de que deseas eliminar esta categoría?
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

export default CategoriesDataFetcher;
