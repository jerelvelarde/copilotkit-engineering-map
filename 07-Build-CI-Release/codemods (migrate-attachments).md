---
title: codemods (migrate-attachments)
type: symbol
layer: tooling
source:
  - codemods/migrate-attachments.ts
  - codemods/__tests__/migrate-attachments.test.ts
tags: [copilotkit, codemod, jscodeshift, migration, attachments, layer/tooling, type/symbol]
---
# codemods (migrate-attachments)

A jscodeshift codemod that migrates user code from the deprecated image-upload API to the [[shared - Attachments|attachments]] API. Lives at `codemods/migrate-attachments.ts`; the only codemod in the repo. Part of the [[Build-CI-Release MOC]] tooling.

## Usage
```bash
npx jscodeshift -t ./codemods/migrate-attachments.ts --extensions=tsx,ts ./src
```
(`jscodeshift ^17.3.0` is a root devDependency; see [[Root scripts & toolchain]].)

## Transformations (`export default function transform(file, api)`)
1. **JSX prop migration** on `CopilotChat` / `CopilotSidebar` / `CopilotPopup` (from [[@copilotkit/react-ui]] / [[@copilotkit/react-core]]):
   - `imageUploadsEnabled={true}` → `attachments={{ enabled: true }}`
   - `inputFileAccept="…"` → merged into `attachments={{ accept: "…" }}`
   - both present → `attachments={{ enabled: true, accept: "…" }}`
   - Preserves dynamic expressions as-is; **skips** elements that already have an `attachments` prop (idempotent).
2. **Import renames** from `@copilotkit/react-ui`:
   - `ImageUploadQueue` → `AttachmentQueue`
   - `ImageUpload` (type) → `Attachment`
   - Renames the imported identifier and (when not aliased) its references, with careful guards: it detects whether a local declaration **shadows** the name and, if so, only rewrites unambiguous type-position references; it skips declaration sites, non-computed property keys, member-expression properties, and other packages' import specifiers.

Returns `root.toSource()` only when something changed (else `undefined`, so jscodeshift reports the file as unmodified). Covered by `codemods/__tests__/migrate-attachments.test.ts`.
