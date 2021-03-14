import { useEffect, useState } from "react";

function useKeylistener(
  key: { mainKey: string; extraKey?: string } | string,
  eventHandler: (e: KeyboardEvent) => void
): void {
  const [firstKeyPressed, setFirstKeyPressed] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log("New Event: ", e.code, "key", key);
      if (typeof key === "string") {
        if (key === e.code) eventHandler(e);

        return;
      }

      if (e.code === key.mainKey && !key.extraKey) {
        eventHandler(e);
        return;
      }

      if (e.code === key.extraKey && firstKeyPressed) {
        e.preventDefault();
        eventHandler(e);

        setFirstKeyPressed(false);
      } else if (e.code === key.mainKey) {
        setFirstKeyPressed(true);
      } else {
        setFirstKeyPressed(false);
      }
    };

    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  }, [key, eventHandler, firstKeyPressed]);
}
export default useKeylistener;

type ModifierListener = {
  modifierKey: string;
  eventHandler: (e: KeyboardEvent) => void;
};

type ModifierKeymap = {
  mainKey: string;
  mainEventHandler: (e: KeyboardEvent) => void;
  modifierListeners: ModifierListener[];
};

export const useWithModifiersKeylistener = (keymaps: ModifierKeymap) => {
  const [modifierKey, setModifierKey] = useState<ModifierListener | null>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === keymaps.mainKey && !modifierKey) {
        keymaps.mainEventHandler(e);
        return;
      }

      const modifier = keymaps.modifierListeners.find(
        (m) => m.modifierKey === e.code
      );

      setModifierKey(modifier);
    };

    document.addEventListener("keyup", handler);

    return () => document.removeEventListener("keyup", handler);
  }, [modifierKey, listeners]);
};
