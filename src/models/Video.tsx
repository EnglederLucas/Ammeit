import { IContent } from "./contracts/Other";
import React, { ReactElement } from "react";

import { Image } from "@chakra-ui/react";
import VideoThumbnail from "../components/VideoThumbnail";
export default class Video implements IContent {
	constructor(private videoUrl: string, private fileName?: string) {}

	getThumbnail(): JSX.Element {
		console.log("Get Thumbnail");

		return (
			<VideoThumbnail title={this.fileName} videoUrl={this.videoUrl}></VideoThumbnail>
		);
		// return React.createElement(VideoThumbnail, { videoUrl: this.videoUrl });
		// return (
		// 	<i>
		// 		<VideoThumbnail videoUrl={this.videoUrl} />
		// 	</img>
		// );
	}
}
