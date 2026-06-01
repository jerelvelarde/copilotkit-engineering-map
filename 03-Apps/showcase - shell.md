---
title: showcase - shell
type: app
layer: frontend
source:
  - showcase/shell/
  - showcase/shell/src/app/api/copilotkit/[[...slug]]/route.ts
  - showcase/shell/src/components/home-chat.tsx
tags: [copilotkit, showcase, app, nextjs, copilotkitnext, layer/frontend, type/app]
---
# showcase - shell

The **hub gallery** app of the [[Apps MOC|Showcase Platform]] — a Next.js 15 / React 19 app (`@copilotkit/showcase-shell`, private, port 10000 in Docker). It is the **canonical entry surface**: home page, integration explorer, the feature × framework `/matrix`, and the per-demo canonical routes `/integrations/[slug]/[demo]/{preview,code}`.

It is the **only showcase shell that actually runs CopilotKit.**

## CopilotKit usage (verified from source)

This app consumes the externally-published `@copilotkitnext/*` packages via the **`next` dist-tag**, not this repo's `packages/`. See [[@copilotkit vs @copilotkitnext]]. `package.json` dependencies:

```json
"@copilotkit/react-core": "next",
"@copilotkitnext/agent":   "next",
"@copilotkitnext/react":   "next",
"@copilotkitnext/runtime": "next"
```

**Backend route** — `src/app/api/copilotkit/[[...slug]]/route.ts` mounts a v2-style runtime served through Hono on Vercel:

```ts
import { CopilotRuntime, createCopilotEndpoint, InMemoryAgentRunner } from "@copilotkitnext/runtime";
import { BuiltInAgent } from "@copilotkitnext/agent";
import { handle } from "hono/vercel";

const agent = new BuiltInAgent({ model: "openai/gpt-4o", prompt: "...Showcase assistant...", maxSteps: 3 });
const runtime = new CopilotRuntime({
  // @ts-ignore — BuiltInAgent type mismatch with AbstractAgent, pending upstream fix
  agents: { default: agent },
  runner: new InMemoryAgentRunner(),
});
const app = createCopilotEndpoint({ runtime, basePath: "/api/copilotkit" });
export const GET = handle(app);
export const POST = handle(app);
```

This is the same shape as the repo's own [[runtime - CopilotRuntime (v2)]] / [[runtime - createCopilotRuntimeHandler]] / [[runtime - InMemoryAgentRunner]] / [[runtime - BuiltInAgent]] — but resolved from the `@copilotkitnext` npm scope. The agent is a single `gpt-4o` [[runtime - BuiltInAgent]] (Vercel-AI-SDK-powered, `maxSteps: 3`) whose system prompt is the in-app "Showcase assistant" that points users at integrations and features.

**Frontend** — `src/components/home-chat.tsx` is a client component:

```tsx
import { CopilotKitProvider, CopilotChat, useConfigureSuggestions } from "@copilotkitnext/react";
// <CopilotKitProvider runtimeUrl="/api/copilotkit"> wraps <CopilotChat />
// useConfigureSuggestions(...) seeds 5 always-available starter prompts.
```

So the shell exercises the v2 React surface: [[react-core - CopilotKitProvider|CopilotKitProvider]], [[react-core - CopilotChat (v2)|CopilotChat]], and a suggestions hook ([[Suggestions]]). (`@copilotkit/react-core` is also pinned at `next` but the chat UI imports come from `@copilotkitnext/react`.)

## Routes & structure

```
src/app/
  page.tsx                                  # home (hero, guided flow, framework grid)
  layout.tsx                                # BrandNav + FrameworkProvider
  api/copilotkit/[[...slug]]/route.ts       # CopilotKit runtime (above)
  integrations/page.tsx                     # explorer
  integrations/by-feature/page.tsx          # feature-first browse
  integrations/[slug]/page.tsx              # integration profile
  integrations/[slug]/[demo]/page.tsx       # demo landing
  integrations/[slug]/[demo]/preview/page.tsx  # live preview (iframes the backend)
  integrations/[slug]/[demo]/code/page.tsx     # source viewer (from demo-content.json)
  matrix/page.tsx                           # feature × framework matrix
  middleware.ts                             # seo-redirects
```

Key components: `brand-nav`, `framework-provider` (URL-derived "active framework" + advisory localStorage pick), `guided-flow`, `home-chat` (CopilotKit), `integration-explorer`, `feature-catalog`, `search-modal` (Cmd-K over `search-index.json`), `demo-drawer`.

## Data inputs (build-time)

`npm run build`/`dev` runs four generators from [[showcase - scripts]] before `next`:
`generate-registry.ts` → `registry.json` + `constraints.json`; `bundle-demo-content.ts` → `demo-content.json`; `bundle-starter-content.ts` → `starter-content.json`; `generate-search-index.ts` → `search-index.json`. All land in `src/data/` (gitignored). Source of truth is [[showcase - shared]] + each integration's `manifest.yaml`.

## Build / deploy

- **Bundler:** Next.js (`next build`). No Nx target — this app lives outside the Nx package graph and installs its deps standalone (`npm install` in `scripts/` then `shell/`).
- **Docker:** `shell/Dockerfile` (node:20-slim, multi-stage). Copies `shared/`, `integrations/`, `scripts/`, `shell/`, and `shell-docs/src/content/`, regenerates data, `next build`, runs `next start -p 10000`.
- Deployed to Railway from `main`.

## Related

- Hub for every [[showcase integration]] backend; preview tabs iframe those services.
- Sibling apps: [[showcase - shell-dojo]], [[showcase - shell-docs]], [[showcase - shell-dashboard]].
- [[Apps MOC]] · [[@copilotkit vs @copilotkitnext]] · [[runtime - BuiltInAgent]] · [[AgentRunner]]
