import { useState } from 'react';
import useFeedbackModal from '../modals/feedbackModal';


const useDataPoster = (apiUrl, token, reloadData, showErrorCallback, customValidation) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({});
    setFormErrors({});
    setFeedbackMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  
    const formattedValue =
      name === 'date' && value ? formatToDDMMYYYY(new Date(value)) : value;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));
  };

  const formatToDDMMYYYY = (date) => {
    if (!date) {
      return '';
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: file,
    }));
  };

  const validateForm = () => {
    const errors = customValidation ? customValidation(formData) : {};

    setFormErrors(errors);

    return Object.values(errors).every((error) => error === '');
  };

  const { openFeedbackModal, FeedbackModal } = useFeedbackModal();

  const postData = async (formData, requestType = 'json') => {
    const isFormValid = validateForm();

    if (isFormValid) {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        let requestBody;
  
        if (formData.date) {
          formData.date = formatToDDMMYYYY(formData.date);
        }
    
        if (requestType === 'formData') {
          const formDataWithToken = new FormData();
    
          for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
              if (key === 'image' || key === 'avatar' || key === 'banner') {
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
         headers['Content-Type'] = 'application/json';
          requestBody = JSON.stringify(formData);
        }
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: requestBody,
        });

        if (response.ok) {
          handleModalClose();
          openFeedbackModal("Operación realizada");
          reloadData();
        } else {
          if (response.status === 403) {
            handleModalClose();
            showErrorCallback(true);
          } else if ((response.status === 400) && (response.message === "token expired")) {
            openFeedbackModal('Ocurrió un problema. Loguéate nuevamente.');
            localStorage.removeItem("token")
            localStorage.removeItem("userInfo")
          } else if (response.status === 500) {
            openFeedbackModal(`${response.statusText}`);
          } else {
            openFeedbackModal('Ocurrió un problema inesperado. Contacta al administrador');
          }
        }
      } catch (error) {
        openFeedbackModal('Ocurrió un problema inesperado. Contacta al administrador');
      }
    } else {
      openFeedbackModal('Formulario inválido');
      }
  };

  return {
    formData,
    formErrors,
    showModal,
    FeedbackModal: () => <FeedbackModal isOpen={showModal} onClose={handleModalClose} feedbackMessage={feedbackMessage} />,
    setShowModal,
    handleModalOpen,
    handleModalClose,
    handleChange,
    handleFileChange,
    validateForm,
    postData,
  };
};

export default useDataPoster;
