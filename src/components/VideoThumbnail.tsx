import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";

const VideoThumbnail = (props: { title?: string; videoUrl: string }): JSX.Element => {
	const [dataUrl, setDataUrl] = useState("");
	useEffect(() => {
		const video = document.createElement("video");
		video.setAttribute("id", props.videoUrl);
		const timeupdate = function () {
			if (snapImage()) {
				video.removeEventListener("timeupdate", timeupdate);
				video.pause();
			}
		};
		video.addEventListener("loadeddata", function () {
			if (snapImage()) {
				video.removeEventListener("timeupdate", timeupdate);
			}
		});
		const snapImage = function () {
			const canvas: any = document.createElement("canvas");
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			canvas.style.display = "none";
			try {
				canvas?.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
			} catch (err) {
				console.error("Drawing", err);
			}
			let image = "";
			try {
				image = canvas.toDataURL();
			} catch (err) {
				console.log(err);
			}
			const success = image.length > 50000;
			console.log("snapImage", success, image.length, props.title, props.videoUrl);
			if (success) {
				URL.revokeObjectURL(props.videoUrl);
				video.pause();
				video.removeAttribute("src"); // empty source
				video.load();
				video.remove();
				canvas.remove();
				setDataUrl(image);
			}
			return success;
		};
		video.addEventListener("timeupdate", timeupdate);
		video.preload = "metadata";
		video.style.display = "none";
		video.src = props.videoUrl;
		// Load video in Safari / IE11
		video.muted = true;

		video.addEventListener("loadedmetadata", function () {
			video.currentTime = video.duration - 1;
			video.play();
		});
		// video.playsInline = true;
	}, [props.videoUrl]);

	return (
		<>
			{dataUrl ? (
				<Image rounded="lg" src={dataUrl}></Image>
			) : (
				<Box
					border="2px solid"
					borderColor="gray.200"
					py={9}
					px={2}
					rounded="lg"
					textColor="gray.500"
					fontSize="0.9em"
				>
					{props.title}
				</Box>
			)}
		</>
	);
};

export default VideoThumbnail;
