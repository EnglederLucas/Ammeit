import { useEffect } from "react";

type Listener = {
  key: string;
  eventHandler: (e: KeyboardEvent) => void;
};

const useKeylistener = (
  key: string,
  eventHandler: (e: KeyboardEvent) => void
) => {
  useEffect(() => {
    console.log("Adding Hadnler");
    const handler = (e: KeyboardEvent) => {
      if (e.code === key) {
        eventHandler(e);
      }
    };

    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  }, [key, eventHandler]);
};

export default useKeylistener;

export const useMultipleKeylisteners = (listeners: Listener[]) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      let affectedListeners = listeners.filter((l) => l.key === e.code);
      affectedListeners.forEach((l) => l.eventHandler(e));
    };

    document.addEventListener("keyup", handler);

    return () => document.removeEventListener("keyup", handler);
  }, [listeners]);
};
