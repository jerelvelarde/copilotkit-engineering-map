---
title: CI workflows - showcase
type: subsystem
layer: tooling
source:
  - .github/workflows/showcase_build.yml
  - .github/workflows/showcase_build_check.yml
  - .github/workflows/showcase_deploy.yml
  - .github/workflows/showcase_validate.yml
  - .github/workflows/showcase_eval.yml
  - .github/workflows/showcase_eval_check.yml
  - .github/workflows/showcase_eval-webhook_build.yml
  - .github/workflows/showcase_capture-previews.yml
  - .github/workflows/showcase_docs-sync.yml
  - .github/workflows/showcase_qa-sync.yml
  - .github/workflows/showcase_keep-alive.yml
  - .github/workflows/auto_merge_showcases.yml
  - .github/workflows/integrations_parity.yml
tags: [copilotkit, ci, showcase, docker, ghcr, railway, layer/tooling, type/subsystem]
---
# CI workflows - showcase

The largest workflow cluster — it builds, deploys, validates, and evaluates the `showcase/` apps (see [[Apps MOC]]). Part of the [[Build-CI-Release MOC]]; siblings: [[CI workflows - testing]], [[CI workflows - static & security]], [[CI workflows - release & dependabot]].

## Build & deploy
- **`Showcase: Build & Push`** (`showcase_build.yml`) — post-merge. Builds Docker images (Depot), pushes them to **GHCR**, and triggers **Railway** to redeploy. Deliberately has **no** `cancel-in-progress` concurrency group so deploys aren't interrupted mid-push.
- **`Showcase: Build Check (PR)`** (`showcase_build_check.yml`) — pre-merge equivalent with `push: false`, catching Dockerfile-context failures before merge.
- **`Showcase: Verify Deploy`** (`showcase_deploy.yml`) — `workflow_run` after the build, verifies Railway deployed and each service is healthy. Uses `cancel-in-progress: true` (verification is idempotent).
- **`showcase / eval-webhook / build`** (`showcase_eval-webhook_build.yml`) — builds the `showcase/eval-webhook` service on changes.

## Validate & eval
- **`Showcase: Validate`** (`showcase_validate.yml`) — on `showcase/**`, `examples/integrations/**`, and workspace files. Runs on Depot; per-event concurrency so main-branch pushes are never cancelled (so Slack failure alerts via `SLACK_WEBHOOK_OSS_ALERTS` fire reliably) while PRs still cancel-in-progress.
- **`showcase / eval`** (`showcase_eval.yml`) + **`Showcase: Eval Check`** (`showcase_eval_check.yml`) — execute `showcase/bin/showcase eval` against PR-HEAD code with the same residual-trust hardening as the on-demand e2e workflow (collaborator-permission gate, least-privilege token).
- **`Integrations: Parity Check`** (`integrations_parity.yml`) — on `examples/integrations/**`, runs the parity verifier (`examples/integrations/_parity/verify.ts`, exposed via root `parity:verify`).

## Previews, docs, QA, keep-alive
- **`Showcase: Capture Previews`** (`showcase_capture-previews.yml`) — `workflow_run` after build (main only), captures preview screenshots.
- **`Showcase: Docs Sync`** (`showcase_docs-sync.yml`) — **auto-trigger disabled** (2026-05-19) ahead of the shell-docs cutover so an upstream→shell sync doesn't clobber edits authored directly in `showcase/shell-docs/`; manual `workflow_dispatch` remains. Relates to [[Docs-Site MOC]].
- **`Showcase: Sync QA to Notion`** (`showcase_qa-sync.yml`) — on `showcase/integrations/*/qa/**` + `manifest.yaml`, pushes QA results to Notion.
- **`Showcase: Keep-alive`** (`showcase_keep-alive.yml`) — interim; curls `/api/health` on each service every 5 min to keep warm-state from decaying (superseded by the harness smoke cadence per its header).
- **`Auto-merge showcase PRs`** (`auto_merge_showcases.yml`) — auto-merges PRs touching only `examples/showcases/**` (community demo submissions; demo team owns these per CODEOWNERS).
