---
title: CI workflows - release & dependabot
type: subsystem
layer: tooling
source:
  - .github/workflows/stable-release.yml
  - .github/workflows/publish-release.yml
  - .github/workflows/prerelease.yml
  - .github/workflows/publish-commit.yml
  - .github/workflows/dependabot-auto-merge.yml
  - .github/workflows/dependabot-major-analysis.yml
  - .github/workflows/update-branch.yml
  - .github/workflows/cleanup_pr-caches.yml
  - .github/dependabot.yml
tags: [copilotkit, ci, release, dependabot, npm, oidc, layer/tooling, type/subsystem]
---
# CI workflows - release & dependabot

Release-orchestration and dependency-automation workflows. Part of the [[Build-CI-Release MOC]]; siblings: [[CI workflows - testing]], [[CI workflows - static & security]], [[CI workflows - showcase]]. These drive the [[Release pipeline (prepare/publish/prerelease)]] and rely on [[npm OIDC publishing]].

## Release
- **`release / create-pr`** (`stable-release.yml`) — `workflow_dispatch` with `scope` (monorepo/angular), `bump` (patch/minor/major), `dry_run`. Guards against an existing open `release/publish/*` PR, runs `prepare-release.ts` then `generate-ai-release-notes.ts` (with `ANTHROPIC_API_KEY` + Notion secrets), and opens a release PR via `peter-evans/create-pull-request` on branch `release/publish/<scope>/v<version>` with a checklist body and a Notion-link comment. `environment: npm`.
- **`release / publish`** (`publish-release.yml`) — triggers when a merged PR's head ref starts with `release/publish/` (plus a `workflow_dispatch` escape hatch). **build** job (no secrets, `persist-credentials: false`): `pnpm run build`, then uploads the workspace artifact (excluding `node_modules`/caches). **publish** job (`environment: npm`, `id-token: write`): downloads the artifact, restores deps, runs `publish-release.ts` (OIDC, `NODE_AUTH_TOKEN: ""`), checks for a pre-existing tag, pushes `v<version>` (or `<scope>/v<version>`), and creates/updates the GitHub Release from `release-notes.md`.
- **`release / pre`** (`prerelease.yml`) — `workflow_dispatch` (scope/suffix/dry_run). build job runs `bump-prerelease.ts` + build + test; publish job runs `prerelease.ts` (canary tag, OIDC).
- **`🚀 pkg-pr-new`** (`publish-commit.yml`) — on every push/PR touching `packages/**`. Builds and runs `npx pkg-pr-new publish --pnpm "./packages/*"` to post installable per-commit snapshot package previews on the PR (requires `pull-requests: write` + persisted credentials — one of the documented `artipacked` zizmor suppressions).

## Dependabot automation (`.github/dependabot.yml`)
Dependabot is scoped to **GitHub Actions only** (Node/Python/pnpm are handled by Renovate / manually). Daily, `open-pull-requests-limit: 10`, `cooldown: 1 day`, commit prefix `chore(ci)`, labels `dependencies/github-actions/security`, with grouped `minor-and-patch` and `major` updates.
- **`Dependabot Auto-Merge (Minor/Patch)`** (`dependabot-auto-merge.yml`) — `pull_request_target`, actor-gated to `dependabot[bot]`. Auto-approves + enables auto-merge for **minor/patch** github-actions bumps via `gh`. Does not check out PR code (a reviewed `dangerous-triggers` suppression).
- **`Dependabot Major Version Analysis`** (`dependabot-major-analysis.yml`) — `pull_request_target` on **major** github-actions bumps. Fetches the action's release notes, extracts likely breaking-change lines, posts a "Manual Review Required" comment, and adds `major-update`/`needs-review` labels. Comment only, no auto-merge.

## Repo housekeeping
- **`Update PR branch`** (`update-branch.yml`) — `pull_request_target` gated on a maintainer-applied `update-branch` label; checks out the base repo (not PR head) — the documented safe label-gated pattern.
- **`cleanup / pr-caches`** (`cleanup_pr-caches.yml`) — on PR close, deletes that PR's Actions caches.
