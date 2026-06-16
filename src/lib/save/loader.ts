import { SceneDocument } from "@/types/scene";

export function loadSceneFromFile(
  file: File,
  onLoad: (doc: SceneDocument) => void
) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result as string;
      const doc = JSON.parse(text) as SceneDocument;

      // Basic validation
      if (!doc.entities || !doc.rootIds) {
        throw new Error("Invalid scene file: missing required fields");
      }

      onLoad(doc);
    } catch (err) {
      console.error("Failed to load scene:", err);
      alert("Invalid scene file.");
    }
  };
  reader.readAsText(file);
}
