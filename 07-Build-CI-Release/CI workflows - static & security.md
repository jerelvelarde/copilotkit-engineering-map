---
title: CI workflows - static & security
type: subsystem
layer: tooling
source:
  - .github/workflows/static_quality.yml
  - .github/workflows/static_check-binaries.yml
  - .github/workflows/static_danger.yml
  - .github/workflows/security_zizmor.yml
  - .github/workflows/security_fork-pr-alert.yml
  - .github/zizmor.yml
  - .github/scripts/check-config-allowlist.sh
  - .github/config-allowlist.txt
  - dangerfile.js
tags: [copilotkit, ci, static-analysis, security, zizmor, danger, layer/tooling, type/subsystem]
---
# CI workflows - static & security

Static-analysis and supply-chain-security workflows. Part of the [[Build-CI-Release MOC]]; siblings: [[CI workflows - testing]], [[CI workflows - showcase]], [[CI workflows - release & dependabot]].

## `static / quality` (`static_quality.yml`)
Four jobs (skips `docs/`, `examples/`, README):
- **format** — installs `oxfmt@0.36` + `ruff==0.15.13` (ruff pinned because this job holds a write token). On **push** it `--check`s the whole repo; on **PR** it scopes to PR-changed files (diffed against the live base-branch tip, excluding lockfiles), auto-fixes with oxfmt + ruff, and — only for same-repo PRs — commits `style: auto-fix formatting` back to the branch.
- **oxlint** — `pnpm run lint` (`oxlint .`).
- **package-quality** — `pnpm run check:packages` (publint + attw on every package; see [[Root scripts & toolchain]]).
- **commitlint** — see [[commitlint]] for the push-vs-PR logic and the PR fix-suggestion comment.

## `static / check binaries` (`static_check-binaries.yml`)
Two jobs:
- **check-config-files** — `.github/scripts/check-config-allowlist.sh` enforces that every build-config file (`vite.config.*`, `tsdown.config.*`, `next.config.*`, `webpack/rollup/esbuild config`, etc.) is listed in `.github/config-allowlist.txt`. New/unexpected config files fail until added to the allowlist (which is CODEOWNERS-gated) — a supply-chain hardening measure against smuggled build hooks.
- **check-binaries** — rejects binary extensions, `/build/` paths, `.dSYM/` dirs, and files > 1 MB in the PR diff (with an allowlist for lockfiles/assets/docs media/showcase data). Mirrors the local [[lefthook (git hooks)|check-binaries pre-commit hook]].

## `static / danger` (`static_danger.yml`)
Runs `danger ci` (`dangerfile.js`) **only** when `sdk-python/copilotkit/langgraph_agent.py` or `packages/sdk-js/src/langgraph.ts` change — a guard to keep the Python and JS LangGraph integrations in sync. Posts review comments via `GITHUB_TOKEN`.

## `security / zizmor` (`security_zizmor.yml`)
Static analysis of the workflows themselves via `zizmorcore/zizmor-action` (`min-severity: low`, blocking). Runs on `.github/workflows|actions/**` changes and weekly (`cron: 0 9 * * 1`) to catch newly-published advisories. Config in `.github/zizmor.yml` documents every suppression with a justification: `template-injection` and `excessive-permissions` have **no** ignores; `dangerous-triggers` and `artipacked` ignore only specific reviewed workflows (e.g. `update-branch.yml`, the Dependabot automations, `publish-commit.yml`/pkg-pr-new). Every `uses:` in the repo is SHA-pinned (kept current by Dependabot — see [[CI workflows - release & dependabot]]).

## `Security: Fork PR Alert` (`security_fork-pr-alert.yml`)
Runs on fork PRs only. A github-script monitor that flags supply-chain attack patterns and comments on the PR: `[skip ci]` directives in fork commits, zero-file PRs after force-push (the TanStack cleanup pattern), rapid open-then-close (CI-trigger-only), and large (>5000-line) added files. Detection/annotation only — it does not block.
