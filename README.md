# 🏛️ AI Courtroom Builder

> A browser-based 3D courtroom scene editor built for the **AI Courtroom LMS Platform**.  
> Drag, drop, and configure full courtroom environments — no Blender required.

Built with **Next.js 15 · React Three Fiber · Drei · Zustand · TailwindCSS · GSAP · Supabase**.

---

## 📸 What It Does

| Feature | Description |
|---|---|
| **3D Viewport** | Full-screen WebGL scene powered by React Three Fiber |
| **Drag & Drop** | Drag characters, props, lights, cameras from the Asset Browser into the scene |
| **Scene Hierarchy** | Tree view with rename, duplicate, delete, group, visibility toggle |
| **Inspector Panel** | Edit transform, material, character animation, light settings, camera FOV |
| **Transform Gizmo** | Move / Rotate / Scale with World / Local space + snap-to-grid |
| **Lighting Editor** | Add Ambient, Directional, Point, Spot, and HDRI lights |
| **Camera System** | Switch between Judge / Defense / Witness / Audience / Free cameras with GSAP transitions |
| **Character System** | Idle / Talking / Walking / Sitting / Pointing animations via GLB clips |
| **Evidence System** | Upload images, PDFs, videos, audio, and 3D models to Supabase Storage |
| **Save / Load** | Export scene as JSON or save/load to Supabase |
| **LOD System** | Automatic Level-of-Detail switching based on camera distance |
| **Audience Instancing** | InstancedMesh for 50+ crowd members at 60fps |
| **Keyboard Shortcuts** | W/E/R (transform modes), G (grid), X/Del (delete), Ctrl+D (duplicate), Esc (deselect) |

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── editor/page.tsx          # Editor route (/editor)
│   ├── layout.tsx               # Root layout
│   └── globals.css
├── components/
│   ├── editor/
│   │   ├── EditorLayout.tsx     # Main 3-panel editor shell
│   │   ├── Viewport.tsx         # R3F Canvas + drop zone
│   │   └── TopBar.tsx           # Toolbar: transform modes, camera, save/load
│   ├── panels/
│   │   ├── HierarchyPanel.tsx   # Scene tree with rename/duplicate/delete
│   │   ├── InspectorPanel.tsx   # Selected entity properties
│   │   ├── AssetBrowserPanel.tsx# Searchable, filterable asset library
│   │   └── LightingPanel.tsx    # Light list + quick select
│   ├── scene/
│   │   ├── SceneRoot.tsx        # Renders root-level entities
│   │   ├── SceneEntity.tsx      # Recursive entity renderer
│   │   ├── LightEntity.tsx      # Renders all light types
│   │   ├── LODModel.tsx         # GLB model with distance-based LOD
│   │   ├── CameraRig.tsx        # GSAP cinematic camera transitions
│   │   ├── GridFloor.tsx        # Floor plane + axes helper
│   │   ├── EvidenceScreen.tsx   # Renders image/video/pdf on courtroom screens
│   │   └── AudienceInstancer.tsx# InstancedMesh crowd renderer
│   ├── transform/
│   │   └── TransformGizmo.tsx   # drei TransformControls wrapper
│   └── characters/
│       ├── CharacterController.tsx  # GLB character with animation crossfade
│       └── animationMap.ts          # AnimationState → clip name mapping
├── store/
│   ├── sceneStore.ts            # Full scene document CRUD (Zustand)
│   ├── selectionStore.ts        # Selection, transform mode, snap
│   ├── editorStore.ts           # Camera, play mode, grid, panels
│   └── assetStore.ts            # Asset library + search/filter
├── types/
│   ├── entities.ts              # All entity types (Character, Light, Camera...)
│   ├── scene.ts                 # SceneDocument type + factory
│   └── materials.ts             # PBR material config
├── lib/
│   ├── assets/assetRegistry.ts  # Default asset library seed data
│   ├── save/
│   │   ├── serializer.ts        # Export JSON + Supabase save
│   │   └── loader.ts            # Load from JSON file
│   ├── supabase/client.ts       # Supabase client singleton
│   ├── perf/
│   │   ├── lod.ts               # LOD thresholds + perf config
│   │   └── loaders.ts           # GLTFLoader + Draco + KTX2 setup
│   └── future/
│       └── expansion-architecture.ts  # Documented extension points
└── hooks/
    ├── useDragDropAsset.ts      # Asset panel → viewport drop handler
    ├── useEvidenceUpload.ts     # File upload to Supabase Storage
    └── useKeyboardShortcuts.ts  # W/E/R/G/Del/Ctrl+D shortcuts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18+ or 20+
