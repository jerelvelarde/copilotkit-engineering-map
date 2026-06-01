---
title: pnpm workspace
type: subsystem
layer: tooling
source:
  - pnpm-workspace.yaml
  - .npmrc
  - .pnpmfile.cjs
  - package.json
tags: [copilotkit, build, pnpm, workspace, tooling, layer/tooling, type/subsystem]
---
# pnpm workspace

pnpm **10.33.4** (pinned via the root `package.json` `packageManager` field; CI inherits it through corepack). The workspace is defined in `pnpm-workspace.yaml`. Companion of [[Nx configuration]] and [[Root scripts & toolchain]] under the [[Build-CI-Release MOC]].

## Workspace globs (`pnpm-workspace.yaml`)
```yaml
packages:
  - "packages/*"
  - "examples/v1/*"
  - "examples/v2/*"
  - "examples/v2/*/apps/*"
  - "examples/v2/react/*"
  - "examples/v2/vue/*"
  - "examples/v2/angular/*"
  - "examples/v2/react-native/*"
  - "examples/v2/runtime/*"
  - "examples/showcases/generative-ui-playground"
  - "!examples/v1/_legacy"
  - "showcase/scripts"
  - "showcase/harness"
  - "showcase/eval-webhook"
onlyBuiltDependencies:
  - better-sqlite3
```

**Notable exclusions / inclusions:**
- `showcase/shell-dashboard` is deliberately **NOT** in the workspace — it is a flat, standalone Next.js app that ships its own `package-lock.json` and builds with `npm ci` in its Dockerfile. Adding it would force it into the pnpm lockfile and break its independent deploy path.
- `showcase/scripts` **is** in the workspace because `showcase/harness` imports from it.
- `examples/v1/_legacy` is excluded with `!`.
- `onlyBuiltDependencies: [better-sqlite3]` restricts which deps may run postinstall build scripts (pnpm 10 blocks build scripts by default) — relevant to [[@copilotkit/sqlite-runner]].

## `.npmrc`
```
minimum-release-age=1440      # only install deps published ≥ 24h ago (supply-chain delay)
block-exotic-subdeps=true     # reject non-registry transitive deps (git/file/etc.)
```

## `.pnpmfile.cjs`
A `readPackage` hook that, **only when `A2UI_LOCAL=1`**, rewrites `@a2ui/web_core` / `@a2ui/react` dependencies to `link:` against a sibling `../A2UI` checkout. Default installs pull `@a2ui/*` from npm. Supports local development against the external A2UI repo (relevant to [[A2UI (Generative UI)]] consumers like [[@copilotkit/a2ui-renderer]]).

## Dependency overrides (`package.json` → `pnpm.overrides`)
A large `overrides` map pins/forces transitive versions — mostly **security floors** (e.g. `express ">=4.20.0"`, `axios ">=1.15.0"`, `tar ">=7.5.11"`, `esbuild ">=0.25.4"`) plus framework alignment (`react`/`react-dom` forced to `19.2.3`, `@types/react` to `19.1.8`, `next` to `^16.0.10`, and `@copilotkit/license-verifier` pinned to `0.4.0`). `peerDependencyRules` allow any `react`/`react-dom` and ignore them when missing.
