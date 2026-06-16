"use client";

import { useEditorStore } from "@/store/editorStore";

/**
 * GridFloor renders a subtle floor plane + reference axes.
 * Toggle via editor showGrid state (G key or TopBar).
 */
export function GridFloor() {
  const showGrid = useEditorStore((s) => s.showGrid);

  if (!showGrid) return null;

  return (
    <group>
      {/* Floor reference plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#18181b" roughness={1} metalness={0} />
      </mesh>
      {/* World axes helper */}
      <axesHelper args={[2]} />
    </group>
  );
}
