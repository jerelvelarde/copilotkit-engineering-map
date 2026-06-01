---
title: lefthook (git hooks)
type: subsystem
layer: tooling
source:
  - lefthook.yml
  - scripts/hooks/check-binaries.sh
  - package.json
tags: [copilotkit, git-hooks, lefthook, pre-commit, tooling, layer/tooling, type/subsystem]
---
# lefthook (git hooks)

Git hooks are managed by **lefthook ^2.1.1**, configured in `lefthook.yml` and installed via the root `prepare` script (`lefthook install`, runs on `pnpm install`). Part of the [[Build-CI-Release MOC]]; pairs with [[commitlint]].

## `pre-commit` (parallel: true)
Five commands run in parallel on staged files:

1. **check-binaries** — `bash scripts/hooks/check-binaries.sh`. Rejects staged binary artifacts (`.exe/.dll/.so/.dylib/.o/.obj/.a/.lib/.wasm`), anything under `/build/`, `.dSYM/` dirs, and files **> 1 MB** (with an explicit allowlist for lockfiles and the large generated showcase `*-content.json` / `search-index.json` / `starter-content.json` files). Mirrors the `check-binaries` CI job in [[CI workflows - static & security]].
2. **sync-lockfile** — on `{packages,examples,showcase/scripts}/**/package.json` changes, runs `pnpm i --lockfile-only` and re-stages (`stage_fixed: true`) so the lockfile never drifts from manifest edits.
3. **lint-fix** — scoped to staged source files (`*.{js,jsx,ts,tsx,mjs,cjs,json,jsonc,json5,md,css,yml,yaml,html,vue,py}`, excluding `docs/**`). Runs `pnpm exec oxlint --fix`, then `pnpm exec oxfmt --write`, then best-effort `ruff format` on the *staged file list only*. Uses `set -- {staged_files}` + a `$# -gt 0` guard so a commit touching only excluded files doesn't make oxlint/oxfmt fall back to the whole repo. `stage_fixed: true`.
4. **test-and-check-packages** — `pnpm run test && pnpm run check:packages` with `NX_TUI: "false"`. Runs the full package test suite and `publint`/`attw` on every commit (Nx caching keeps this fast).
5. **check-plugin-skills** — on changes under `packages/*/skills/**`, `skills/{runtime,react-core,a2ui-renderer}/**`, `scripts/sync-plugin-skills.ts`, or `.claude-plugin/**`, runs `pnpm check:plugin-skills` to verify the mirrored skills are in sync (fail text tells you to run `pnpm sync:plugin-skills`).

## `commit-msg`
- **commitlint** — `pnpm commitlint --edit {1}` (validates the commit message file). See [[commitlint]].

## Output config
`output:` lists `meta, summary, success, failure, execution, execution_out, execution_info, skips` to control lefthook's verbosity.

The hooks deliberately mirror the CI gates (lint/format, binaries, package QA, commitlint) so violations are caught locally before push.
