---
title: showcase - scripts
type: app
layer: tooling
source:
  - showcase/scripts/
  - showcase/bin/showcase
tags: [copilotkit, showcase, tooling, codegen, validation, layer/tooling, type/app]
---
# showcase - scripts

The **build/codegen/validation/deploy toolchain** of the showcase platform (`@copilotkit/showcase-scripts`, private, ESM). A pile of `tsx`-run TypeScript + bash that generates the JSON data files every shell consumes, validates manifests/constraints/fixtures, deploys to Railway, and powers the `bin/showcase` CLI.

## Codegen (feeds the shells)

| Script | Output | Consumers |
| --- | --- | --- |
| `generate-registry.ts` | `registry.json`, `constraints.json`, `catalog.json` | [[showcase - shell]], [[showcase - shell-docs]], [[showcase - shell-dojo]], [[showcase - shell-dashboard]] |
| `bundle-demo-content.ts` | `demo-content.json` (per-demo source + README + line regions) | shell, shell-docs, shell-dojo |
| `bundle-starter-content.ts` | `starter-content.json` | shell |
| `generate-search-index.ts` | `search-index.json` (Cmd-K) | shell, shell-docs |
| `probe-docs.ts` | `docs-status.json` (per-feature docs reachability) | shell-dashboard |

`generate-registry.ts` scans `integrations/*/manifest.yaml` (validated against `shared/manifest.schema.json`) and merges `shared/feature-registry.json` + `constraints.yaml`. Each output lands in the `src/data/` of every shell that needs it (apps never cross-import). All outputs are gitignored.

## Validation (CI gates)

- `validate-parity.ts` — feature-parity matrix checks (large).
- `validate-pins.ts` / `validate-pins-core.ts` — starter-template package pin freshness.
- `validate-constraints.ts` — constraint-table allow/deny sanity.
- `validate-fixture-tool-surface.ts` — aimock fixture tool surface vs demo tools.
- `validate-redirects.ts`, `redirect-decommission-core.ts` / `-report.ts` — legacy-host redirect stability.
- `verify-shell-docs.ts` (+ `.test.ts`), `probe-shell-docs.ts` — docs build/reachability.
- `verify-railway-image-refs.ts` — Railway service image refs.
- `audit.ts` — large cross-cutting audit.
- `__tests__/` (Vitest, run via `npm test`) — including `aimock-fixtures.test.ts` which schema-validates [[showcase - aimock fixtures]] via `@copilotkit/aimock` (`loadFixtureFile` + `validateFixtures`).

## Authoring / capture / deploy

- `create-integration/` — scaffolds a new integration.
- `migrate-integration-examples.ts`, `extract-starter.ts` — content migration / starter extraction.
- `capture-previews.ts`, `record-d5-fixtures.mjs` — Playwright capture + D5 fixture recording.
- `deploy-to-railway.ts` — Railway deploy.
- `sync-docs-from-main.ts` — docs sync (writes `shell-docs/.docs-sync-sha`).
- `sync-qa-to-notion.ts` — pushes QA coverage to Notion.
- `smoke-local.sh`, `ci-native-eval.sh` — local/CI smoke + native eval entrypoints.

## `bin/showcase` CLI

`showcase/bin/showcase` is a bash dispatcher: built-in compose commands (`up`/`down`/`build`/`ps`/`ports`/`logs`) plus auto-discovered plugin commands from `scripts/cli/cmd-*.sh` (`test`, `doctor`, `fixtures`, `aimock-rebuild`, `recreate`, `diff-logs`, `logs`). Shared bash lib: `scripts/cli/_common.sh`. It wraps `docker-compose.local.yml` (one service per package, ports from `shared/local-ports.json`) so you can run probe drivers (liveness, D4, D5) against local containers instead of Railway.

## Dependencies of note

`@copilotkit/aimock` (pinned `1.26.1`) for fixture validation, `@playwright/test` + `playwright` for capture/e2e, `ajv` for schema validation, `yaml`, `glob`, `prompts`, `chalk`.

## Related

- Outputs consumed by all four shell apps; CLI orchestrates local Docker for [[showcase integration]] backends.
- Fixture validation guards [[showcase - aimock fixtures]]; manifest/registry source is [[showcase - shared]].
- [[showcase - tests (e2e-smoke)]] imports the generated `registry.json`.
- [[Apps MOC]] · [[Build-CI-Release MOC]]
