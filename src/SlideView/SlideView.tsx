import React, { useEffect, useState } from "react";
import VideoPlayer, { VideoFile } from "../components/VideoPlayer";
import { ISlideHead } from "../models/contracts/ISlide";
import SideView from "../SideView/SideView";
import Video from "../models/Video";
import { Slide } from "../models/Slide";
import { updateVariableDeclarationList } from "typescript";

const SlideView = () => {
	const [slides, setSlides] = useState<ISlideHead[]>([]);
	const updateVideos = (videos: VideoFile[]) => {
		videos.map((v, i) =>
			setSlides((cSlides) => [
				...cSlides,
				new Slide<Video>(v.fileName, i, new Video(v.url, v.fileName)),
			]),
		);
	};

	return (
		<div
			style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}
		>
			<SideView
				slides={slides}
				style={{ width: "30%", height: "95vh", minWidth: "250px", maxWidth: "350px" }}
			></SideView>
			<VideoPlayer addVideos={updateVideos}></VideoPlayer>{" "}
		</div>
	);
};

export default SlideView;
