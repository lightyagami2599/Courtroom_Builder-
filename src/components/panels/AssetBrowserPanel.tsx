"use client";

import { useEffect, useMemo } from "react";
import { useAssetStore, AssetCategory } from "@/store/assetStore";
import { DEFAULT_ASSET_LIBRARY } from "@/lib/assets/assetRegistry";

const CATEGORIES: { id: AssetCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "characters", label: "Characters" },
  { id: "furniture", label: "Furniture" },
  { id: "tech", label: "Tech" },
  { id: "lights", label: "Lights" },
  { id: "cameras", label: "Cameras" },
  { id: "evidence", label: "Evidence" },
];

export function AssetBrowserPanel() {
  const { library, searchQuery, activeCategory, setSearchQuery, setActiveCategory, registerAssets } =
    useAssetStore();

  useEffect(() => {
    if (library.length === 0) registerAssets(DEFAULT_ASSET_LIBRARY);
  }, [library.length, registerAssets]);

  const filtered = useMemo(() => {
    return library.filter((a) => {
      const matchesCategory = activeCategory === "all" || a.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [library, activeCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-zinc-800">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search assets..."
          className="w-full bg-zinc-800 text-sm rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-amber-400"
        />
        <div className="flex flex-wrap gap-1 mt-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`text-xs px-2 py-1 rounded ${
                activeCategory === c.id
                  ? "bg-amber-400 text-zinc-900"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2 overflow-y-auto">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("application/x-asset-id", asset.id);
              e.dataTransfer.effectAllowed = "copy";
            }}
            className="flex flex-col items-center gap-1 p-2 rounded bg-zinc-800 hover:bg-zinc-700 cursor-grab active:cursor-grabbing transition-colors"
          >
            <div className="w-full aspect-square bg-zinc-700 rounded flex items-center justify-center text-zinc-400 text-[10px] overflow-hidden">
              {/* Replace with <img src={asset.thumbnailUrl} /> when assets ready */}
              {asset.name}
            </div>
            <span className="text-[11px] text-zinc-300 truncate w-full text-center">
              {asset.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
