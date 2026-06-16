"use client";

import { useMemo } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { useSelectionStore } from "@/store/selectionStore";
import { LightEntity } from "@/types/entities";

export function LightingPanel() {
  const entities = useSceneStore((s) => s.document.entities);
  const select = useSelectionStore((s) => s.select);
  const selectedIds = useSelectionStore((s) => s.selectedIds);

  const lights = useMemo(
    () => Object.values(entities).filter((e): e is LightEntity => e.type === "light"),
    [entities]
  );

  return (
    <div className="p-3 space-y-2">
      <h3 className="text-xs font-semibold text-zinc-400 uppercase">Lights in Scene</h3>
      {lights.length === 0 && <p className="text-xs text-zinc-500">No lights added yet.</p>}
      {lights.map((light) => (
        <div
          key={light.id}
          onClick={() => select(light.id)}
          className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs ${
            selectedIds.includes(light.id) ? "bg-amber-400/20 text-amber-300" : "bg-zinc-800 hover:bg-zinc-700"
          }`}
        >
          <span>{light.name}</span>
          <span className="text-zinc-500 capitalize">{light.lightType}</span>
        </div>
      ))}
    </div>
  );
}
