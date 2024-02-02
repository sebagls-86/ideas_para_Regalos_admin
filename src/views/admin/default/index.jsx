// Chakra imports
import MiniCalendar from "components/calendar/MiniCalendar";
import React from "react";
import Users from "views/admin/default/components/Users";
import Forums from "views/admin/default/components/Forums";
import { columnsDataCheck } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import { Box, SimpleGrid } from "@chakra-ui/react";

export default function UserReports() {
  return (
    <Box pt={{ base: "130px", md: "100px", xl: "100px" }}>
      <SimpleGrid columns={2} spacing={3}>
        <Box height="100%">
          <Users columnsData={columnsDataCheck} tableData={tableDataCheck} />
        </Box>
        <Box height="100%">
          <Forums columnsData={columnsDataCheck} tableData={tableDataCheck}/>
        </Box>
        <Box height="100%">
          <MiniCalendar h="100%" minW="100%" selectRange={false} />
        </Box>
        <Box height="100%">
          {/* Contenido del espacio en blanco */}
        </Box>
      </SimpleGrid>
    </Box>
  );
}
