import { Button, ButtonProps } from "@chakra-ui/react";
import React, { useRef } from "react";

type FileInputButtonProps = {
  //text: string;
  children: JSX.Element | string;
  accept: string;
  multiple?: boolean;
  onChangeFiles: (files: FileList | null) => void;
};

function FileInputButton(props: FileInputButtonProps & ButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        onClick={() => inputRef.current?.click()}
        {...(props as ButtonProps)}
      >
        {props.children}
      </Button>
      <input
        onChange={(e) => props.onChangeFiles(e.target.files)}
        type="file"
        multiple={props.multiple ?? false}
        name="videos"
        accept={props.accept}
        ref={inputRef}
        style={{ display: "none" }}
      ></input>
    </>
  );
}
export default FileInputButton;
