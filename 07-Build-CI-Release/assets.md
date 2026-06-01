---
title: assets
type: subsystem
layer: tooling
source:
  - assets/
  - .github/workflows/static_check-binaries.yml
tags: [copilotkit, assets, media, readme, layer/tooling, type/subsystem]
---
# assets

The top-level `assets/` directory holds static media referenced by the repo's README and marketing surfaces. Not part of the build/test path; listed in the [[Build-CI-Release MOC]] as a repo-level area.

## Contents
- **GIFs** — `animated-banner.gif`, `demo.gif`, `CopilotTextarea.gif` (+ `CopilotTextarea_old.gif`), `spreadsheet-demo-big-file.gif`, `travel-planner-gif.gif`. Demo/marketing animations.
- **Images** — `project-canvas-demo.png`, `proejct-perplexity-clone.png` (filename typo present in repo).
- **`license-badge.svg`** — the CopilotKit license badge SVG (the runtime equivalent, `--copilotkit-license-banner-offset`, is referenced by the chat UI; see [[Telemetry & Licensing]]).

Several of these files appear as small Git-LFS pointer stubs in the worktree (≈130 bytes each) rather than the full binaries.

## CI relevance
`assets/*` is on the explicit allowlist in both the `static / check binaries` workflow and the [[lefthook (git hooks)|check-binaries pre-commit hook]] (the >1 MB / binary-extension rejecter) — so legitimately large media here doesn't trip the binary-artifact guard documented in [[CI workflows - static & security]].
