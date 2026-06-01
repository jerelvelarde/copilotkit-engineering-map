---
title: showcase - aimock fixtures
type: app
layer: tooling
source:
  - showcase/aimock/
  - showcase/aimock/README.md
  - showcase/aimock/Dockerfile
tags: [copilotkit, showcase, testing, aimock, fixtures, llm-mock, layer/tooling, type/app]
---
# showcase - aimock fixtures

A **fixtures data directory** — *not* a package or a server. `showcase/aimock/` holds the deterministic LLM response fixtures consumed by the external **`@copilotkit/aimock`** mock-LLM server during showcase E2E. (Per the [[@copilotkit vs @copilotkitnext|build corrections]], `@copilotkit/aimock` is published from a separate repo, not this monorepo's `packages/`.)

> **What aimock is:** a general-purpose LLM mock server that speaks the OpenAI / Anthropic / Gemini REST shapes (incl. SSE streaming), loads fixtures from disk at boot, and matches incoming chat completions against fixture `match` criteria. The showcase deployment runs it in **proxy mode** (`--proxy-only`) so unmatched prompts fall through to the real provider and only fixture-matched prompts short-circuit deterministically. Railway pulls `ghcr.io/copilotkit/aimock:latest` directly and loads these fixtures via GitHub raw URLs at boot.

## Fixture files

- **`feature-parity.json`** — 35+ fixtures spanning the showcase demos across the integration fleet: agentic chat (weather, backgrounds, themes), tool rendering (pie/bar charts, weather cards), HITL (plans/steps/approvals), Sales Dashboard (deals/pipelines/todos), and assorted meeting/flight/greeting prompts. Mounted by the CI sidecar (`tests/docker-compose.integrations.yml`) at `/fixtures/default.json`.
- **`smoke.json`** — one minimal fixture: `match.userMessage = "Respond with exactly: OK"` → `response.content = "OK"`. Used by each package's `/api/smoke` route to verify the aimock → package → UI round-trip without a real agent.
- **`d5-all.json`** — large recorded D5 fixture set.
- **`feature-parity.json`** is also the large parity reference (84 KB).
- **`Dockerfile`** — `FROM ghcr.io/copilotkit/aimock:latest` + `COPY` of the three JSONs into `/fixtures/` (a convenience wrapper image; production Railway uses the upstream image with raw-URL fixtures instead).
- `d5-recorded/` is gitignored (recording scratch).

## Match semantics

`userMessage` is a **substring** match against the last user turn; **first fixture to match wins**, so specific prompts must precede generic ones (the README calls out a `"Based on the following context, write a concise"` entry placed before generic `report`/`plan` fixtures to protect CrewAI's startup probe). Valid response keys: `content`, `toolCalls`, `error`, `embedding`.

## Sync policy & drift (important caveats from README)

- **Hand-maintained.** No automated capture, no scheduled re-recording, no behavioral drift detection. The checked-in fixtures are authoritative.
- **Two-layer load-time validation** (not behavioral): (1) `--validate-on-load` makes the container refuse to start on an unrecognized response key; (2) `showcase/scripts/__tests__/aimock-fixtures.test.ts` runs `loadFixtureFile` + `validateFixtures` from `@copilotkit/aimock` against every `aimock/*.json` on every PR (`showcase_validate.yml`). See [[showcase - scripts]].
- Neither layer catches **behavioral drift**: if a package's agent changes its prompt/tool, the old fixture keeps matching and returns a stale response — surfacing as flaky or silently-wrong E2E, which a human must trace back to the fixture.

## Related workflows

- `test_e2e-showcase-on-demand.yml` — `/test-aimock <slug>` PR command; boots aimock with `feature-parity.json`, runs the package's Playwright suite against `OPENAI_BASE_URL=http://localhost:4010/v1`.
- `showcase_validate.yml` — fixture schema validation per PR.
- `showcase_smoke-monitor.yml` — polls `/api/smoke` (→ `smoke.json`) on deployed packages every 15 min.

## Related

- Consumed by [[showcase - tests (e2e-smoke)]] (CI sidecar) and the [[showcase - harness]] `aimock-wiring` probe; validated by [[showcase - scripts]].
- [[Apps MOC]] · [[@copilotkit vs @copilotkitnext]]
