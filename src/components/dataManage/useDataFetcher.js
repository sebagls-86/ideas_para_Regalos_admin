import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useFeedbackModal from "../modals/feedbackModal";

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const fetchData = async (
  apiEndpoint,
  token,
  setData,
  setOriginalData,
  setShowErrorModal,
  setShowTokenInvalidError,
  history
) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(apiEndpoint, requestOptions);
    const data = await response.json();

    if (response.status === 400) {
      setShowTokenInvalidError(true);
      throw new Error("Bad Request");
    }

    if (response.status === 401 && data.message === "Token is expired.") {
      setShowTokenInvalidError(true);
      await sleep(3000);
      window.location.reload();
    }

    

    if (data && Array.isArray(data.data)) {
      setData(data.data);
      setOriginalData(data.data.map((item) => ({ ...item })));
    } else {
      console.error("Server response does not contain expected data:", data);
    }
  } catch (error) {
    if (
      error.message === "invalid token" ||
      error.message === "token expired"
    ) {
      setShowTokenInvalidError(true);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    } else {
      setShowErrorModal(true);
    }
  }
};

function useDataFetcher(apiEndpoint, token) {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showTokenInvalidError, setShowTokenInvalidError] = useState(false);
  const { openFeedbackModal, FeedbackModal: FeedbackModalComponent } =
    useFeedbackModal();
  const history = useHistory();

  const reloadData = async () => {
    fetchData(
      apiEndpoint,
      token,
      setData,
      setOriginalData,
      setShowErrorModal,
      setShowTokenInvalidError,
      history
    );
  };

  const handleEdit = (itemId) => {
    setEditingRows([...editingRows, itemId]);
  };

  const handleCancel = (itemId) => {
    const updatedData = originalData.map((originalItem) => ({
      ...originalItem,
    }));
    setData(updatedData);

    setEditingRows((prevEditingRows) =>
      prevEditingRows.filter((row) => row !== itemId)
    );

    setEditingData((prevEditingData) => {
      const newEditingData = { ...prevEditingData };
      delete newEditingData[itemId];
      return newEditingData;
    });
  };

  const isFieldModified = (data, id, fieldName, newValue) => {
    return data[id][fieldName] !== newValue;
  };

  const isFieldEmpty = (data, id, fieldName) => {
    return data[id][fieldName] === null || data[id][fieldName] === "";
  };

  const formatToDDMMYYYY = (date) => {
    if (!date) {
      return "";
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async (entity, itemId, formData, requestType = "json") => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (formData === undefined) {
        handleCancel(itemId);
        return;
      }

      let requestBody;

      if (formData.date) {
        formData.date = formatToDDMMYYYY(formData.date);
      }

      if (requestType === "formData") {
        const formDataWithToken = new FormData();
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            if (
              key === "image" ||
              key === "images" ||
              key === "avatar" ||
              key === "banner"
            ) {
              if (formData[key]) {
                formDataWithToken.append(key, formData[key]);
              }
            } else {
              formDataWithToken.append(key, formData[key]);
            }
          }
        }

        requestBody = formDataWithToken;
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify(formData);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/${entity}/${itemId}`,
        {
          method: "PATCH",
          headers: headers,
          body: requestBody,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setEditingRows((prevEditingRows) =>
          prevEditingRows.filter((row) => row !== itemId)
        );
        openFeedbackModal("Operación realizada");
        reloadData();
      } else if (
        response.status === 401 &&
        data.message === "Token is expired."
      ) {
        openFeedbackModal("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
        sleep(3000);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } else {
        setShowErrorModal(true);
        console.error(`${response.statusText}`);
      }
    } catch (error) {
      setShowErrorModal(true);
      console.error(error.message);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`${apiEndpoint}/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        openFeedbackModal("Operación realizada");
        reloadData();
      }

      if (response.status === 403) {
        setShowErrorModal(true);
        throw new Error("Forbidden");
      }else if (
        response.status === 401 &&
        data.message === "Token is expired."
      ) {
        openFeedbackModal("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
        sleep(3000);
        showTokenInvalidError(true);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }

      const updatedData = data.filter((item) => item.id !== itemId);
      setData(updatedData);
    } catch (error) {
      if (error.message === "Forbidden") {
        setShowErrorModal(true);
      }
    }
  };

  const handleDeleteConfirmation = (itemId) => {
    setDeleteConfirmationId(itemId);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    await handleDelete(deleteConfirmationId);
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleCustomDelete = async (customDeleteUrl, itemId) => {
    try {
      const response = await fetch(`${customDeleteUrl}/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        openFeedbackModal("Operación realizada");
        reloadData();
      }

      if (response.status === 403) {
        setShowErrorModal(true);
        throw new Error("Forbidden");
      }else if (
        response.status === 401 &&
        data.message === "Token is expired."
      ) {
        showTokenInvalidError(true);
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }

      const updatedData = data.filter((item) => item.id !== itemId);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting data:", error);
      if (error.message === "Forbidden") {
        setShowErrorModal(true);
      }
    }
  };

  const handleCustomDeleteConfirmation = (customDeleteUrl, itemId) => {
    setDeleteConfirmationId({ customDeleteUrl, itemId });
    setShowDeleteConfirmation(true);
  };

  const handleCustomDeleteConfirm = async () => {
    const { customDeleteUrl, itemId } = deleteConfirmationId;
    await handleCustomDelete(customDeleteUrl, itemId);
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
    setDeleteConfirmationId(null);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const handleCloseTokenInvalidError = () => {
    setShowTokenInvalidError(false);
  };

  const renderDeleteConfirmationModal = (bodyContent) => (
    <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{bodyContent}</ModalBody>
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
  );

  const renderCustomDeleteConfirmationModal = (bodyContent) => (
    <Modal isOpen={showDeleteConfirmation} onClose={handleDeleteCancel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{bodyContent}</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleCustomDeleteConfirm}>
            Eliminar
          </Button>
          <Button variant="ghost" onClick={handleDeleteCancel}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const updateEditingData = (itemId, newData) => {
    setEditingData((prevEditingData) => ({
      ...prevEditingData,
      [itemId]: { ...newData },
    }));
  };

  useEffect(() => {
    if (!token) {
      //history.push("/auth/login");
      return;
    }
    fetchData(
      apiEndpoint,
      token,
      setData,
      setOriginalData,
      setShowErrorModal,
      setShowTokenInvalidError,
      history
    );
  }, [
    apiEndpoint,
    token,
    history,
    setShowErrorModal,
    setShowTokenInvalidError,
  ]);

  return {
    data,
    editingRows,
    showDeleteConfirmation,
    deleteConfirmationId,
    showTokenInvalidError,
    showErrorModal,
    editingData,
    isFieldModified,
    isFieldEmpty,
    setEditingData,
    updateEditingData,
    setShowErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
    handleDeleteConfirmation,
    handleDeleteConfirm,
    handleCustomDelete,
    handleCustomDeleteConfirmation,
    handleCustomDeleteConfirm,
    handleDeleteCancel,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
    renderDeleteConfirmationModal,
    renderCustomDeleteConfirmationModal,
    reloadData,
    FeedbackModal: () => <FeedbackModalComponent />,
  };
}

export default useDataFetcher;
