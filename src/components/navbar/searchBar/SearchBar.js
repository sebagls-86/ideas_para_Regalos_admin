import React, { useState } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
export function SearchBar({ onSearch, ...props }) {
  const { variant, background, children, placeholder, borderRadius, ...rest } =
    props;
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");
  const [searchTerm, setSearchTerm] = useState("");

  const searchHandler = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (onSearch) {
      onSearch(newSearchTerm);
    }
  };

  return (
    <InputGroup
      w={{ base: "100%", md: "300px" }}
      bg={useColorModeValue("white", "gray.800")}
      borderRadius="full"
      borderColor={useColorModeValue("gray.200", "gray.600")}
      borderWidth="1px"
      _hover={{
        borderColor: useColorModeValue("gray.300", "gray.500"),
      }}
      _focus={{
        borderColor: useColorModeValue("blue.400", "blue.600"),
      }}
      boxShadow="md"
      {...rest}
    >
      <InputLeftElement
        children={
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            _hover="none"
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              borderColor: useColorModeValue("blue.400", "blue.600"),
            }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
          >
            onClick={searchHandler}
          </IconButton>
        }
      />
      <Input
        variant="search"
        fontSize="sm"
        bg={background ? background : inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: "white", fontSize: "14px" }}
        borderRadius={borderRadius ? borderRadius : "30px"}
        placeholder={placeholder ? placeholder : "Search..."}
        onChange={handleInputChange}
      />
    </InputGroup>
  );
}
