---
title: npm OIDC publishing
type: concept
layer: tooling
source:
  - .github/workflows/publish-release.yml
  - .github/workflows/prerelease.yml
  - scripts/release/publish-release.ts
  - scripts/release/prerelease.ts
tags: [copilotkit, release, npm, oidc, security, supply-chain, layer/tooling, type/concept]
---
# npm OIDC publishing

CopilotKit publishes to npm using **OIDC trusted publishers** instead of long-lived `NPM_TOKEN` secrets. This is the auth mechanism behind the [[Release pipeline (prepare/publish/prerelease)]] and the publish jobs in [[CI workflows - release & dependabot]].

## How it works
- The publish job grants `permissions: id-token: write`, which lets GitHub Actions mint a short-lived OIDC token for the run.
- Publishing goes through `npx --yes npm@11.15.0 publish` (npm 11 is OIDC-aware) rather than the older repo `npm`. npm 11 exchanges the GitHub Actions OIDC token with the registry's trusted-publisher configuration to authenticate the publish.
- Crucially, **`NODE_AUTH_TOKEN: ""`** is set in the publish step env — an empty token avoids npm preferring a (non-existent) token and blocking the OIDC path.
- Packages are packed with **`pnpm pack`** (workspace-aware) first, then the resulting `<name>-<version>.tgz` tarball is published with `--access public` and the appropriate `--tag` (`latest` for stable, `canary` for prerelease).

## Secret-free build / publish split
A consistent design property across `prerelease.yml` and `publish-release.yml`:
- **Build + version bump** run in a job with **no publish secrets** (only `contents: read`). That job uploads the built workspace as an artifact (excluding `node_modules` and caches; see the upload notes in `publish-release.yml`).
- **Publish** runs in a separate job (`environment: npm`, `id-token: write`) that downloads the artifact, restores `node_modules` via `pnpm install --frozen-lockfile`, and only then publishes.

This keeps any potential build-time code (postinstall scripts, etc.) away from the credentials, reducing supply-chain blast radius. The `publish-release.yml` build job further uses `persist-credentials: false` so the uploaded artifact never carries a workflow-scoped git token in `.git/config`; the publish job sets up its own `git config insteadOf` with `GITHUB_TOKEN` immediately before pushing the release tag.

## Idempotency & safety
`publish-release.ts` checks the registry per package and **skips** any already published at the target version (so a re-triggered release doesn't error on "already published"), and the workflow guards against re-pushing an existing git tag. See [[Release pipeline (prepare/publish/prerelease)]] for the full gate list.
