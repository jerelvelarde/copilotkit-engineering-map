---
title: typescript-config
type: package
layer: tooling
package: "@copilotkit/typescript-config"
source:
  - packages/typescript-config/package.json
  - packages/typescript-config/base.json
  - packages/typescript-config/nextjs.json
  - packages/typescript-config/react-library.json
tags: [copilotkit, tooling, config, typescript, layer/tooling, type/package, pkg/typescript-config]
---
# typescript-config

The **modern** shared TypeScript preset package. Published as **`@copilotkit/typescript-config`** at **v1.55.0-next.8** — marked `"private": true` in `package.json` yet carries `publishConfig.access: "public"` and a `@copilotkit/` scope (it rides the prerelease/`next` track). Part of [[Config Packages MOC]]; see [[tsconfig (legacy presets)]] for the unscoped legacy twin it coexists with.

## Exports (the three presets)

`package.json` exposes the JSON files directly via `exports`:

```json
"exports": {
  "./base.json": "./base.json",
  "./nextjs.json": "./nextjs.json",
  "./react-library.json": "./react-library.json"
}
```

- **`base.json`** — the root preset. `strict: true`, `module`/`moduleResolution: "NodeNext"`, `target`/`lib: ES2022` (+ `DOM`, `DOM.Iterable`), `moduleDetection: "force"`, `isolatedModules`, `noUncheckedIndexedAccess: true`, `declaration` + `declarationMap`, `esModuleInterop`, `resolveJsonModule`, `skipLibCheck`, `incremental: false`.
- **`nextjs.json`** — `extends ./base.json`; switches to `module: "ESNext"` + `moduleResolution: "Bundler"`, adds the `next` plugin, `jsx: "preserve"`, `allowJs`, `noEmit: true`.
- **`react-library.json`** — `extends ./base.json`; adds `jsx: "react-jsx"` (otherwise inherits NodeNext base).

## Who consumes it

Newer flat-structure packages `extends` `@copilotkit/typescript-config/base.json` in their `tsconfig.json` (verified across the repo): `core`, `vue`, `angular`, `sqlite-runner`, `agentcore-runner`, `demo-agents`, plus **[[@copilotkit/voice]]** and **[[@copilotkit/web-inspector]]**. (web-inspector layers `experimentalDecorators` + `useDefineForClassFields: false` on top for Lit decorators.)

## Distinguishing it from the legacy `tsconfig`

The key differences vs [[tsconfig (legacy presets)]]: this package uses **`NodeNext`** resolution and pins `lib`/`target` to **ES2022** with `noUncheckedIndexedAccess`; the legacy package uses **`node`** resolution, sets `declarationDir: "./dist"`, and bundles an `exclude` for tests. Both expose identically-named presets, so a package's choice is determined by what it `extends`/depends on — not by filename.
