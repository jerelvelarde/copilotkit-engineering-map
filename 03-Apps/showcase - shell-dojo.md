---
title: showcase - shell-dojo
type: app
layer: frontend
source:
  - showcase/shell-dojo/
  - showcase/shell-dojo/src/app/page.tsx
  - showcase/shell-dojo/src/components/code-block.tsx
tags: [copilotkit, showcase, app, nextjs, dojo, layer/frontend, type/app]
---
# showcase - shell-dojo

The **interactive demo browser** ("CopilotKit Interactive Dojo", `@copilotkit/showcase-shell-dojo`, private, **port 3001**). A Next.js 15 / React 19 app that lets you flip every demo between a **live preview** and its **source code**, grouped by feature category, with a hand-curated "Featured" row. It does **not** host its own CopilotKit runtime — it renders previews (which point at integration backends) and code from generated bundles.

## What it does (verified from `src/app/page.tsx`)

- Single client page with a `ViewMode = "preview" | "code"` toggle per demo.
- Demos grouped by feature category via `getFeatureCategories()` / `getFeature()` from the generated registry (`src/lib/registry.ts`).
- A hard-coded **`FEATURED_DEMO_IDS`** editorial list (e.g. `beautiful-chat`, `agentic-chat`, `chat-customization-css`, `headless-simple`, `gen-ui-tool-based`, `declarative-gen-ui`, `mcp-apps`, `open-gen-ui`, `frontend-tools`) rendered as a synthetic "Featured" category — kept in the shell so the editorial pick can evolve independently of `feature-registry.json`.
- **Code tab** reads `src/data/demo-content.json` (per-demo `files`, `backend_files`, `readme`, and optional `regions` for line-range snippets), syntax-highlighted by `src/components/code-block.tsx` (`react-syntax-highlighter` + `highlight.js`).
- `recharts` and `zod` are dependencies (used by inlined demo previews / chart rendering).

## Data inputs

`predev`/`build` run `generate-registry.ts` + `bundle-demo-content.ts` from [[showcase - scripts]] → `registry.json` + `demo-content.json` in `src/data/`. No search index, no starter content (dojo only needs registry + demo source).

## Notable

- `agent-notes/` holds design-iteration screenshots (`v0-before-skill.png` → `v-final-handcrafted.png`, plus a `reference-dojo.png`) — provenance for the dojo's visual design, not runtime assets.
- Layout (`src/app/layout.tsx`) loads Plus Jakarta Sans + Spline Sans Mono from Google Fonts directly.

## Build / deploy

- **Bundler:** Next.js with Turbopack in dev (`next dev --turbopack --port 3001`); `next.config.ts` is empty (defaults).
- **Docker:** `shell-dojo/Dockerfile` (node:20-slim). Copies `shared/`, `integrations/`, `scripts/`, `shell-dojo/`; regenerates registry + demo content; `next build`; `next start -p 10000`.
- Deployed to Railway from `main`.

## Related

- Previews iframe / link to [[showcase integration]] backends.
- Consumes registry + demo bundles from [[showcase - scripts]] (over [[showcase - shared]]).
- Sibling shells: [[showcase - shell]], [[showcase - shell-docs]], [[showcase - shell-dashboard]].
- [[Apps MOC]]
