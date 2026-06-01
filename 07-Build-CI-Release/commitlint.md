---
title: commitlint
type: subsystem
layer: tooling
source:
  - commitlint.config.js
  - .github/workflows/static_quality.yml
tags: [copilotkit, commitlint, conventional-commits, tooling, layer/tooling, type/subsystem]
---
# commitlint

Conventional-Commits enforcement, configured in `commitlint.config.js`. Runs at two points: the [[lefthook (git hooks)|`commit-msg` git hook]] locally, and the `commitlint` job in the `static / quality` workflow (see [[CI workflows - static & security]]).

## Config (`commitlint.config.js`)
```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  ignores: [(message) => /^Merge /.test(message)],
  rules: {
    "subject-case": [0],            // disabled
    "header-max-length": [2, "always", 120],
  },
};
```

Key points:
- Extends `@commitlint/config-conventional` (the standard `feat:/fix:/docs:/style:/refactor:/test:/chore:/ci:/perf:/build:` prefixes).
- **`header-max-length` raised to 120** (default is 100) because GitHub merge commits append ` (#NNNN)` and scoped prefixes like `fix(runtime): …` eat into the budget.
- **`subject-case` disabled** (`[0]`).
- **Merge commits ignored** via the `ignores` predicate (`/^Merge /`), since GitHub "Create a merge commit" takes its message from the PR body and can contain markdown lists that parse as empty subjects.

## CI behavior (`static_quality.yml` → `commitlint` job)
- On **push** to main: validates only the last commit (`npx commitlint --last --verbose`), but first counts parents and **skips merge commits** (`> 1` parent).
- On **pull_request**: validates the whole PR range (`--from <base.sha> --to <head.sha>`), `continue-on-error`, then posts/updates a PR comment with a fix suggestion on failure and finally fails the job.

> Note: the repo's own commit convention guidance lives in `CONTRIBUTING.md` / `CLAUDE.md`; this note documents the *enforcement mechanism* only.
