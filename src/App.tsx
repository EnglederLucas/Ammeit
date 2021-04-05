import * as React from "react";
import { ChakraProvider, Box, Grid, theme } from "@chakra-ui/react";
import SlideView from "./SlideView/SlideView";

export const App = () => (
	<ChakraProvider theme={theme}>
		<Box textAlign="center" fontSize="xl">
			<Grid minH="100vh" p={3}>
				<SlideView></SlideView>
			</Grid>
		</Box>
	</ChakraProvider>
);
