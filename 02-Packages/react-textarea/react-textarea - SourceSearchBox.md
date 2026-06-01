---
title: react-textarea - SourceSearchBox
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/components/source-search-box/source-search-box.tsx
  - packages/react-textarea/src/components/hovering-toolbar/text-insertion-prompt-box/included-files-preview.tsx
tags: [copilotkit, react-textarea, component, mentions, context, documents, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - SourceSearchBox

The `@`-mention document picker shown inside the [[react-textarea - HoveringToolbar]] prompt box. It lets the user attach **document context** (`DocumentPointer` from [[@copilotkit/react-core]]) to an insert/edit request so the model can ground its rewrite on external sources.

```ts
interface SourceSearchBoxProps {
  searchTerm: string;                                  // text after the "@"
  suggestedFiles: DocumentPointer[];                   // from getDocumentsContext(contextCategories)
  onSelectedFile: (filePointer: DocumentPointer) => void;
}
```

## Behavior

- Built on `cmdk` (`Command`, `CommandList`, `CommandItem`, …, re-exported from `components/ui/command.tsx`). The visible `CommandInput` is hidden (`className="… hidden"`); filtering is driven externally by the typed `@token`.
- The custom `filter(value, search)` shows a file when `searchTerm` is empty or when the file's `value` (its `name`) **starts with** `searchTerm`; otherwise it is hidden.
- Each suggested file renders under an "Available resources" group as a `CommandItem` showing `filePointer.iconImageUri` (via the small local `Logo` wrapper) and `filePointer.name`. Selecting it fires `onSelectedFile`.

## Integration

`HoveringInsertionPromptBoxCore` derives `searchTerm` from the last whitespace-delimited word of the adjustment prompt when it begins with `@`. On selection it:
1. removes the `@token` from the prompt,
2. appends the chosen `DocumentPointer` to `filePointers`,
3. refocuses the prompt textarea.

The accumulated `filePointers` are previewed by **`IncludedFilesPreview`** (`included-files-preview.tsx`) as removable MUI `Chip`s (each with an `Avatar` from the file's icon), and are passed as the `documents` argument into the [[react-textarea - Insertion engine]] editing call, where `getContextString(documents, contextCategories)` folds them into the system prompt. Related concept: [[Context]].
