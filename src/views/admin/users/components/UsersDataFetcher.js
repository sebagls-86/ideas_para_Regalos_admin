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
import { FaEdit, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import "../../../../assets/css/Tables.css";

function UsersDataFetcher() {
  const apiEndpoint = "http://localhost:8080/api/v1/users";
  const { token } = useContext(TokenContext);
  const {
    data: users,
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

  console.log("token users", token);

  return (
    <Box marginTop="10rem" maxHeight="500px" overflowY="auto">
      <Table variant="simple" className="table-container">
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
        
        <TokenInvalidError
          isOpen={showTokenInvalidError}
          onClose={handleCloseTokenInvalidError}
        />
        <ErrorModal isOpen={showErrorModal} onClose={handleCloseErrorModal} />
        <Tbody
          className="scrollable-content"
          style={{ maxHeight: "calc(100vh - 11rem)", overflow: "hidden" }}
        >
          {users.map((user) => (
            <Tr key={user.user_id}>
              <Td>{user.user_id}</Td>
              <Td>
                {editingRows.includes(user.user_id) ? (
                  <Input
                    value={user.name}
                    onChange={(e) =>
                      handleSave(user.user_id, "name", e.target.value)
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
                      handleSave(user.user_id, "last_name", e.target.value)
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
                      handleSave(user.user_id, "email", e.target.value)
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
                      handleSave(user.user_id, "birth_date", e.target.value)
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
                      handleSave(user.user_id, "avatar", e.target.value)
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
                      handleSave(user.user_id, "banner", e.target.value)
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
                    editingRows.includes(user.user_id) ? "Guardar" : "Editar"
                  }
                  icon={
                    <Icon
                      as={editingRows.includes(user.user_id) ? FaCheck : FaEdit}
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
