---
title: Examples - e2e
type: example
layer: tooling
source:
  - examples/e2e/playwright.config.ts
  - examples/e2e/AGENTS.md
  - examples/e2e/package.json
  - examples/e2e/tests/v1.x
tags: [copilotkit, examples, e2e, playwright, ci, smoke-test, layer/tooling, type/example]
---
# Examples - e2e

`examples/e2e/` is a **Playwright smoke-test harness** for the repository's `examples/`. Goal: cheaply verify that example apps boot and render their key UI, without real API keys or LLM output. It is its own pnpm workspace (`name: examples-e2e`, deps: `@playwright/test ^1.50`). See [[Examples MOC]].

## How it works

- **One example at a time.** The active example is selected with the `EXAMPLE` env var; if unset it defaults to `form-filling`.
- `playwright.config.ts` resolves the dir as `examples/v1/${EXAMPLE}` (the **legacy [[Examples - v1 legacy]] set**) and points `webServer.cwd` there.
- **Webserver command** is `pnpm dev` for Next-only examples, or `pnpm dev:ui` for *hybrid* examples that also have a Python agent. Hybrid set is hard-coded: `travel`, `research-canvas`.
- Each spec is **gated** with `test.skip(EXAMPLE !== "<name>", …)` so a single suite run executes only the matching spec and skips the rest — ideal for a CI matrix (one job per example).
- Defaults: base URL `http://127.0.0.1:3000`, 60s test timeout, traces/video retained on failure, `OPENAI_API_KEY` defaulted to `"test"`, `NEXT_TELEMETRY_DISABLED=1`.

## Tests (`tests/v1.x/`)

| Spec | Targets `EXAMPLE` | Asserts |
|------|-------------------|---------|
| `form-filling.spec.ts` | `form-filling` | "Security Incident Report" heading loads, footer present |
| `chat-window-layout.spec.ts` | `form-filling` | chat body fills window; messages area + input layout; drag does not break layout |
| `dark-mode-scoping.spec.ts` | `form-filling` | `.dark` class does not leak CopilotKit styles to host; `poweredBy` dark color; styles scoped to CopilotKit elements (regression #2920) |
| `travel.spec.ts` | `travel` | page title matches `/CopilotKit Travel/i` (hybrid — `pnpm dev:ui`) |
| `research-canvas.spec.ts` | `research-canvas` | "Research Helper" heading loads (hybrid) |
| `chat-with-your-data.spec.ts` | `chat-with-your-data` | title `/Chat with your data/i`, "Data Dashboard" heading |
| `state-machine.spec.ts` | `state-machine` | "Orders" and "State Visualizer" buttons visible |

Smoke-test guidelines (from `AGENTS.md`): prefer `getByRole`/headings, do not depend on LLM output, avoid sending chat messages; disable auto-opening Copilot UI via query param (e.g. `travel` uses `/?copilotOpen=false`).

## CI

Runs via `.github/workflows/test_e2e-legacy-v1.yml` as a matrix over `form-filling`, `travel`, `research-canvas`, `chat-with-your-data`, `state-machine`. Installs `examples/e2e` deps + Playwright Chromium, then the selected example's deps with `pnpm install --frozen-lockfile` (and `--ignore-scripts` for `research-canvas` to skip Python tooling). Always uploads `test-results` and `playwright-report` artifacts. Relates to the broader [[Build-CI-Release MOC]].

## Run locally

```bash
# from examples/e2e
pnpm install
pnpm exec playwright install --with-deps chromium
EXAMPLE=form-filling pnpm test   # → 1 passed, others skipped
```
