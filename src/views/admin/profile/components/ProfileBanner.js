import React, { useState, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";

const ProfileBanner = ({ bannerURL, onConfirm, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(bannerURL);
  const [preview, setPreview] = useState(bannerURL);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);

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
  };

  const handleCancel = () => {
    setPreview(originalPreview);
    setSelectedFile(null);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleMouseDown = (event) => {
    setDragging(true);
    setOffsetX(event.clientX - event.target.getBoundingClientRect().left);
    setOffsetY(event.clientY - event.target.getBoundingClientRect().top);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (event) => {
    if (dragging) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;

      setOffsetX(x);
      setOffsetY(y);

      // Aplicar desplazamiento
      event.target.style.backgroundPosition = `${x}px ${y}px`;
    }
  };

  useEffect(() => {
    setOriginalPreview(bannerURL);
    setPreview(bannerURL);
  }, [bannerURL]);

  return (
    <Box position="relative">
      <label htmlFor="bannerInput">
        <Box
          bg={`url(${preview})`}
          bgSize="cover"
          borderRadius="16px"
          h="131px"
          w="100%"
          cursor="pointer"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        />
      </label>
      <input
        id="bannerInput"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {preview !== originalPreview && (
        <Button
          position="absolute"
          left="0"
          top="110%"
          transform="translateY(-50%)"
          onClick={handleConfirm}
          mr="2"
        >
          Confirmar
        </Button>
      )}
      {preview !== originalPreview && (
        <Button
          position="absolute"
          right="10px"
          top="110%"
          transform="translateY(-50%)"
          onClick={handleCancel}
          variant="outline"
        >
          Cancelar
        </Button>
      )}
    </Box>
  );
};

export default ProfileBanner;
