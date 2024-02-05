import { useColorMode } from "@chakra-ui/react";

const useDarkMode = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDarkMode = colorMode === "dark";

  return { isDarkMode, toggleColorMode };
};

export default useDarkMode;
