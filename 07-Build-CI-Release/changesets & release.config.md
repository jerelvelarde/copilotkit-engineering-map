---
title: changesets & release.config
type: subsystem
layer: tooling
source:
  - release.config.json
  - .changeset/
tags: [copilotkit, release, changesets, versioning, tooling, layer/tooling, type/subsystem]
---
# changesets & release.config

Two related pieces of release metadata. Part of the [[Build-CI-Release MOC]]; consumed by the [[Release pipeline (prepare/publish/prerelease)]].

## `release.config.json` (the authoritative scope map)
The pipeline's source of truth for **what** gets released and **how versions are shared**:

```json
{
  "prereleaseTag": "canary",
  "scopes": {
    "monorepo": {
      "packages": [ "@copilotkit/a2ui-renderer", "@copilotkit/agentcore-runner",
        "@copilotkit/core", "@copilotkit/react-core", "@copilotkit/react-native",
        "@copilotkit/react-textarea", "@copilotkit/react-ui", "@copilotkit/runtime",
        "@copilotkit/runtime-client-gql", "@copilotkit/sdk-js", "@copilotkit/shared",
        "@copilotkit/sqlite-runner", "@copilotkit/voice", "@copilotkit/vue",
        "@copilotkit/web-inspector" ],
      "versionSource": "@copilotkit/react-core",
      "sharedVersion": true
    },
    "angular": {
      "packages": ["@copilotkitnext/angular"],
      "versionSource": "@copilotkitnext/angular",
      "sharedVersion": false
    }
  }
}
```

- **Two scopes / release tracks:** `monorepo` (15 `@copilotkit/*` packages, lockstep at one shared version — the current `v1.57.4`, read from `versionSource` [[@copilotkit/react-core]]) and `angular` (the single [[@copilotkitnext/angular]] package, independent track, currently `v1.54.3`).
- `sharedVersion: true` for monorepo means `bumpPackages` also rewrites internal `@copilotkit/*` dependency pins (except `workspace:*`) to the new version.
- `prereleaseTag: "canary"` is the dist-tag for prereleases.
- Note: `@copilotkit/typescript-config`, `@copilotkit/demo-agents`, and the private config packages are **not** in either scope — they are not published by this pipeline.

This file is parsed by `scripts/release/lib/config.ts` (`loadConfig` / `getScopeConfig`).

## `.changeset/` (release-note fragments)
A `.changeset/` directory with human-authored markdown fragments (e.g. `debug-mode.md`, `ent-314-thread-connect-ux.md`, `fix-thread-switch-state-reset.md`). Each has Changesets-style frontmatter mapping packages to a bump level and a body describing the change:

```md
---
"@copilotkit/shared": minor
"@copilotkit/runtime": minor
"@copilotkit/react-core": minor
"@copilotkit/core": minor
---
feat: add debug mode to runtime and client
```

> **Important (per source-of-truth corrections):** despite these files, the actual release **is not run by the `@changesets/cli` "version" command**. The bespoke `scripts/release/*` pipeline computes versions from `release.config.json` + git history (see [[Release pipeline (prepare/publish/prerelease)]]); these fragments are change-description notes that feed human-readable release notes. Treat the `.changeset/` content as documentation of pending changes, not as the version driver.
