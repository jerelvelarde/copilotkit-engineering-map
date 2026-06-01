---
title: "@copilotkit vs @copilotkitnext"
type: concept
layer: meta
tags: [copilotkit, architecture, packaging, scopes, layer/meta, type/concept]
---
# @copilotkit vs @copilotkitnext

Two npm scopes appear in this repo and its showcase, and they do **not** map cleanly to "this repo's packages". This note clarifies which is which.

## `@copilotkit/*` — this monorepo

Almost every package under `packages/` publishes under the **`@copilotkit/`** scope at **v1.57.4**: [[@copilotkit/core]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/vue]], [[@copilotkit/a2ui-renderer]], the runner packages, etc. The TypeScript config package is `@copilotkit/typescript-config` (see [[typescript-config]]); `tsconfig`/`tailwind-config` are private/unscoped ([[Config Packages MOC]]).

## `@copilotkitnext/*` — mostly external

The **`@copilotkitnext/`** scope is a legacy/pre-consolidation publish scope. Most of it is **published externally and not built from this repo's `packages/`**:

- `@copilotkitnext/react`, `@copilotkitnext/agent`, `@copilotkitnext/runtime` are external npm packages consumed by `showcase/shell` via the **`next` dist-tag** (they appear in the shell's `package.json` but have no source here). The showcase also pulls `@copilotkit/react-core` at the `next` tag.
- The **one exception** that *is* local: `packages/angular` publishes as **`@copilotkitnext/angular`** at **v1.54.3** on an independent release track ([[@copilotkitnext/angular]]).

The historical "why" (a scope consolidation in progress) is **inferred**, not asserted by the code — state it as such.

## Practical implications

- A `[[@copilotkitnext/angular]]` link in this KB resolves to a real local package note; `@copilotkitnext/react|agent|runtime` do **not** have package notes here because their source isn't in this repo.
- Two release tracks exist (monorepo `v*` and `angular/v*`), both via npm OIDC — see [[Release pipeline (prepare/publish/prerelease)]] and [[npm OIDC publishing]].
- Don't assume `@copilotkitnext/runtime` ≡ [[@copilotkit/runtime]]; the latter is the dual-architecture (V1 GraphQL + V2) runtime documented in this KB.

See also the global packaging notes in [[Three-Layer Architecture]] and the repo-wide [[Build-CI-Release MOC]].
