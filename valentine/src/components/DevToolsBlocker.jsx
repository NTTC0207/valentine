import { useEffect } from "react";

const DevToolsBlocker = ({ enabled }) => {
  useEffect(() => {
    if (!enabled) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return;
      }

      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Chrome/FireFox dev tools)
      // Cmd+Option+I, Cmd+Option+J, Cmd+Option+C (Mac)
      if (
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.metaKey &&
          e.altKey &&
          (e.key === "i" || e.key === "j" || e.key === "c"))
      ) {
        e.preventDefault();
        return;
      }

      // Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return;
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  return null;
};

export default DevToolsBlocker;
