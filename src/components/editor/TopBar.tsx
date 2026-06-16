"use client";

import { useSelectionStore } from "@/store/selectionStore";
import { useSceneStore } from "@/store/sceneStore";
import { useEditorStore } from "@/store/editorStore";
import { saveSceneToSupabase, exportSceneAsJSON } from "@/lib/save/serializer";
import { loadSceneFromFile } from "@/lib/save/loader";

export function TopBar() {
  const { transformMode, setTransformMode, transformSpace, setTransformSpace, snapEnabled, toggleSnap } =
    useSelectionStore();
  const document = useSceneStore((s) => s.document);
  const loadDocument = useSceneStore((s) => s.loadDocument);
  const { isPlaying, togglePlay, activeCamera, setActiveCamera } = useEditorStore();

  return (
    <header className="flex items-center justify-between h-12 px-3 border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-amber-400">AI Courtroom Builder</span>

        <div className="flex items-center gap-1 ml-4">
          {(["translate", "rotate", "scale"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTransformMode(mode)}
              className={`text-xs px-2 py-1 rounded ${
                transformMode === mode ? "bg-amber-400 text-zinc-900" : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {mode === "translate" ? "Move (W)" : mode === "rotate" ? "Rotate (E)" : "Scale (R)"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTransformSpace(transformSpace === "world" ? "local" : "world")}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 ml-2"
        >
          Space: {transformSpace}
        </button>

        <button
          onClick={toggleSnap}
          className={`text-xs px-2 py-1 rounded ml-2 ${
            snapEnabled ? "bg-amber-400 text-zinc-900" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          Snap: {snapEnabled ? "On" : "Off"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={activeCamera}
          onChange={(e) => setActiveCamera(e.target.value as any)}
          className="text-xs bg-zinc-800 rounded px-2 py-1"
        >
          {["free", "judge", "defense", "witness", "audience"].map((cam) => (
            <option key={cam} value={cam}>
              {cam.charAt(0).toUpperCase() + cam.slice(1)} Camera
            </option>
          ))}
        </select>

        <button
          onClick={togglePlay}
          className={`text-xs px-3 py-1 rounded ${
            isPlaying ? "bg-red-500 text-white" : "bg-green-500 text-zinc-900"
          }`}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>

        <button onClick={() => exportSceneAsJSON(document)} className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">
          Export JSON
        </button>
        <button onClick={() => saveSceneToSupabase(document)} className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700">
          Save
        </button>
        <label className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 cursor-pointer">
          Load
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) loadSceneFromFile(file, loadDocument);
            }}
          />
        </label>
      </div>
    </header>
  );
}
