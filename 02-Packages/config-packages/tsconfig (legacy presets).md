---
title: tsconfig (legacy presets)
type: package
layer: tooling
package: "tsconfig"
source:
  - packages/tsconfig/package.json
  - packages/tsconfig/base.json
  - packages/tsconfig/nextjs.json
  - packages/tsconfig/react-library.json
tags: [copilotkit, tooling, config, typescript, legacy, layer/tooling, type/package, pkg/tsconfig]
---
# tsconfig (legacy presets)

The **legacy** shared TypeScript preset package. Published as the **unscoped, private** package **`tsconfig`** at **v1.4.12** (`"private": true`, `publishConfig.access: "public"`, MIT). It predates the flat `@copilotkit/*` consolidation and **coexists** with the modern [[typescript-config]]; both ship the same three preset filenames but with different settings. Part of [[Config Packages MOC]].

> [!note] Same filenames, different package
> Consumers reference this one as a **workspace dependency** (`"tsconfig": "workspace:*"` in `package.json` `devDependencies`) and then `extends` paths like `tsconfig/base.json`. The scoped [[typescript-config]] is referenced as `@copilotkit/typescript-config/...`. The presets are not interchangeable — resolution mode and lib/target differ.

## The three presets

- **`base.json`** — `display: "Default"`. `strict: true`, `moduleResolution: "node"` (the legacy classic resolver, **not** NodeNext), `declaration` + `declarationMap` + `declarationDir: "./dist"`, `sourceMap`, `composite: false`, `esModuleInterop`, `forceConsistentCasingInFileNames`, `isolatedModules`, `preserveWatchOutput`, `skipLibCheck`, `noUnusedLocals/Parameters: false`. Carries its own `exclude` list (`dist`, `build`, `node_modules`, `*.test.ts(x)`, `__tests__/*`). Notably does **not** pin `lib`/`target`.
- **`nextjs.json`** — `extends ./base.json`, `display: "Next.js"`. `target: "es5"`, `strict: false`, `module/moduleResolution: esnext/(node via base)`, `jsx: "preserve"`, `lib: [dom, dom.iterable, esnext]`, `noEmit`, `allowJs`, `incremental`, `next` plugin, `include: [src, next-env.d.ts]`.
- **`react-library.json`** — `extends ./base.json`, `display: "React Library"`. `target: "es6"`, `module: "ESNext"`, `moduleResolution: "bundler"`, `lib: [dom, ES2017]`, `jsx: "react-jsx"`, `declarationDir: "./dist"`.

## Who consumes it

Older / V1-rooted packages declare `"tsconfig": "workspace:*"` (verified in `package.json`): **[[@copilotkit/shared]]**, **[[@copilotkit/runtime]]**, **[[@copilotkit/sdk-js]]**, **[[@copilotkit/react-core]]**, **[[@copilotkit/react-ui]]**, **[[@copilotkit/react-textarea]]**, and several `examples/v1/*` apps (`next-openai`, `node-express`, `node-http`, `next-pages-router`).

It also has a `typedoc.json` (`extends ../../typedoc.base.json`, empty `entryPoints`) so the docs pipeline skips it cleanly.
