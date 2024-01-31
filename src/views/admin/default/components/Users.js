import React, { useContext, useMemo, useState, useEffect } from "react";
import { TokenContext } from "contexts/TokenContext";
import { Flex, Table, Text, useColorModeValue } from "@chakra-ui/react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

export default function Users(props) {
  const { columnsData, tableData } = props;
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/users/userscount");
        const data = await response.json();
        const totalUsers = data.data;

        for (let i = 0; i <= totalUsers; i++) {
          setTimeout(() => {
            setCurrentCount(i);
          }, i * 50);
        }
      } catch (error) {
        console.error("Error al obtener el número de usuarios:", error);
      }
    };

    fetchUserCount();
  }, []);

  const { token } = useContext(TokenContext);
  console.log("token", token);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
   initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  
  return (
    <Card
      direction='column'
      w='100%'
      px='25px'
    >
      <Flex justify='space-between' align='center' mb='16px'>
        <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
        Total de usuarios
        </Text>
        <Text color={textColor} fontSize='18px' fontWeight='700' lineHeight='100%'>
          {currentCount}
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
      </Table>
    </Card>
  );
}
