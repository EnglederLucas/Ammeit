import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import useKeylistener, {
  useWithModifiersKeylistener,
} from "../hooks/useKeylistener";
import {
  FaCog,
  FaHandPaper,
  FaMinus,
  FaPause,
  FaPlay,
  FaRegHandPaper,
  FaUpload,
} from "react-icons/fa";
import { BiFullscreen } from "react-icons/bi";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import FileInputButton from "./FileInputButton";

// var reader = new FileReader();
// reader.onload = function() {
//     var media = new Audio(reader.result);
//     media.onloadedmetadata = function(){
//          media.duration; // this would give duration of the video/audio file
//     };
// };
// reader.readAsDataURL(file);

type Config = {
  fileName: string;
  markers: number[];
}[];

type Video = {
  url: string;
  fileName: string;
  duration?: number;
  config?: { markers: number[] };
};

function VideoPlayer() {
  const [play, setPlay] = useState(false);
  const player = useRef<ReactPlayer | null>(null);
  const handle = useFullScreenHandle();

  const [videoControls, setVideoControls] = useState(false);

  const [videos, setVideos] = useState<Video[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMarkerIndex, setCurrentMarkerIndex] = useState(0);

  const [config, setConfig] = useState<Config | null>(null);

  const getCurrentMarker = () =>
    videos[currentIndex]?.config?.markers[currentMarkerIndex];

  useWithModifiersKeylistener({
    mainKey: "Space",
    mainEventHandler: (e) => {
      console.log("Space");
      e.preventDefault();
      setPlay((p) => !p);
    },
    modifierListeners: [
      {
        modifierKey: "ShiftLeft",
        eventHandler: () => {
          console.log("Damn Shift Space");
          setCurrentIndex((c) => c + 1);
          setCurrentMarkerIndex(0);
        },
      },
    ],
  });

  // useWithModifiersKeylistener({
  //   mainKey: "ArrowRight",
  //   mainEventHandler: () => {
  //     if (
  //       play &&
  //       currentMarkerIndex >=
  //         (videos[currentIndex]?.config?.markers?.length ?? -1)
  //     ) {
  //       setCurrentIndex((c) => c + 1);
  //       setCurrentMarkerIndex(0);
  //     } else if (play) {
  //       console.log("When Playing", getCurrentMarker());
  //       if (getCurrentMarker() !== undefined) {
  //         player?.current?.seekTo(getCurrentMarker() as number, "seconds");
  //         setTimeout(() => {
  //           setPlay(true);
  //           console.log("PLAY");
  //         }, 120);
  //       }
  //     } else if (!play) {
  //       setPlay(true);
  //     }
  //   },
  //   modifierListeners: [
  //     {
  //       modifierKey: "Ctrl",
  //       eventHandler: () => {
  //         setCurrentIndex((c) => c + 1);
  //         setCurrentMarkerIndex(0);
  //       },
  //     },
  //   ],
  // });

  useKeylistener("ArrowLeft", () => {
    if (currentMarkerIndex === 0) {
      setCurrentIndex((c) => c - 1);
      setCurrentMarkerIndex(0);
    } else {
      console.log(
        "Skip to",
        videos[currentIndex]?.config?.markers[currentMarkerIndex],

        videos[currentIndex]?.config?.markers[currentMarkerIndex - 2]
      );
      player.current?.seekTo(
        videos[currentIndex]?.config?.markers[currentMarkerIndex - 2] ?? 0
      );

      setCurrentMarkerIndex((m) => m - 1);

      // setPlay(true);
    }
  });

  useKeylistener("ArrowDown", () => {
    setCurrentIndex((c) => c + 1);
    setCurrentMarkerIndex(0);
  });

  useKeylistener("ArrowRight", () => {
    if (
      play &&
      currentMarkerIndex >=
        (videos[currentIndex]?.config?.markers?.length ?? -1)
    ) {
      setCurrentIndex((c) => c + 1);
      setCurrentMarkerIndex(0);
    } else if (play) {
      console.log("When Playing", getCurrentMarker());
      if (getCurrentMarker() !== undefined) {
        player?.current?.seekTo(getCurrentMarker() as number, "seconds");
        setTimeout(() => {
          setPlay(true);
          console.log("PLAY");
        }, 120);
      }
    } else if (!play) {
      setPlay(true);
    }
  });

  const controlByMarkers = (seconds: number) => {
    // if (!play) return;

    let markerIndex = videos[currentIndex]?.config?.markers.findIndex(
      (m) => m === Math.floor(seconds * 10) / 10
    );

    console.debug(
      "Paused at Position",
      seconds,
      markerIndex,
      videos[currentIndex]?.config?.markers[currentMarkerIndex],
      Math.floor(seconds * 10) / 10
    );

    if (
      videos[currentIndex]?.config?.markers[currentMarkerIndex] ===
      Math.floor(seconds * 10) / 10
    ) {
      setPlay(false);
      setCurrentMarkerIndex((m) => m + 1);
    }
  };

  const playLocalFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const fileArray = Array.from(fileList);

    const videos: Video[] = fileArray.map((file) => ({
      url: URL.createObjectURL(file),
      fileName: file.name,
    }));
    console.debug("Videos", videos);

    setCurrentIndex(0);
    setVideos(videos);
  };

  const readConfig = async (config: File | null): Promise<void> => {
    if (!config) return;

    console.debug("Config", config);

    let content: Config | null = null;

    try {
      content = JSON.parse(await config.text()) as Config;
    } catch {
      console.error("Error parsing config", await config.text());
      return;
    }

    setVideos((videos): Video[] =>
      videos.map(
        (v): Video => ({
          config: {
            markers:
              content?.find((c) => c.fileName === v.fileName)?.markers ?? [],
          },
          ...v,
        })
      )
    );

    setCurrentMarkerIndex(0);
    setCurrentIndex(0);
    setConfig(content);

    console.log(content);
    console.log("Videos", videos);
  };

  function changeDurationOfVideo(duration: number) {
    let copy = [...videos];
    copy[
      videos.findIndex((f) => f.fileName === videos[currentIndex].fileName)
    ].duration = duration;
    setVideos(copy);
  }

  return (
    <Flex
      className="container"
      justifySelf="center"
      flexDirection="column"
      style={{ width: "75%", height: "75%" }}
      mt="10"
    >
      <FullScreen handle={handle}>
        <ReactPlayer
          ref={player}
          progressInterval={60}
          height={handle.active ? "100vh" : "100%"}
          width={handle.active ? "100vw" : "100%"}
          controls={videoControls}
          style={{ backgroundColor: "#1A263A" }}
          playing={play}
          onDuration={(d) => changeDurationOfVideo(d)}
          onProgress={(s) =>
            controlByMarkers(s.played * (videos[currentIndex]?.duration ?? 0))
          }
          url={videos[currentIndex]?.url}
        ></ReactPlayer>
      </FullScreen>

      <Flex mt="10">
        <ColorModeSwitcher justifySelf="flex-start" />
        <IconButton
          justifySelf="start"
          ml={2}
          variant="ghost"
          color="current"
          icon={videoControls ? <FaHandPaper /> : <FaRegHandPaper />}
          aria-label="Toggle Video Controls"
          onClick={() => setVideoControls((v) => !v)}
          size="md"
        />
        <Flex className="controls" flex="1" justify="center">
          {!videoControls && (
            <>
              <IconButton
                mr={2}
                variant="ghost"
                colorScheme="blue"
                icon={play ? <FaPause /> : <FaPlay />}
                aria-label="Play and Pause"
                onClick={() => setPlay((playing) => !playing)}
                size="md"
              />
              <IconButton
                colorScheme="blue"
                variant="ghost"
                onClick={handle.enter}
                aria-label="Fullscreen"
                icon={<BiFullscreen />}
                size="md"
              />
            </>
          )}
        </Flex>
        <FileInputButton
          onChangeFiles={playLocalFiles}
          ml="2"
          leftIcon={<FaUpload />}
          justifySelf="flex-end"
          size="md"
          accept=".mp4"
          multiple
        >
          Upload Videos
        </FileInputButton>
        {!config ? (
          <FileInputButton
            onChangeFiles={(f) => readConfig(f ? f.item(0) : null)}
            ml="2"
            leftIcon={<FaCog />}
            justifySelf="flex-end"
            size="md"
            accept=".json"
            multiple
          >
            Upload Config
          </FileInputButton>
        ) : (
          <Button
            onClick={() => setConfig(null)}
            ml="2"
            leftIcon={<FaMinus />}
            justifySelf="flex-end"
            size="md"
          >
            Remove Config
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
export default VideoPlayer;
