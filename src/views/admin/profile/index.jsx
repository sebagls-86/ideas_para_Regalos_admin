// Chakra imports
import { Box, Grid } from "@chakra-ui/react";

// Custom components
import Profile from "views/admin/profile/components/Profile";

// Assets
import banner from "assets/img/auth/banner.png";
import avatar from "assets/img/avatars/avatar4.png";
import React from "react";

export default function Overview() {
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
       <Profile
        gridArea='1 / 1 / 2 / 4'
        banner={banner}
        avatar={avatar}
        name='Adela Parkson'
        job='Product Designer'
        posts='17'
        followers='9.7k'
        following='274'
      />
      
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "1.34fr 1fr 1.62fr",
        }}
        templateRows={{
          base: "repeat(3, 1fr)",
          lg: "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}>
      </Grid>
    </Box>
  );
}
