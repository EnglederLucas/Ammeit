/* eslint-disable react/jsx-no-undef */
import { Box, Container, Flex, Grid, Image } from "@chakra-ui/react";
import React from "react";
import { ISlideHead } from "../models/contracts/ISlide";
// import "./SideView.scss";

type SideViewProps = {
	slides: ISlideHead[];
	width?: string;
	style?: React.CSSProperties;
};

const SideView = ({ slides, width = "20%", ...props }: SideViewProps): JSX.Element => {
	console.log(slides);

	return (
		<Box
			height="100%"
			overflowX="auto"
			justifyContent="flex-start"
			p={1}
			m={1.5}
			gap="1"
			column={1}
			style={{ ...props.style, width, direction: "rtl" }}
		>
			{slides.map((s: ISlideHead) => (
				<Box
					//         borderWidth="2px"
					//borderStyle="solid"
					//borderColor={"gray.100"}
					//p={3}
					rounded="lg"
					mb={2}
					ml={2}
					key={s.title + s.order}
				>
					{s.getThumbnail()}
				</Box>
			))}
		</Box>
	);
};

export default SideView;
