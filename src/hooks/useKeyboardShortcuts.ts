"use client";

import { useEffect } from "react";
import { useSelectionStore } from "@/store/selectionStore";
import { useSceneStore } from "@/store/sceneStore";
import { useEditorStore } from "@/store/editorStore";

/**
 * Global keyboard shortcuts for the editor.
 *
 * W  → Move (Translate)
 * E  → Rotate
 * R  → Scale
 * G  → Toggle grid
 * X  → Delete selected
 * F5 → Toggle play / stop
 * Ctrl+D / Cmd+D → Duplicate selected
 * Escape → Clear selection
 */
export function useKeyboardShortcuts() {
  const { setTransformMode, clearSelection } = useSelectionStore();
  const { selectedIds } = useSelectionStore();
  const { removeEntity, duplicateEntity } = useSceneStore();
  const { toggleGrid, togglePlay } = useEditorStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in an input / textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key.toLowerCase()) {
        case "w":
          setTransformMode("translate");
          break;
        case "e":
          setTransformMode("rotate");
          break;
        case "r":
          setTransformMode("scale");
          break;
        case "g":
          toggleGrid();
          break;
        case "f5":
          e.preventDefault();
          togglePlay();
          break;
        case "escape":
          clearSelection();
          break;
        case "delete":
        case "backspace":
          if (selectedIds.length > 0) {
            selectedIds.forEach((id) => removeEntity(id));
            clearSelection();
          }
          break;
        case "d":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            if (selectedIds.length === 1) {
              duplicateEntity(selectedIds[0]);
            }
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIds, setTransformMode, clearSelection, removeEntity, duplicateEntity, toggleGrid, togglePlay]);
}
