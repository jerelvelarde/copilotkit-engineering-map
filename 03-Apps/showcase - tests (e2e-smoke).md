---
title: showcase - tests (e2e-smoke)
type: app
layer: tooling
source:
  - showcase/tests/
  - showcase/tests/e2e/integration-smoke.spec.ts
  - showcase/tests/e2e/starter-smoke.spec.ts
tags: [copilotkit, showcase, tests, playwright, e2e, smoke, layer/tooling, type/app]
---
# showcase - tests (e2e-smoke)

Cross-fleet **Playwright smoke suite** (`@showcase/e2e-smoke`, private). Exercises the full path **Railway backend → [[AG-UI Protocol]] → CopilotKit runtime → frontend response** for every deployed [[showcase integration]] and for the Docker-built starter templates. No CopilotKit code of its own — it drives the deployed apps as a black box.

## Test levels (tags)

`tests/e2e/integration-smoke.spec.ts` runs four ascending levels, selectable with `--grep`:

1. **`@health`** — backend health endpoint returns 200 (API-only, fast).
2. **`@agent`** — agent endpoint reachable (explicitly asserts **not 404**, the signature of a wrong agent type, e.g. `LangGraphAgent` vs `HttpAgent`).
3. **`@chat`** — round-trip chat: send a message, get an assistant response.
4. **`@tools`** — tool rendering: trigger a tool, verify the UI result (only for integrations whose registry features include `tool-rendering`).

Helpers in `tests/e2e/helpers.ts`: `checkHealth`, `checkAgentEndpoint`, `sendChatMessage`, `setupConsoleErrorCollector`.

## How targets are derived (verified)

The spec imports the **generated** registry, not a hardcoded list:

```ts
import registry from "../../shell/src/data/registry.json"; // from generate-registry.ts
import localPorts from "../../shared/local-ports.json";
```

- By default only `deployed` integrations run; `SMOKE_ALL=true` runs all.
- `LOCAL_PORTS=1` rewrites each integration's Railway `backend_url` to `http://localhost:<port>` using `shared/local-ports.json`, so the same suite runs against `docker-compose.local.yml` instead of Railway. (Starters are skipped under `LOCAL_PORTS` — they aren't in `local-ports.json`.)

Because it imports `registry.json`, the generator must have run first (`npm run build` in [[showcase - shell]] or [[showcase - scripts]] directly).

## Starter smoke

`tests/e2e/starter-smoke.spec.ts` targets a running starter container at `STARTER_URL` (default `localhost:3000`), selected by the `STARTER` env var (default `langgraph-python`). All starters share one CopilotKit UI shell, so interaction selectors are universal and only the agent backend differs. Levels: `@health`, `@agent`, `@chat`, `@interaction`. Default agent path is `/api/copilotkit`.

## aimock sidecar for CI

`tests/docker-compose.integrations.yml` boots `ghcr.io/copilotkit/aimock:latest` with `../aimock/feature-parity.json` mounted at `/fixtures/default.json` (`--validate-on-load`, port 4010), so per-package Playwright runs get deterministic LLM responses. See [[showcase - aimock fixtures]].

## Config / scripts

- `playwright.config.ts` — 120s timeout, fully parallel, 2 workers in CI, GitHub reporter in CI; trace + screenshot on failure.
- npm scripts: `test` (all), `test:health|agent|chat|tools` (`--grep` filters), `test:starter`, `smoke:local*` (wrap `../scripts/smoke-local.sh` with level/keep/no-build flags).
- Single dependency: `@playwright/test`.

## Related

- The [[showcase - harness]] e2e probe drivers reuse these same flows.
- Reads `registry.json` from [[showcase - scripts]] / [[showcase - shell]]; uses fixtures from [[showcase - aimock fixtures]].
- [[AG-UI Protocol]] · [[Apps MOC]]
