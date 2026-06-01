---
title: Nx configuration
type: subsystem
layer: tooling
source:
  - nx.json
  - package.json
tags: [copilotkit, build, nx, caching, tooling, layer/tooling, type/subsystem]
---
# Nx configuration

Defined in `nx.json`. Nx **22.5** is the monorepo task runner; every task is meant to run through `nx run` / `nx run-many` / `nx affected` rather than the underlying tool. Part of the [[Build-CI-Release MOC]] toolchain alongside [[pnpm workspace]] and [[Root scripts & toolchain]].

## Named inputs (cache keys)
- `default` — all project files **except** `node_modules`, `*.md`, `*.yml`, `*.yaml` (so doc/CI edits don't bust build caches).
- `production` — `default` minus test files (`*.test.*`, `*.spec.*`, `__tests__/**`).
- `test` — all `src/**` TS/TSX plus the test files.

## Target defaults
| Target | `dependsOn` | Outputs | Cache |
|---|---|---|---|
| `build` | `^build` | `dist/**` | yes (inputs: `production`, `.env*`) |
| `dev` | `^build` | — | no |
| `test` | `^build` | `coverage/**` | yes (inputs: `test`) |
| `test:watch` | — | — | no |
| `test:coverage` | — | `coverage/**` | yes |
| `check-types` | `^build`, `^check-types` | — | yes |
| `generate-graphql-schema` | `^build` | `__snapshots__/**` | yes |
| `graphql-codegen` | `^build` | — | yes |
| `build:css` | — | `dist/styles.css`, `src/styles/generated.css` | yes |
| `storybook:build` | `^build` | `storybook-static/**` | yes |
| `publint` | `build` | — | yes (inputs: `package.json`, `dist/**`) |
| `attw` | `build` | — | yes |
| `link:global` / `unlink:global` | — | — | no |

The `^build` dependency is what enforces the **V1-wraps-V2 / cross-package build order**: a package's `build` waits for its dependencies' `build` first. `publint` and `attw` (see [[Root scripts & toolchain]]) gate on a fresh `build` and feed the `package-quality` CI job.

## Settings
- `"parallel": 14` — up to 14 tasks concurrently.
- `"defaultBase": "main"` — the base ref for `nx affected`.

Nx Cloud is used in CI but most CI jobs explicitly **disable** distributed execution and set `NX_NO_CLOUD=true` per-job (see [[CI workflows - testing]] / [[CI workflows - static & security]]); they keep Nx Cloud only for run grouping via `NX_CI_EXECUTION_ID` / `NX_CI_EXECUTION_ENV`.
