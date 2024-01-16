import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const fetchData = async (apiEndpoint, token, setData, setOriginalData, setShowErrorModal, setShowTokenInvalidError, history) => {
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(apiEndpoint, requestOptions);

    console.log("response", response);

    if (response.status === 400) {
      setShowTokenInvalidError(true);
      setTimeout(() => {
        localStorage.removeItem("token");
        setData([]);
        setOriginalData([]);
        history.push("/auth/login");
      }, 0);
      throw new Error("Bad Request");
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      setData(data.data);
      setOriginalData(data.data.map((item) => ({ ...item })));
    } else {
      console.error("Server response does not contain expected data:", data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    if (error.message === "Bad Request") {
      setShowTokenInvalidError(true);
      localStorage.removeItem("token");
      setData([]);
      setOriginalData([]);
      history.push("/auth/login");
    } else {
      console.log("Error message:", error.message);
      setShowErrorModal(true);
    }
  }
};

function useDataFetcher(apiEndpoint, token) {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [editingRows, setEditingRows] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showTokenInvalidError, setShowTokenInvalidError] = useState(false);
  const history = useHistory();

  const handleEdit = (itemId) => {
    setEditingRows([...editingRows, itemId]);
  };


  const handleCancel = (itemId) => {
    const updatedData = data.map((item) => {
      const originalItem = originalData.find(
        (originalItem) => originalItem.id === item.id
      );
      return originalItem ? { ...originalItem } : item;
    });
    setData(updatedData);
    setEditingRows(editingRows.filter((row) => row !== itemId));
  };

  const handleSave = async (itemId, field, value, index) => {
    try {
      const updatedData = data.map((item, i) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      });

      setData(updatedData);
      setEditingRows(editingRows.filter((row) => row !== itemId));

      const response = await fetch(`${apiEndpoint}/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.status === 403) {
        setShowErrorModal(true);
        throw new Error("Forbidden");
      }

      const updatedOriginalData = [...originalData];
      updatedOriginalData.splice(index, 1);
      setOriginalData(updatedOriginalData);
    } catch (error) {
      console.error("Error saving data:", error);
      if (error.message === "Forbidden") {
        setShowErrorModal(true);
        localStorage.removeItem("token");
        setData([]); // Limpiar datos
        setOriginalData([]);
        history.push("/auth/login");
      }
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

      if (response.status === 403) {
        setShowErrorModal(true);
        throw new Error("Forbidden");
      }

      const updatedData = data.filter((item) => item.id !== itemId);
      setData(updatedData);
    } catch (error) {
      console.error("Error deleting data:", error);
      if (error.message === "Forbidden") {
        setShowErrorModal(true);
        localStorage.removeItem("token");
        setData([]); // Limpiar datos
        setOriginalData([]);
        history.push("/auth/login");
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

  useEffect(() => {
    if (!token) {
      history.push("/auth/login");
      return;
    }
    fetchData(apiEndpoint, token, setData, setOriginalData, setShowErrorModal, setShowTokenInvalidError, history);
  }, [apiEndpoint, token, history, setShowErrorModal, setShowTokenInvalidError]);


  return {
    data,
    editingRows,
    showDeleteConfirmation,
    deleteConfirmationId,
    showTokenInvalidError,
    showErrorModal,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
    handleDeleteConfirmation,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleCloseErrorModal,
    handleCloseTokenInvalidError,
  };
}

export default useDataFetcher;
