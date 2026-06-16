"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Stats } from "@react-three/drei";
import { Suspense } from "react";
import { SceneRoot } from "@/components/scene/SceneRoot";
import { useEditorStore } from "@/store/editorStore";
import { useDragDropAsset } from "@/hooks/useDragDropAsset";

export function Viewport() {
  const showGrid = useEditorStore((s) => s.showGrid);
  const showStats = useEditorStore((s) => s.showStats);
  const { onDrop, onDragOver } = useDragDropAsset();

  return (
    <div
      className="w-full h-full"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [6, 5, 8], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#0a0a0c"]} />
          <Environment preset="city" />
          {showGrid && (
            <Grid
              args={[40, 40]}
              cellColor="#3f3f46"
              sectionColor="#52525b"
              fadeDistance={50}
              infiniteGrid
              position={[0, 0, 0]}
            />
          )}
          <SceneRoot />
          <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
          {showStats && <Stats className="!absolute !left-2 !top-12" />}
        </Suspense>
      </Canvas>
    </div>
  );
}
