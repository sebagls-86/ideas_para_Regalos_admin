import React, { useContext, useEffect, useState } from "react";
import { TokenContext } from "../../../../contexts/TokenContext";
import { Avatar, Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import { jwtDecode } from "jwt-decode";

export default function Banner() {
  const { token } = useContext(TokenContext);
  const [userData, setUserData] = useState(null);

  const baseURL = 'http://localhost:8080';
  const avatarURL = userData?.avatar_url; 
  const bannerURL = userData?.banner_url;

const absoluteAvatarURL = `${baseURL}${avatarURL}`;
const absoluteBannerURL = `${baseURL}${bannerURL}`;

  useEffect(() => {
    const fetchUserData = async () => {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      if (token) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/v1/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setUserData(data?.data);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token]);

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Box
       bg={`url(${absoluteBannerURL})`}  
        bgSize="cover"
        borderRadius="16px"
        h="131px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={absoluteAvatarURL}
        h="87px"
        w="87px"
        mt="-43px"
        border="4px solid"
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight="bold" fontSize="xl" mt="10px">
        {userData?.name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        {userData?.job}
      </Text>
      <Flex w="max-content" mx="auto" mt="26px">
        <Flex mx="auto" me="60px" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
            {userData?.posts || 0}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Posts
          </Text>
        </Flex>
        <Flex mx="auto" me="60px" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
            {userData?.followers || 0}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Followers
          </Text>
        </Flex>
        <Flex mx="auto" align="center" direction="column">
          <Text color={textColorPrimary} fontSize="2xl" fontWeight="700">
            {userData?.following || 0}
          </Text>
          <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
            Following
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
}
