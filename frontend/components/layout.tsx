import React from 'react';
import {Box, Container} from "@mui/material";
import ResponsiveAppBar from "./responsiveAppBar";

// @ts-ignore
export default function Layout({children}) {
  return (
    <Box>
      <main>
        <ResponsiveAppBar/>
        <Container>
          <main>{children}</main>
        </Container>
      </main>
    </Box>
  );
}
