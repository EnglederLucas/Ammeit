import * as React from "react";
import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import VideoPlayer from "./components/VideoPlayer";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <VideoPlayer></VideoPlayer>
      </Grid>
    </Box>
  </ChakraProvider>
);
