---
title: showcase - eval-webhook
type: app
layer: tooling
source:
  - showcase/eval-webhook/
  - showcase/eval-webhook/src/server.ts
tags: [copilotkit, showcase, ops, github-app, webhook, eval, layer/tooling, type/app]
---
# showcase - eval-webhook

Tiny **GitHub App webhook receiver** (`showcase-eval-webhook`, private, ESM). A single Hono server whose only job is to turn a PR check-run **"Run eval"** button (and a signed trigger link from a bot comment) into a `workflow_dispatch` of the showcase eval workflow. **No CopilotKit.**

## Endpoints (verified from `src/server.ts`)

- **`GET /health`** → `{ ok: true }`.
- **`POST /webhooks/github`** — verifies `x-hub-signature-256` (HMAC-SHA256 over the raw body, `timingSafeEqual`). Only acts on `check_run` events where `action === "requested_action"` and `requested_action.identifier === "run-eval"`. It then:
  1. Resolves the PR number from `check_run.external_id` (or the first linked PR).
  2. Authenticates as the GitHub App (`@octokit/auth-app`, App ID default `1108748`, installation id from env).
  3. Sets the check run to `in_progress`.
  4. Dispatches `showcase_eval.yml` on `main` with inputs `{ pr_number, check_run_id }`.
- **`GET /trigger/eval?pr=&check_run_id=&sig=`** — HMAC-signed trigger link clicked from a bot comment. `validateTriggerParams` returns 400 (missing params) / 403 (bad signature) / valid; on success it serves a small confirmation HTML page with a button. `signTriggerUrl(pr, checkRunId)` HMACs `"<pr>:<checkRunId>"` with the same `WEBHOOK_SECRET`.

## Config

Env: `GITHUB_WEBHOOK_SECRET`, `GITHUB_APP_ID` (default `1108748`), `GITHUB_APP_PRIVATE_KEY` (with `\n` un-escaping), `GITHUB_APP_INSTALLATION_ID`. The trigger-link secret reuses `GITHUB_WEBHOOK_SECRET`.

## Build / deploy

- **Build:** `tsc` (plain TS). `dev` = `tsx watch src/server.ts`; `start` = `node dist/server.js`.
- **Docker:** `eval-webhook/Dockerfile` (node:22-slim, two-stage, runs as `node` user, `EXPOSE 3000`).
- Dependencies: `hono`, `@hono/node-server`, `@octokit/auth-app`, `@octokit/rest`.

## Relationship to the eval pipeline

This service is the human-in-the-loop entry point for the showcase **eval** flow — the heavy lifting (tiered eval over integrations) lives in `showcase_eval.yml` (driven by `eval-tiers.json` at the showcase root: Gold Standard `langgraph-python` fail-fast → Key Partners → Full Matrix). See [[showcase - harness]] for the always-on probe/alert side and [[Build-CI-Release MOC]] for the CI workflows.

## Related

- Triggers the showcase eval GitHub Actions workflow; complements [[showcase - harness]] (cron probes) and [[showcase - tests (e2e-smoke)]] (the suites eval ultimately exercises).
- [[Apps MOC]]
