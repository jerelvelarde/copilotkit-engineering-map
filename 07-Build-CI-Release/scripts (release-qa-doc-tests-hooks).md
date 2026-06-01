---
title: scripts (release/qa/doc-tests/hooks)
aliases: ["scripts (release/qa/doc-tests/hooks)"]
type: subsystem
layer: tooling
source:
  - scripts/
  - scripts/doc-tests/extract.ts
  - scripts/doc-tests/run.ts
  - scripts/sync-plugin-skills.ts
  - scripts/validate-doc-model-names.ts
  - scripts/validate-integration-pins.ts
  - scripts/hooks/check-binaries.sh
tags: [copilotkit, scripts, tooling, doc-tests, validation, qa, layer/tooling, type/subsystem]
---
# scripts (release/qa/doc-tests/hooks)

The `scripts/` tree holds repo-management tooling beyond the release pipeline. (The `scripts/release/` subtree is documented separately in [[Release pipeline (prepare/publish/prerelease)]].) Part of the [[Build-CI-Release MOC]]. Most TS scripts run via `tsx`.

## `scripts/doc-tests/` — executable documentation
Run by the `doc-tests` job in [[CI workflows - testing]].
- **`extract.ts`** — walks `docs/**/*.mdx`, parses with `remark` + `remark-mdx` (with a regex fallback for MDX that trips the parser), and extracts every fenced code block carrying a `doctest="…"` meta attribute. Groups blocks by page slug + `title`, writes them (plus any `doctest.json` sidecar) to `.doctest-output/` with a `manifest.json`.
- **`run.ts`** — executes the extracted snippets. Spawns servers / runs scripts with a default env pointing at the local **aimock** mock-LLM (`OPENAI_BASE_URL=http://localhost:4010`), validates dependency names, and reports pass/fail per snippet.
- **`fixtures/default.json`** — the aimock fixture used for doc tests (a canned `"Hello! I'm an AI assistant."` response).

## Validators (each has a `__tests__` sibling)
- **`validate-doc-model-names.ts`** (root `validate:model-names`) — scans `docs/` + `showcase/shell-docs/src/content` for LLM model names and fails any not in `docs/model-allowlist.json` (strips provider prefixes like `openai/`). Gate in `test / integration / docs`.
- **`validate-integration-pins.ts`** — checks that `@copilotkit/*` deps in `examples/integrations/*/package.json` are pinned to exact stable semver matching the expected release version. Currently enforced only for the `adk` integration (per an inline scope decision; others are still on stale pins pending per-framework QA).
- **`sync-plugin-skills.ts`** (root `check:plugin-skills` / `sync:plugin-skills`) — mirrors `packages/*/skills/<slug>` source skills into top-level `skills/<slug>` and into `.claude-plugin/`; in `check` mode it fails if the mirror is stale. The plugin version tracks `packages/runtime/package.json`. Enforced by the `plugin-skills-check` workflow and a [[lefthook (git hooks)|pre-commit hook]].

## `scripts/qa/` — manual integration smoke harnesses
Bash scripts (`next.sh`, `next-pages.sh`, `remix.sh`, `node.sh`, `langchain.sh`, `langserve.sh`, `firebase.sh`, `css.sh`, plus `upgrade-*.sh`) that scaffold a throwaway app in `/tmp`, wire in CopilotKit, and let a human verify a framework integration. Share helpers in `scripts/qa/lib/`. Interactive (they prompt for package manager etc.) — not wired into CI.

## Other scripts
- **`hooks/check-binaries.sh`** — the binary/oversized-file rejecter invoked by [[lefthook (git hooks)]] (and mirrored by the `static / check binaries` CI job).
- **`docs/gen.ts`** — generates reference docs (`REFERENCE_DOCS`) into shell-docs; uses `allSettled` so a missing source doesn't abort the whole pipeline. Relates to [[Docs-Site MOC]].
- **`develop/example.sh`** — local dev helper for running an example against the workspace packages.
- **`archive-demo-repos.sh`** / **`migrate-demos.sh`** — one-off ops scripts for migrating/archiving the external demo repos into `examples/` (grouped `--group A|B|C|D|all`, `--dry-run`).
