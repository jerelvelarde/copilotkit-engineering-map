---
title: Root scripts & toolchain
type: subsystem
layer: tooling
source:
  - package.json
  - .oxlintrc.json
  - .oxfmtrc.json
tags: [copilotkit, build, toolchain, oxlint, oxfmt, tsdown, vitest, layer/tooling, type/subsystem]
---
# Root scripts & toolchain

The root `package.json` (`"name": "CopilotKit"`, `"private": true`) is the entry point for all monorepo-wide tasks. Sits under the [[Build-CI-Release MOC]] with [[Nx configuration]] and [[pnpm workspace]].

## Toolchain (from `devDependencies`, per the global corrections)
- **Nx 22.5** (`nx ^22.5.0`) — task runner. See [[Nx configuration]].
- **TypeScript ~5.2** (`typescript ^5.2.3`).
- **Bundler: tsdown ^0.20.3** — default bundler for most packages (vue uses vite, angular uses ng-packagr).
- **Test runner: vitest** (`^4.1.3`) + `@vitest/coverage-v8`.
- **Lint/format: oxlint ^1.51.0 + oxfmt ^0.36.0** (Rust-based; replaces ESLint/Prettier).
- **Git hooks: lefthook ^2.1.1** — see [[lefthook (git hooks)]].
- **Commits: @commitlint/cli + config-conventional** — see [[commitlint]].
- **Package QA: publint ^0.3.17 + @arethetypeswrong/cli (attw) ^0.18.2**.
- **codemods: jscodeshift ^17.3.0** — see [[codemods (migrate-attachments)]].
- **danger ^12.3.3**, **remark/unified** (doc-tests), **storybook ^10**, **tsx ^4.21** (runs the TS release scripts).
- `engines.node: ">=18"`.

## Key root scripts
| Script | Command | Notes |
|---|---|---|
| `build` | `nx run-many -t build --projects=packages/** --exclude=@copilotkit/demo-agents` | builds all publishable packages |
| `build:examples` / `build:storybook` / `build:vue` | `nx run-many …` | scoped builds |
| `check-types` | `nx run-many -t check-types` | |
| `lint` | `oxlint .` | the `static / quality` oxlint job runs this |
| `format` / `check-format` | `oxfmt --write .` / `oxfmt --check .` | |
| `test` / `test:coverage` | `nx run-many -t test --projects=packages/**` | |
| `dev` | `pnpm run build && nx watch --projects=packages/** -- pnpm run build` | |
| `publint` / `attw` / `check:packages` | `nx run-many -t publint,attw --projects=packages/**` | package-export QA |
| `release:prepare:dry` / `release:prerelease:dry` | `tsx scripts/release/*.ts … --dry-run` | dry-run [[Release pipeline (prepare/publish/prerelease)]] |
| `validate:model-names` | `tsx scripts/validate-doc-model-names.ts` | docs model allowlist |
| `check:plugin-skills` / `sync:plugin-skills` | `tsx scripts/sync-plugin-skills.ts` | mirrors package skills → `.claude-plugin/` |
| `parity:sync` / `parity:verify` / `parity:check` | `tsx examples/integrations/_parity/*.ts` | integration parity |
| `prepare` | `lefthook install` | installs git hooks on `pnpm install` |
| `clean` | `git clean -fdX --exclude="!.env"` | |
| `graph` | `nx graph` | |

These scripts are mostly thin wrappers over Nx; the `tsx`-invoked ones drive the bespoke release pipeline and the `scripts/` validators (see [[scripts (release/qa/doc-tests/hooks)]]).

## oxlint config (`.oxlintrc.json`)
- Plugins: `typescript, unicorn, oxc, react, nextjs, import` plus a **local JS plugin** `./packages/react-ui/oxlint-rules/copilotkit-plugin.mjs` (the `copilotkit/require-cpk-prefix` rule, warn-only inside `packages/react-ui/src`).
- Categories `correctness` + `suspicious` set to `warn`.
- Enforces `consistent-type-imports` (separate type imports), `no-unnecessary-type-assertion` (error), etc.
- `no-restricted-imports` blocks **value** imports of `@a2ui/lit` (it registers custom elements as a side effect that breaks React Strict Mode) — type imports allowed.
- `ignorePatterns` excludes `dist`, `node_modules`, `.next`, generated dirs, and `docs/**`.

## oxfmt config (`.oxfmtrc.json`)
`printWidth: 80`, `proseWrap: preserve`; ignores `docs/**`, the shell content dirs, a couple of generated files, and `packages/web-inspector/src/styles/generated.css`.
