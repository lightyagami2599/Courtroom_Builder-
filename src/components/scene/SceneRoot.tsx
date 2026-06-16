"use client";

import { useMemo } from "react";
import { useSceneStore } from "@/store/sceneStore";
import { SceneEntity } from "./SceneEntity";

export function SceneRoot() {
  const entities = useSceneStore((s) => s.document.entities);
  const rootIds = useSceneStore((s) => s.document.rootIds);

  const visibleRoots = useMemo(
    () => rootIds.filter((id) => entities[id]?.visible),
    [rootIds, entities]
  );

  return (
    <group name="Scene">
      {visibleRoots.map((id) => (
        <SceneEntity key={id} entityId={id} />
      ))}
    </group>
  );
}
