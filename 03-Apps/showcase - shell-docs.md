---
title: showcase - shell-docs
type: app
layer: docs
source:
  - showcase/shell-docs/
  - showcase/shell-docs/next.config.ts
  - showcase/shell-docs/src/content/
tags: [copilotkit, showcase, app, docs, fumadocs, nextjs, layer/docs, type/app]
---
# showcase - shell-docs

The **documentation site** that ships from this repo (`@copilotkit/showcase-shell-docs`, private, **port 3003**). A **Next.js 16** app built on **Fumadocs** (`fumadocs-core` / `fumadocs-ui`) rendering MDX content. It does **not** run a CopilotKit runtime — it is content + framework-aware navigation. (The docs *content* describes CopilotKit; the app itself is a static-ish docs frontend.)

> This is the same content tree analyzed from the docs angle in [[Docs-Site MOC]]. This note covers it as a **deployed showcase app**; the `06-Docs-Site` area covers the docs authoring/structure.

## Content (`src/content/`)

MDX collections under `src/content/`:

- `docs/` — main product docs (concepts, backend, generative-ui, human-in-the-loop, integrations, multi-agent, prebuilt-components, reference, shared-state, migrate, deploy, troubleshooting, tutorials, whats-new, premium, agent-spec, agentic-protocols, deepagents…).
- `ag-ui/` — the [[AG-UI Protocol]] docs (concepts, quickstart, sdk, tutorials, development, drafts).
- `reference/` — components / hooks / sdk / v1 reference.
- `snippets/` — reusable MDX fragments (cloud, coagents, integrations, shared).
- `framework-overviews/` — per-framework landing content (ag2, agent-spec, ms-agent-dotnet, …).

Per-framework data lives in `src/data/frameworks/*.ts` (langgraph-python, mastra, crewai-crews, google-adk, agno, llamaindex, pydantic-ai, strands, ms-agent-dotnet, a2a, agent-spec, deepagents).

## Routing & special endpoints

`src/app/`:

- `[[...slug]]/` and `[framework]/[[...slug]]/` — catch-all doc pages, with a **framework-scoped** variant (`/<framework>/...`) driven by `framework-provider.tsx` + `sidebar-framework-selector.tsx`.
- `ag-ui/[[...slug]]/` — AG-UI doc tree.
- `reference/[...slug]/` and `reference/page.tsx` — API reference.
- `og/[...slug]/route.tsx` — dynamic Open Graph images (Vercel `maxDuration: 60`, see `vercel.json`).
- `llms.txt/route.ts`, `llms-full.txt/route.ts`, `llms-mdx/[[...slug]]/route.ts` — LLM-consumable doc exports.
- `robots.ts`, `sitemap.ts`.

MDX is wired through `src/lib/mdx-registry.tsx` / `mdx-registry-loader.tsx`, `docs-render.tsx`, `rehype-code-meta.ts`, and a rich `mdx-components.tsx` (Snippet, DemoSource, framework tabs, property reference, etc.). Analytics: PostHog, GA4, Scarf, Reb2b (all `NEXT_PUBLIC_*`, baked at build via `--build-arg`).

## Generated data

`predev`/`build` run `generate-registry.ts`, `bundle-demo-content.ts`, and `generate-search-index.ts` → `registry.json`, `demo-content.json`, `search-index.json` (Cmd-K search). See [[showcase - scripts]].

## Docs sync

`.docs-sync-sha` pins the upstream docs commit this tree was synced from (`scripts/sync-docs-from-main.ts` performs the sync). Lint is **oxlint** (`oxlint .`); tests are Vitest (`src/lib/__tests__/`).

## Build / deploy

- **Bundler:** Next.js 16 (`next build`, port 3003).
- **Docker:** `shell-docs/Dockerfile` (node:20-slim). `NEXT_PUBLIC_BASE_URL` required at build; analytics keys passed as build args.
- Deployed via Railway/Vercel (`vercel.json` present for OG function duration).

## Related

- [[Docs-Site MOC]] (same content tree, docs-authoring view).
- Sibling shells: [[showcase - shell]], [[showcase - shell-dojo]], [[showcase - shell-dashboard]].
- [[AG-UI Protocol]] · [[Apps MOC]]
