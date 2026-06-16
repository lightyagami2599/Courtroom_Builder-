"use client";

import { Viewport } from "./Viewport";
import { TopBar } from "./TopBar";
import { HierarchyPanel } from "@/components/panels/HierarchyPanel";
import { InspectorPanel } from "@/components/panels/InspectorPanel";
import { AssetBrowserPanel } from "@/components/panels/AssetBrowserPanel";
import { LightingPanel } from "@/components/panels/LightingPanel";
import { useEditorStore } from "@/store/editorStore";

export function EditorLayout() {
  const activePanel = useEditorStore((s) => s.activePanel);

  return (
    <div className="flex h-screen w-screen flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Hierarchy + Assets */}
        <aside className="w-72 flex flex-col border-r border-zinc-800 bg-zinc-900">
          <div className="flex border-b border-zinc-800 text-xs">
            <PanelTab id="hierarchy" label="Hierarchy" />
            <PanelTab id="assets" label="Assets" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {activePanel === "hierarchy" && <HierarchyPanel />}
            {activePanel === "assets" && <AssetBrowserPanel />}
          </div>
        </aside>

        {/* Center: Viewport */}
        <main className="flex-1 relative">
          <Viewport />
        </main>

        {/* Right: Inspector + Lighting */}
        <aside className="w-80 flex flex-col border-l border-zinc-800 bg-zinc-900">
          <div className="flex border-b border-zinc-800 text-xs">
            <PanelTab id="inspector" label="Inspector" />
            <PanelTab id="lighting" label="Lighting" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {activePanel === "inspector" && <InspectorPanel />}
            {activePanel === "lighting" && <LightingPanel />}
          </div>
        </aside>
      </div>
    </div>
  );
}

function PanelTab({ id, label }: { id: "hierarchy" | "assets" | "inspector" | "lighting"; label: string }) {
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const isActive = activePanel === id;

  return (
    <button
      onClick={() => setActivePanel(id)}
      className={`flex-1 py-2 px-3 transition-colors ${
        isActive
          ? "bg-zinc-800 text-amber-400 border-b-2 border-amber-400"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}
