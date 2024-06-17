import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react";

const FeedbackModal = ({ isOpen, onClose, feedbackMessage }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Feedback</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <div dangerouslySetInnerHTML={{ __html: feedbackMessage }} />
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" onClick={onClose}>
        Cerrar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>
);

const useFeedbackModal = () => {
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
    setFeedbackMessage("");
  };

  const openFeedbackModal = (message) => {
    setFeedbackMessage(message);
    setShowFeedbackModal(true);
  };

  return { openFeedbackModal, FeedbackModal: () => <FeedbackModal isOpen={showFeedbackModal} onClose={handleFeedbackModalClose} feedbackMessage={feedbackMessage} /> };
};

export default useFeedbackModal;