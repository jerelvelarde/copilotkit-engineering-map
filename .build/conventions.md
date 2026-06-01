# CopilotKit KB — Build Contract (READ FULLY BEFORE WRITING)

You are one agent in a parallel fleet building an **Obsidian knowledge base** that maps the CopilotKit monorepo at file/symbol depth. This file is the **single source of truth** for format and scope. Follow it exactly so every agent's output is consistent and interlinks cleanly.

## Paths

- **Repo root (read-only source):** `<your local CopilotKit checkout (main)>`
- **Vault root (write notes here):** `<this vault>`
- You will be told **which folder you own**. Write ONLY inside your assigned folder. Never write outside it. Never edit the repo.

## Hard rules

1. **Read the actual source.** These notes must be accurate to code, not to docs (the repo's own docs are stale). For every symbol note, open the real file(s) and base the note on what the code does. Put the repo-relative source path(s) in frontmatter `source:`.
2. **One concept per note.** Atomic notes. A package overview, each subsystem, and each *key* class/function/hook/component get their own note.
3. **Globally-unique note titles** (Obsidian links resolve by title). Conventions:
   - Package overview note title = the package name, e.g. `@copilotkit/core`, `@copilotkit/runtime`. The filename = a clean slug, e.g. `core.md`, `runtime.md` (title in frontmatter + H1 carries the scope).
   - Subsystem / symbol notes are **prefixed with the package slug** to stay unique: `core - StateManager`, `runtime - Service Adapters`, `react-core - useFrontendTool`. Use ` - ` as the separator.
   - Concept notes use plain names: `AG-UI Protocol`, `AgentRunner`, `Request Lifecycle`.
   - If two packages export the same-named symbol (e.g. `useAgent` in react-core and vue), the package prefix disambiguates them.
4. **Link densely with `[[wikilinks]]`** using the exact target title:
   - Every symbol note links **up** to its subsystem note and its package overview.
   - Every package overview links to **every** subsystem/symbol note in its folder, and to the packages it depends on (e.g. `@copilotkit/react-core` links `[[@copilotkit/core]]`).
   - Every note links to the **concepts** it implements/uses (e.g. a runner note links `[[AgentRunner]]`, `[[AG-UI Protocol]]`).
   - Do not invent links to notes that won't exist; only link titles defined in this contract's inventory or obvious package names.
5. **Each folder gets a MOC.** For a package folder, the package overview note IS the MOC (it must link all notes in the folder). For the area folders (01-Architecture, 03-Apps, 04-Examples, 05-SDK-Python, 06-Docs-Site, 07-Build-CI-Release) create a `<Area> MOC.md` note that links every note in the folder.

## Frontmatter (every note)

```yaml
---
title: <exact unique title>
type: package | subsystem | symbol | concept | app | example | workflow | moc
layer: frontend | runtime | agent | shared | tooling | docs | meta
package: "@copilotkit/<x>"        # omit if not package-scoped
source:                            # repo-relative path(s); omit for pure concept notes
  - packages/<x>/src/...
tags: [copilotkit, <area>, <more>]
---
```

After frontmatter: an H1 matching the title, then the body.

## Note body shapes

**Package overview (`type: package`, doubles as folder MOC):**
- One-line role. Published name + version + scope note (see corrections).
- **Entry points / exports** (from package.json `exports`/`main`/`module` + index re-exports).
- **Subsystems** — bullet list, each linking its subsystem note.
- **Key symbols** — list linking symbol notes.
- **Depends on / depended on by** — links to other package overviews.
- **Build/test** — bundler + test framework.
- A Mermaid diagram if it clarifies internal structure.

**Subsystem (`type: subsystem`):** what it does, the files it spans, the key symbols inside (link them), how it fits the package. 

**Symbol (`type: symbol`):** signature/shape, responsibility, key methods/props, collaborators (link), where used. Keep precise and short; include a small code/signature block.

**Concept (`type: concept`):** the idea, how CopilotKit implements it (link the implementing packages/symbols), a Mermaid diagram where useful.

## Mermaid

Use fenced ```mermaid blocks. Good uses: flowcharts for architecture/dependencies, sequence diagrams for request/event flow, stateDiagram for the AG-UI event lifecycle. Keep them readable.

## Templates

**Symbol note example:**
```md
---
title: core - CopilotKitCore
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/core.ts
tags: [copilotkit, core, orchestrator]
---
# core - CopilotKitCore

The central frontend orchestrator. Wrapped by every framework binding ([[@copilotkit/react-core]], [[@copilotkitnext/angular]], [[@copilotkit/vue]]).

**Responsibilities:** agent registry, tool registry, context store, suggestions, run handling, state, thread stores — delegated to [[core - AgentRegistry]], [[core - ContextStore]], [[core - SuggestionEngine]], [[core - RunHandler]], [[core - StateManager]], [[core - ThreadStoreRegistry]].

**Config:** `runtimeUrl`, `runtimeTransport` ("rest"|"single"|"auto"), `tools`, `headers`, `debug` ([[DebugConfig]]) …

Implements the [[Tools (Frontend & Backend)]] registry and emits events consumed via subscribers.
```

---

# GLOBAL CORRECTIONS (authoritative — overrides any doc/comment)

- **20 packages** under `packages/`. Most are `@copilotkit/*` at **v1.57.4**. Exceptions: `angular` publishes as **`@copilotkitnext/angular`** at **v1.54.3** (independent release track); `typescript-config` is `@copilotkit/typescript-config` (v1.55.0-next.8); `tsconfig`/`tailwind-config` are private unscoped.
- **There is NO `packages/agent`.** The **BuiltInAgent** (Vercel AI SDK powered) lives in **`packages/runtime/src/agent/index.ts`**.
- **`packages/runtime` is dual-architecture:**
  - **V1 (legacy):** Type-GraphQL schema + resolvers (`src/graphql/`), and 9 LLM **service-adapters** (`src/service-adapters/`: openai, openai-assistant, anthropic, google-genai, groq, langchain, bedrock, unify, experimental/ollama; + empty). Framework integrations in `src/lib/integrations/` (nextjs app/pages router, node-express, node-http, nest).
  - **V2 (current):** `src/v2/` — `CopilotRuntime` (`v2/runtime/core/runtime.ts`), `createCopilotRuntimeHandler` (fetch), routing/CORS/middleware, **AgentRunner** abstraction + `InMemoryAgentRunner` (`v2/runtime/runner/`), endpoints (express, express-single, hono, hono-single, node), handlers (run/connect/stop/threads/transcribe/debug-events/get-runtime-info), Intelligence-platform client. Exports: `.`, `./langgraph`, `./v2`, `./v2/express`, `./v2/hono`, `./v2/node`.
- **`@copilotkitnext/{react,agent,runtime}` are EXTERNALLY-published npm packages** (legacy/pre-consolidation publish scope) consumed by `showcase/shell` via the **`next` dist-tag** — they are NOT built from this repo's `packages/`. Only `@copilotkitnext/angular` is local. (Historical "why" is inferred; state it as such, don't assert.)
- **External (not in this repo) but referenced:** `@copilotkit/license-verifier`, `@copilotkit/aimock` (mock-LLM test package; `showcase/aimock/` is a *fixtures data dir*, not the package), the `@ag-ui/*` family (client, core, encoder, langgraph, a2ui-middleware, mcp-apps-middleware, mastra), and `@a2ui/web_core`.
- **react-core / vue have a V1 + V2 split internally** (`src/` legacy + `src/v2/` modern; `src/v2/headless.ts` is the RN-safe subset). react-ui is V1-only UI.
- **Toolchain:** Nx 22.5, pnpm 10.33.4, TS 5.2, vitest, **tsdown** bundler (most), **vite** (vue), **ng-packagr** (angular), oxlint/oxfmt (Rust), lefthook + commitlint, 37 GitHub workflows, two release tracks (monorepo `v*` + angular `angular/v*`) via npm OIDC.
- **`voice`** only implements OpenAI Whisper transcription (no TTS in code, despite the description). State what exists.
- Two TS-config packages (`typescript-config` and `tsconfig`) coexist; document both, note the apparent redundancy, don't guess which is canonical.

---

# COVERAGE INVENTORY (the notes to create, by folder)

Titles below are the required note titles. Package-folder notes use the package slug prefix; the package overview note title is the scoped package name. Create **every** listed note; add extra symbol notes where the code clearly warrants it. Read source to fill them.

## 01-Architecture/  (concepts — layer: meta/frontend/runtime as fits)
`Concepts MOC` · `Three-Layer Architecture` · `AG-UI Protocol` · `Request Lifecycle` · `ProxiedAgent` · `AgentRunner` · `Tools (Frontend & Backend)` · `Context` · `Multi-Agent` · `Middleware` · `Intelligence Platform vs SSE` · `A2UI (Generative UI)` · `Suggestions` · `Threads` · `Debug Mode` · `Telemetry & Licensing` · `DebugConfig` · `@copilotkit vs @copilotkitnext`

## 02-Packages/shared/  (package: @copilotkit/shared, layer: shared)
overview `@copilotkit/shared` · `shared - Types` · `shared - Message Types` · `shared - Parameter & Action Types` · `shared - Telemetry` · `shared - DebugConfig & resolveDebugConfig` · `shared - standard-schema (schemaToJsonSchema)` · `shared - Attachments`

## 02-Packages/core/  (package: @copilotkit/core, layer: frontend)
overview `@copilotkit/core` · `core - CopilotKitCore` · `core - AgentRegistry` · `core - ContextStore` · `core - SuggestionEngine` · `core - RunHandler` · `core - StateManager` · `core - ThreadStoreRegistry` · `core - ProxiedCopilotRuntimeAgent` · `core - IntelligenceAgent` · `core - threads` · `core - micro-redux` · `core - phoenix-observable` · `core - FrontendTool types` · `core - Suggestion types`

## 02-Packages/runtime/  (package: @copilotkit/runtime, layer: runtime) — SPLIT across 2 agents by note set
Set A (overview + V2): overview `@copilotkit/runtime` · `runtime - CopilotRuntime (v2)` · `runtime - createCopilotRuntimeHandler` · `runtime - Routing & CORS` · `runtime - Middleware (v2)` · `runtime - AgentRunner (base)` · `runtime - InMemoryAgentRunner` · `runtime - Endpoints (Express/Hono/Node)` · `runtime - Handlers (run/connect/stop)` · `runtime - Thread Handlers` · `runtime - Transcribe Handler` · `runtime - Intelligence Platform Client` · `runtime - SSE Streaming` · `runtime - Hooks & Debug Event Bus`
Set B (V1 + adapters + agent): `runtime - BuiltInAgent` · `runtime - AI SDK Converters` · `runtime - Service Adapter (interface)` · `runtime - OpenAI Adapter` · `runtime - OpenAI Assistant Adapter` · `runtime - Anthropic Adapter` · `runtime - Google GenAI Adapter` · `runtime - Groq Adapter` · `runtime - LangChain Adapter` · `runtime - Bedrock Adapter` · `runtime - Unify Adapter` · `runtime - Ollama Adapter (experimental)` · `runtime - GraphQL Layer (v1)` · `runtime - LangGraphAgent (v1)` · `runtime - Framework Integrations (v1)` · `runtime - Logging (Pino)`

## 02-Packages/runtime-client-gql/  (package: @copilotkit/runtime-client-gql, layer: frontend)
overview `@copilotkit/runtime-client-gql` · `runtime-client-gql - CopilotRuntimeClient` · `runtime-client-gql - GraphQL Operations` · `runtime-client-gql - aguiToGQL` · `runtime-client-gql - gqlToAGUI` · `runtime-client-gql - Generated Types` · `runtime-client-gql - LangGraphInterruptEvent`

## 02-Packages/react-core/  (package: @copilotkit/react-core, layer: frontend) — SPLIT across 2 agents
Set A (provider + V2 hooks): overview `@copilotkit/react-core` · `react-core - CopilotKitProvider` · `react-core - CopilotKitCoreReact` · `react-core - useAgent` · `react-core - useFrontendTool` · `react-core - useAgentContext` · `react-core - useHumanInTheLoop` · `react-core - useInterrupt` · `react-core - useSuggestions` · `react-core - useThreads` · `react-core - useRenderTool` · `react-core - useComponent` · `react-core - useCapabilities` · `react-core - useAttachments` · `react-core - headless export (RN)`
Set B (V2 components + V1 layer): `react-core - CopilotChat (v2)` · `react-core - Chat Subcomponents (v2)` · `react-core - CopilotSidebar/Popup (v2)` · `react-core - A2UI renderers` · `react-core - OpenGenerativeUI/MCP renderers` · `react-core - V1 hooks (useCopilotAction/useCoAgent/…)` · `react-core - V1 contexts` · `react-core - useCopilotChat (v1)` · `react-core - useCopilotReadable (v1)` · `react-core - useLangGraphInterrupt (v1)`

## 02-Packages/react-ui/  (package: @copilotkit/react-ui, layer: frontend)
overview `@copilotkit/react-ui` · `react-ui - CopilotChat` · `react-ui - CopilotPopup` · `react-ui - CopilotSidebar` · `react-ui - CopilotModal` · `react-ui - Messages` · `react-ui - Input & Textarea` · `react-ui - Suggestions` · `react-ui - Markdown & CodeBlock` · `react-ui - Attachments` · `react-ui - dev-console` · `react-ui - hooks (useDarkMode/usePushToTalk)`

## 02-Packages/react-textarea/  (package: @copilotkit/react-textarea, layer: frontend)
overview `@copilotkit/react-textarea` · `react-textarea - CopilotTextarea` · `react-textarea - BaseCopilotTextarea` · `react-textarea - Slate editor (useCopilotTextareaEditor)` · `react-textarea - useAutosuggestions` · `react-textarea - Autosuggestions config types` · `react-textarea - Insertion engine` · `react-textarea - HoveringToolbar` · `react-textarea - SourceSearchBox` · `react-textarea - slatejs-edits`

## 02-Packages/react-native/  (package: @copilotkit/react-native, layer: frontend)
overview `@copilotkit/react-native` · `react-native - CopilotKitProvider` · `react-native - CopilotChat/Sidebar/Popup/Modal` · `react-native - useAttachments` · `react-native - Polyfills` · `react-native - streaming-fetch` · `react-native - headless re-exports`

## 02-Packages/angular/  (package: @copilotkitnext/angular, layer: frontend)
overview `@copilotkitnext/angular` · `angular - CopilotKit service` · `angular - CopilotKitConfig (DI)` · `angular - AgentStore & CopilotkitAgentFactory` · `angular - Tools & ToolRenderer` · `angular - HumanInTheLoop` · `angular - render-tool-calls` · `angular - Chat components` · `angular - Directives (agent-context/stick-to-bottom/tooltip)` · `angular - Slots` · `angular - Signal architecture (note)`

## 02-Packages/vue/  (package: @copilotkit/vue, layer: frontend)
overview `@copilotkit/vue` · `vue - CopilotKitCoreVue` · `vue - CopilotKitProvider` · `vue - Providers & injection keys` · `vue - useAgent` · `vue - useFrontendTool` · `vue - useAgentContext` · `vue - composables (suggestions/interrupt/threads/…)` · `vue - Chat components` · `vue - A2UI (VueSurface/adapter/catalog)` · `vue - Message renderers` · `vue - V1 compat layer`

## 02-Packages/a2ui-renderer/  (package: @copilotkit/a2ui-renderer, layer: frontend)
overview `@copilotkit/a2ui-renderer` · `a2ui-renderer - A2UIProvider & A2UIRenderer` · `a2ui-renderer - Zustand store` · `a2ui-renderer - createReactComponent adapter` · `a2ui-renderer - A2uiSurface (deferred children)` · `a2ui-renderer - createCatalog` · `a2ui-renderer - basicCatalog` · `a2ui-renderer - minimalCatalog` · `a2ui-renderer - Catalog components` · `a2ui-renderer - a2ui-types`

## 02-Packages/voice/  (package: @copilotkit/voice, layer: runtime)
overview `@copilotkit/voice` · `voice - TranscriptionServiceOpenAI`

## 02-Packages/web-inspector/  (package: @copilotkit/web-inspector, layer: frontend)
overview `@copilotkit/web-inspector` · `web-inspector - cpk-web-inspector (Lit)` · `web-inspector - cpk-thread-list` · `web-inspector - cpk-thread-details` · `web-inspector - context-helpers` · `web-inspector - persistence` · `web-inspector - telemetry` · `web-inspector - event color/types`

## 02-Packages/sdk-js/  (package: @copilotkit/sdk-js, layer: agent)
overview `@copilotkit/sdk-js` · `sdk-js - langgraph utils (copilotkitCustomizeConfig/Emit*)` · `sdk-js - createCopilotkitMiddleware` · `sdk-js - zodState` · `sdk-js - CopilotKit state annotations` · `sdk-js - convertActionsToDynamicStructuredTools` · `sdk-js - copilotKitInterrupt` · `sdk-js - header-propagation`

## 02-Packages/sqlite-runner/  (package: @copilotkit/sqlite-runner, layer: runtime)
overview `@copilotkit/sqlite-runner` · `sqlite-runner - SqliteAgentRunner` · `sqlite-runner - schema & run-chaining`

## 02-Packages/agentcore-runner/  (package: @copilotkit/agentcore-runner, layer: runtime)
overview `@copilotkit/agentcore-runner` · `agentcore-runner - AgentCoreRunner`

## 02-Packages/demo-agents/  (package: @copilotkit/demo-agents, layer: agent)
overview `@copilotkit/demo-agents` · `demo-agents - OpenAIAgent` · `demo-agents - SlowToolCallStreamingAgent`

## 02-Packages/config-packages/  (layer: tooling)
`Config Packages MOC` · `typescript-config` · `tsconfig (legacy presets)` · `tailwind-config`

## 03-Apps/  (showcase, layer: tooling/frontend) — SPLIT: apps vs integrations
`Apps MOC` · `showcase - shell` · `showcase - shell-dashboard` · `showcase - shell-docs` · `showcase - shell-dojo` · `showcase - harness` · `showcase - scripts` · `showcase - tests (e2e-smoke)` · `showcase - eval-webhook` · `showcase - aimock fixtures` · `showcase - shared` · then one note per integration framework under `showcase/integrations/` (e.g. `showcase integration - langgraph-python`, `… mastra`, `… crewai-crews`, `… google-adk`, etc. — enumerate all present).

## 04-Examples/  (layer: docs/frontend)
`Examples MOC` · category notes `Examples - canvas`, `Examples - integrations`, `Examples - showcases`, `Examples - v1 legacy`, `Examples - v2 starters`, `Examples - e2e` · then one concise note per example dir (group small ones; the 47 examples live under examples/{canvas,integrations,showcases,v1,v2,e2e}). Each example note: framework, what it demonstrates, which CopilotKit packages it uses.

## 05-SDK-Python/  (package: copilotkit (python), layer: agent)
`SDK-Python MOC` · `sdk-python - overview` · `sdk-python - CopilotKitRemoteEndpoint & SDK` · `sdk-python - protocol (RuntimeEvent types)` · `sdk-python - runloop` · `sdk-python - langgraph integration` · `sdk-python - LangGraphAGUIAgent` · `sdk-python - CopilotKitMiddleware` · `sdk-python - CopilotKitState` · `sdk-python - crewai integration` · `sdk-python - a2ui helpers` · `sdk-python - Action/Agent/Parameter` · `sdk-python - header_propagation` · `sdk-python - fastapi integration` · `sdk-python - types & exceptions`

## 06-Docs-Site/  (layer: docs)
`Docs-Site MOC` · `docs - Fumadocs setup` · `docs - content collections (root/learn/integrations/reference)` · `docs - navigation (meta.json)` · `docs - snippets` · `docs - build & deploy` · `dev-docs - architecture guides`

## 07-Build-CI-Release/  (layer: tooling)
`Build-CI-Release MOC` · `Nx configuration` · `pnpm workspace` · `Root scripts & toolchain` · `lefthook (git hooks)` · `commitlint` · `changesets & release.config` · `Release pipeline (prepare/publish/prerelease)` · `npm OIDC publishing` · `CI workflows - testing` · `CI workflows - static & security` · `CI workflows - showcase` · `CI workflows - release & dependabot` · `codemods (migrate-attachments)` · `scripts (release/qa/doc-tests/hooks)` · `community (Hacktoberfest demos)` · `assets`

---

When done, return a compact report: the folder you owned, the list of note titles you created, any items you could not verify from source, and any links you emitted to titles you believe another agent owns.
