/* eslint-disable */
import React from "react";
import { NavLink } from "react-router-dom";
// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/logoIdeasParaRegalos.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";

function SignIn() {
  // Chakra color mode
  const { colorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  const textColor = useColorModeValue(isDarkMode ? "white" : "navy.700", "white");
  const textColorSecondary = isDarkMode ? "gray.300" : "gray.400";
 const textColorBrand = useColorModeValue(isDarkMode ? "brand.300" : "brand.500", "white");
  const brandStars = useColorModeValue(isDarkMode ? "brand.300" : "brand.500", "brand.400");
  const googleBg = useColorModeValue(isDarkMode ? "gray.700" : "secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue(isDarkMode ? "white" : "navy.700", "white");
  const googleHover = useColorModeValue(
    isDarkMode ? { bg: "gray.600" } : { bg: "gray.200" },
    isDarkMode ? { bg: "whiteAlpha.300" } : { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    isDarkMode ? { bg: "gray.700" } : { bg: "secondaryGray.300" },
    isDarkMode ? { bg: "whiteAlpha.200" } : { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        h="100vh"
        alignItems="left"
        justifyContent="center"
        flexDirection="column"
      >
        <Box
          maxW={{ base: "100%", md: "420px" }}
          w="100%"
          background={isDarkMode ? "gray.800" : "white"}
          p="4"
          boxShadow="lg"
          mt="40px"
        >
          <Box>
            <Heading color={textColor} fontSize="36px" mb="10px">
              Welcome Admin!
            </Heading>
            <Text
              mb="36px"
              ms="4px"
              color={textColorSecondary}
              fontWeight="400"
              fontSize="md"
            >
              Enter your email and password to sign in!
            </Text>
          </Box>
          <Flex direction="column">
            <Button
              fontSize="sm"
              me="0px"
              mb="26px"
              py="15px"
              h="50px"
              borderRadius="16px"
              bg={googleBg}
              color={googleText}
              fontWeight="500"
              _hover={googleHover}
              _active={googleActive}
              _focus={googleActive}
            >
              <Icon as={FcGoogle} w="20px" h="20px" me="10px" />
              Sign in with Google
            </Button>
            <Flex align="center" mb="25px">
              <HSeparator />
              <Text color={isDarkMode ? "gray.300" : "gray.400"} mx="14px">
                or
              </Text>
              <HSeparator />
            </Flex>
            <FormControl>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@simmmple.com"
                mb="24px"
                fontWeight="500"
                size="lg"
              />
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? "text" : "password"}
                  variant="auth"
                />
                <InputRightElement
                  display="flex"
                  alignItems="center"
                  mt="4px"
                >
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent="space-between" align="center" mb="24px">
                <FormControl display="flex" alignItems="center"></FormControl>
                <NavLink to="/auth/forgot-password">
                  <Text
                    color={textColorBrand}
                    fontSize="sm"
                    w="124px"
                    fontWeight="500"
                  >
                    Forgot password?
                  </Text>
                </NavLink>
              </Flex>
              <Button
                fontSize="sm"
                variant="brand"
                fontWeight="500"
                w="100%"
                h="50"
                mb="24px"
              >
                Sign In
              </Button>
            </FormControl>
          </Flex>
        </Box>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
