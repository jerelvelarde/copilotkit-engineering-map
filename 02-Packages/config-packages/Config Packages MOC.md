---
title: Config Packages MOC
type: moc
layer: tooling
tags: [copilotkit, tooling, config, moc, layer/tooling, type/moc]
---
# Config Packages MOC

Map of the shared **build-configuration packages** under `packages/`. These are not shipped runtime code — they are workspace-internal presets that other packages and example apps `extends`/depend on so TypeScript and Tailwind settings stay consistent across the monorepo.

## Notes in this folder

- [[typescript-config]] — `@copilotkit/typescript-config` (v1.55.0-next.8). The **modern** TS preset set (`base.json`, `nextjs.json`, `react-library.json`) on `NodeNext` resolution. Consumed by the newer flat-structure packages.
- [[tsconfig (legacy presets)]] — unscoped `tsconfig` (v1.4.12). The **legacy** TS preset set (same three filenames) on `node` resolution. Still consumed by older packages and v1 example apps.
- [[tailwind-config]] — unscoped `tailwind-config` (v1.4.12). Shared Tailwind **v3** config exposing `brandblue`/`brandred` theme colors.

## The two-tsconfig situation

> [!important] Two TypeScript-config packages coexist
> `@copilotkit/typescript-config` and the unscoped `tsconfig` both ship the same three preset filenames (`base.json`, `nextjs.json`, `react-library.json`) but with **different compiler settings** (NodeNext vs node module resolution, differing `lib`/`target`/strictness). They are used side-by-side by different packages. This is apparent redundancy from the V1→flat consolidation; this KB does **not** assert which is canonical — see each note for exactly who consumes it (verified from `tsconfig.json`/`package.json` across the repo).

```mermaid
flowchart TD
  subgraph modern["@copilotkit/typescript-config (NodeNext)"]
    M1[base.json]
    M2[nextjs.json]
    M3[react-library.json]
  end
  subgraph legacy["tsconfig — unscoped (node)"]
    L1[base.json]
    L2[nextjs.json]
    L3[react-library.json]
  end
  TW[tailwind-config<br/>Tailwind v3]

  voice[voice / web-inspector / core /<br/>vue / angular / sqlite-runner /<br/>agentcore-runner / demo-agents] -->|extends base.json| modern
  legacypkgs[shared / runtime / sdk-js /<br/>react-core / react-ui / react-textarea] -->|workspace dep| legacy
  ui[react-ui / react-textarea /<br/>v1 example apps] -->|workspace dep| TW
```

These packages are part of the broader [[Build-CI-Release MOC]] toolchain (Nx, pnpm, tsdown, vitest).