- **npm** 9+ (or pnpm / yarn)
- A [Supabase](https://supabase.com) project (free tier is fine)

---

### 1. Clone and Install

```bash
git clone https://github.com/lightyagami2599/Courtroom_Builder-.git
cd ai-courtroom-builder
npm install
```

---

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these in your Supabase dashboard under:  
**Project Settings → API → Project URL + anon/public key**

---

### 3. Set Up Supabase Database

In your Supabase dashboard, go to **SQL Editor** and run the contents of:

```
supabase/schema.sql
```

This creates:
- `courtroom_scenes` table (with RLS policies)
- `courtroom-evidence` storage bucket (public read, authenticated write)

---

### 4. Add GLB Assets

The editor expects GLB model files in `/public/assets/models/`.  
Create the folder structure and add your own models, or use free ones from [Sketchfab](https://sketchfab.com) / [Poly Haven](https://polyhaven.com):

```
public/
└── assets/
    ├── models/
    │   ├── characters/
    │   │   ├── judge.glb
    │   │   ├── prosecutor.glb
    │   │   ├── defense.glb
    │   │   ├── witness.glb
    │   │   ├── police.glb
    │   │   └── audience.glb
    │   ├── props/
    │   │   ├── bench.glb
    │   │   └── table.glb
    │   └── tech/
    │       ├── evidence_screen.glb
    │       ├── monitor.glb
    │       ├── microphone.glb
    │       └── camera.glb
    └── thumbnails/
        └── (optional PNG thumbnails for the asset browser)
```

> **Tip:** For rapid prototyping without real models, the Asset Browser still shows all assets as labelled tiles you can drag in. Entities without a valid GLB will simply not render a mesh in the viewport (no crash).

---

### 5. (Optional) Add Draco + KTX2 Decoders

For compressed GLB files, copy the decoder binaries:

```bash
# Draco
cp -r node_modules/three/examples/jsm/libs/draco/ public/decoders/draco/

# Basis / KTX2
cp -r node_modules/three/examples/jsm/libs/basis/ public/decoders/basis/
```

---

### 6. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000/editor](http://localhost:3000/editor) in your browser.

---

## 🏗️ Building for Production

```bash
npm run build
npm start
```

Or deploy to **Vercel** (recommended — zero config with Next.js):

```bash
npx vercel
```

Set the same environment variables in the Vercel project dashboard.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `W` | Move (Translate) |
| `E` | Rotate |
| `R` | Scale |
| `G` | Toggle grid |
| `Delete` / `Backspace` | Delete selected entity |
| `Ctrl+D` / `Cmd+D` | Duplicate selected entity |
| `Escape` | Deselect all |
| `F5` | Toggle Play / Stop simulation mode |

---

## 🖱️ Editor Controls

### Viewport Navigation (in Free Camera mode)
| Action | Control |
|---|---|
| Orbit | Left-click + drag |
| Pan | Right-click + drag |
| Zoom | Scroll wheel |
| Focus | Click an entity in the hierarchy |

### Transform Gizmo
- **Click** an entity in the viewport or hierarchy to select it
- **Shift+Click** to multi-select
- **Double-click** a hierarchy item to rename it
- Hover a hierarchy row to reveal visibility 👁, lock 🔒, duplicate ⧉, delete ✕ buttons

---

## 🧩 Adding Custom Assets

Edit `src/lib/assets/assetRegistry.ts` to register your own GLBs:

```typescript
{
  id: "prop-podium",
  name: "Podium",
  category: "furniture",
  thumbnailUrl: "/assets/thumbnails/podium.png",
  modelUrl: "/assets/models/props/podium.glb",
  tags: ["furniture", "podium", "speaker"],
}
```

For LOD variants, add medium/low URLs:
```typescript
lod: {
  medium: "/assets/models/props/podium_medium.glb",
  low:    "/assets/models/props/podium_low.glb",
}
```

---

## 💾 Scene JSON Format

Every scene is stored as a plain JSON document. Example:

```json
{
  "version": "1.0.0",
  "id": "abc123",
  "name": "Opening Trial Scene",
  "entities": {
    "xyz789": {
      "id": "xyz789",
      "name": "Judge",
      "type": "character",
      "parentId": null,
      "transform": {
        "position": { "x": 0, "y": 0, "z": -5 },
        "rotation": { "x": 0, "y": 180, "z": 0 },
        "scale":    { "x": 1, "y": 1,   "z": 1 }
      },
      "visible": true,
      "locked": false,
      "role": "judge",
      "assetUrl": "/assets/models/characters/judge.glb",
      "animationState": "idle",
      "aiBinding": { "provider": null }
    }
  },
  "rootIds": ["xyz789"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔮 Future Phases (Architecture Ready)

All extension points are documented in `src/lib/future/expansion-architecture.ts`.

| Phase | Feature | Notes |
|---|---|---|
| Phase 10 | **AI Scene Generation** | Claude API → SceneDocument JSON |
| Phase 11 | **Voice Control** | Vapi AI transcript → store actions |
| Phase 12 | **Multiplayer** | Supabase Realtime entity-level patches |
| Phase 13 | **MetaHuman** | ARKit morph targets for lip-sync + emotion |
| Phase 14 | **Unreal Export** | SceneDocument → USD/Datasmith manifest |
| Phase 15 | **Blender Export** | SceneDocument → bpy Python script |

To add AI character voice via **Vapi**:
```typescript
vapiClient.on("speech-start", () =>
  updateEntity(judgeId, { animationState: "talking" })
);
vapiClient.on("speech-end", () =>
  updateEntity(judgeId, { animationState: "idle" })
);
```

---

## 🛠️ Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 15 | App framework + routing |
| React Three Fiber | 8 | React renderer for Three.js |
| Drei | 9 | R3F helpers (TransformControls, useGLTF, etc.) |
| Three.js | 0.169 | 3D engine |
| Zustand | 5 | State management (scene, selection, editor) |
| GSAP | 3 | Cinematic camera transitions |
| Framer Motion | 11 | UI panel animations |
| Rapier (R3F) | 1 | Physics (ready for simulation phase) |
| Supabase | 2 | Database + Storage |
| TailwindCSS | 3 | Styling |
| TypeScript | 5 | Type safety |

---

## 🐛 Troubleshooting

**Canvas is blank / black**  
→ Make sure you have at least one light in the scene (drag one from Assets → Lights), or the `<Environment preset="city">` provides ambient IBL by default.

**GLB models not loading**  
→ Verify the file path in `assetRegistry.ts` matches the file location under `/public/`. Next.js serves `/public` at the root `/`.

**Supabase save fails**  
→ Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`. Run the SQL schema (`supabase/schema.sql`) if you haven't already.

**TransformControls not responding**  
→ This happens when OrbitControls and TransformControls conflict. The gizmo attaches on selection — click directly on an entity mesh first, then drag the gizmo.

**`reactStrictMode: false` in next.config.js — why?**  
→ React Strict Mode double-invokes effects, which causes issues with Three.js scene traversal and animation mixer subscriptions. This is a known R3F recommendation.

---

## 📄 License

MIT — use freely in your LMS platform and commercial projects.

---

## 🙌 Credits

- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) — Poimandres collective
- [Drei](https://github.com/pmndrs/drei) — Poimandres collective  
- [Three.js](https://threejs.org) — Mr.doob and contributors
- [Zustand](https://github.com/pmndrs/zustand) — Poimandres collective
