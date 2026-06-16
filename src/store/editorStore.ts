import { create } from "zustand";

export type ActiveCameraId = "free" | "judge" | "defense" | "witness" | "audience";

interface EditorState {
  activeCamera: ActiveCameraId;
  isPlaying: boolean; // simulation mode
  showGrid: boolean;
  showStats: boolean;
  activePanel: "hierarchy" | "assets" | "inspector" | "lighting";

  setActiveCamera: (cam: ActiveCameraId) => void;
  togglePlay: () => void;
  toggleGrid: () => void;
  toggleStats: () => void;
  setActivePanel: (panel: EditorState["activePanel"]) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeCamera: "free",
  isPlaying: false,
  showGrid: true,
  showStats: true,
  activePanel: "hierarchy",

  setActiveCamera: (cam) => set({ activeCamera: cam }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleStats: () => set((s) => ({ showStats: !s.showStats })),
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
