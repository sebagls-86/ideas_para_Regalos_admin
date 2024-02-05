import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, useColorModeValue } from "@chakra-ui/react";

const ProfileAvatar = ({ avatarURL, onConfirm, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const borderColor = useColorModeValue("white !important", "#111C44 !important");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedFile);
    setOriginalPreview(preview);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCancel = () => {
    setPreview(originalPreview);
    setSelectedFile(null);
  };

  useEffect(() => {
    setOriginalPreview(avatarURL);
    setPreview(avatarURL);
  }, [avatarURL]);

  return (
    <Box>
      <label htmlFor="avatarInput">
        <Avatar
          mx="auto"
          src={preview || avatarURL}
          h="87px"
          w="87px"
          mt="-43px"
          border="4px solid"
          borderColor={borderColor}
          cursor="pointer"
        />
      </label>
      <input
        id="avatarInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {preview !== originalPreview && (
        <Box mt="2">
          <Button onClick={handleConfirm} mr="2">
            Confirmar
          </Button>
          <Button onClick={handleCancel} variant="outline">
            Cancelar
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProfileAvatar;
