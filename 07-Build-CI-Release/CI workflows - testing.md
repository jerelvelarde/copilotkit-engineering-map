---
title: CI workflows - testing
type: subsystem
layer: tooling
source:
  - .github/workflows/test_unit.yml
  - .github/workflows/test_unit-python-sdk.yml
  - .github/workflows/test_integration-runtime.yml
  - .github/workflows/test_integration-docs.yml
  - .github/workflows/test_e2e-dojo.yml
  - .github/workflows/test_e2e-legacy-v1.yml
  - .github/workflows/test_e2e-showcase-on-demand.yml
  - .github/workflows/test_smoke-starter.yml
tags: [copilotkit, ci, testing, vitest, playwright, e2e, layer/tooling, type/subsystem]
---
# CI workflows - testing

The `test_*` GitHub Actions workflows. Most run on **Depot runners** (`depot-ubuntu-24.04-4`, which require `id-token: write` for Depot OIDC auth) and use `persist-credentials: false`. Part of the [[Build-CI-Release MOC]]; sibling sets are [[CI workflows - static & security]], [[CI workflows - showcase]], [[CI workflows - release & dependabot]].

## Unit
- **`test / unit`** (`test_unit.yml`) — PR/push (ignoring `docs/`, `examples/`, `showcase/`, `sdk-python/`, README). Matrix **Node 20/22/24**. Manual pnpm-store caching keyed by Node version (deliberately not `cache: pnpm`, because a `better-sqlite3` native binary built for one Node ABI would be wrongly reused across ABIs). Steps: generate GraphQL codegen (`@copilotkit/runtime-client-gql:graphql-codegen`), `pnpm run build`, `pnpm run test`, then **release-script tests** via `vitest --config scripts/release/vitest.config.mts`.
- **`test / unit / python-sdk`** (`test_unit-python-sdk.yml`) — on `sdk-python/**`. Matrix **Python 3.10–3.14**, Poetry, `pytest tests/ -v` in `sdk-python/`. Covers [[sdk-python - overview|the Python SDK]].

## Integration
- **`test / integration / runtime`** (`test_integration-runtime.yml`) — on `packages/runtime/**`. Two jobs: **node** runs `vitest` against `src/v2/runtime/__tests__/integration/node-servers.integration.test.ts`; **bun** sets up Bun and runs `bun test` against the Bun server integration test. Both build `@copilotkit/runtime` first. Exercises [[runtime - Endpoints (Express/Hono/Node)]].
- **`test / integration / docs`** (`test_integration-docs.yml`) — on `docs/**`. Job 1 `validate-model-names` (`scripts/validate-doc-model-names.ts`); job 2 `doc-tests` installs `@copilotkit/aimock@1.24.1`, starts it on `:4010` against `scripts/doc-tests/fixtures`, then runs `scripts/doc-tests/extract.ts` + `run.ts` (see [[scripts (release/qa/doc-tests/hooks)]]).

## End-to-end
- **`test / e2e / dojo`** (`test_e2e-dojo.yml`) — on `packages/**` / `sdk-python/**` / `.changeset`. Playwright e2e against the dojo (`showcase/shell-dojo`).
- **`test / e2e / legacy-v1`** (`test_e2e-legacy-v1.yml`) — on `examples/**`. e2e against the legacy V1 examples.
- **`test / e2e / showcase / on-demand`** (`test_e2e-showcase-on-demand.yml`) — comment/dispatch-triggered, **executes PR-HEAD code** (Playwright + Next.js dev server + a Python agent + `pip install` of PR-controlled requirements). Heavily hardened per its header: `author_association` gate (OWNER/MEMBER/COLLABORATOR only), workflow-level `contents: read`, `persist-credentials: false`, write perms scoped only to the result-comment job.
- **`test / smoke / starter`** (`test_smoke-starter.yml`) — `cron: 0 */6 * * *` (catches floating-dep breakage), after the `publish / release` workflow completes (`workflow_run`), and on `examples/integrations/**` PRs. Smoke-tests the create-app / starter flow.

A common pattern across these jobs: a "Configure Nx Cloud environment" step that sets `NX_NO_CLOUD=true` and disables distributed execution, keeping only Nx run-grouping IDs (`NX_CI_EXECUTION_ID`).
