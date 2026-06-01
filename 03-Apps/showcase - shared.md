---
title: showcase - shared
type: app
layer: tooling
source:
  - showcase/shared/
  - showcase/shared/feature-registry.json
  - showcase/shared/starter-template/
tags: [copilotkit, showcase, shared, registry, starter-template, tools, layer/tooling, type/app]
---
# showcase - shared

The **canonical shared assets** for the showcase platform (`showcase/shared/`). It holds the source-of-truth data files that [[showcase - scripts]] turns into per-shell JSON, the shared agent **tool implementations** (TypeScript + Python) every integration reuses, and the **starter template** that all "Get Started" downloads/starters are extracted from. Not an app itself — a content/data package staged into other build contexts.

## Canonical data (source of truth)

- **`feature-registry.json`** — the canonical features + categories that define the grid rows in [[showcase - shell]] / [[showcase - shell-dashboard]] / [[showcase - shell-dojo]].
- **`constraints.yaml`** — allow/deny tables for the Showcase Decision Tree: `generative_ui` (allowlist per strategy, e.g. `constrained-declarative`, `constrained-explicit`) and `interaction_modalities` (denylist, e.g. `headless` excludes `voice`). Controls which demos a package may expose.
- **`local-ports.json`** — deterministic host port per integration for local Docker runs (3100–3117; consumed by `docker-compose.local.yml` and `LOCAL_PORTS=1` in [[showcase - tests (e2e-smoke)]]).
- **`packages.json`** — the canonical 18-integration slug→name list (`ag2`, `agno`, `built-in-agent`, `claude-sdk-python`, `claude-sdk-typescript`, `crewai-crews`, `google-adk`, `langgraph-fastapi`, `langgraph-python`, `langgraph-typescript`, `langroid`, `llamaindex`, `mastra`, `ms-agent-dotnet`, `ms-agent-python`, `pydantic-ai`, `spring-ai`, `strands`).
- **`manifest.schema.json`** — JSON Schema each integration's `manifest.yaml` is validated against by `generate-registry.ts`.

CI stages this directory into every package/shell build context (the shell/docs/dojo Dockerfiles `COPY showcase/shared/`).

## Shared agent tools

Pure, framework-free tool implementations reused by integration backends so the same demo behaves identically across frameworks.

- **`typescript/tools/`** (`index.ts` barrel) — `getWeatherImpl`, `queryDataImpl`, `manageSalesTodosImpl`/`getSalesTodosImpl` (+`INITIAL_SALES_TODOS`), `searchFlightsImpl`, `scheduleMeetingImpl`, `generateA2uiImpl`/`buildA2uiOperationsFromToolCall` (+`RENDER_A2UI_TOOL_SCHEMA`, `CUSTOM_CATALOG_ID`) and shared types. Consumed by `langgraph-typescript`, `mastra`, `claude-sdk-typescript`, etc. Vitest-tested (`__tests__/`).
- **`python/tools/`** (`__init__.py` barrel) — the Python parity: `get_weather_impl`, `query_data_impl`, `manage_sales_todos_impl`/`get_sales_todos_impl` (+`INITIAL_TODOS`), `search_flights_impl`, `generate_a2ui_impl`/`build_a2ui_operations_from_tool_call` (+`RENDER_A2UI_TOOL_SCHEMA`), `schedule_meeting_impl`. `python/middleware/render_mode.py` is a LangGraph `@wrap_model_call` middleware (`apply_render_mode`) that switches GenUI strategy (`tool-based`/`a2ui`/`json-render`/`hashbrown`) from CopilotKit context. Pytest suite (`python/tests/`) includes cross-language parity tests.

These TS/Python pairs are deliberately kept in sync (see `test_cross_language_parity.py`) so the [[A2UI (Generative UI)]] / [[Tools (Frontend & Backend)]] demos match across the fleet.

## Starter template (`starter-template/`)

The fork-and-extend Next.js app that `extract-starter.ts` / `bundle-starter-content.ts` turn into per-framework starters. **This template uses the repo's own published `@copilotkit/*` packages** (not `@copilotkitnext`, unlike [[showcase - shell]]):

- `app/api/copilotkit/route.ts` — `CopilotRuntime` + `LangGraphAgent` (`@copilotkit/runtime` + `@copilotkit/runtime/langgraph`) with `ExperimentalEmptyAdapter` via `copilotRuntimeNextJSAppRouterEndpoint`; registers many named agents (`agentic_chat`, `human_in_the_loop`, `tool-rendering`, `gen-ui-*`, `shared-state-*`, `subagents`, …) all pointing at `AGENT_URL`. Also exposes a `GET` health probe. See [[runtime - LangGraphAgent (v1)]], [[runtime - Framework Integrations (v1)]], [[runtime - Service Adapter (interface)]].
- `app/page.tsx` — client app using `CopilotKit` (`@copilotkit/react-core`) + `CopilotSidebar` (`@copilotkit/react-core/v2`), a `SalesDashboard`, and a `RendererSelector` that swaps tool-based / A2UI / hashbrown / json-render rendering. See [[react-core - CopilotKitProvider]], [[react-core - CopilotSidebar/Popup (v2)]].
- `app/api/health/route.ts`, `copilotkit-overrides.css`, charts/renderers/sales-dashboard components, and `hooks/use-showcase-{hooks,suggestions}.tsx`.
- `app/layout.tsx` imports `@copilotkit/react-core/v2/styles.css`.

> So within the showcase, **two CopilotKit surfaces coexist**: the hub [[showcase - shell]] runs `@copilotkitnext/*` (the `next` dist-tag), while the **starter template + integration backends** run the repo's own `@copilotkit/*`. See [[@copilotkit vs @copilotkitnext]].

## Related

- Generators that read this dir: [[showcase - scripts]]. Consumers of the generated output: [[showcase - shell]], [[showcase - shell-docs]], [[showcase - shell-dojo]], [[showcase - shell-dashboard]].
- Tool parity underpins every [[showcase integration]] backend.
- [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]] · [[Apps MOC]]
