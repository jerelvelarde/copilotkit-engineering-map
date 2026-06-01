---
title: react-textarea - HoveringToolbar
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/components/hovering-toolbar/hovering-toolbar.tsx
  - packages/react-textarea/src/components/hovering-toolbar/hovering-editor-provider.tsx
  - packages/react-textarea/src/components/hovering-toolbar/hovering-toolbar-components.tsx
  - packages/react-textarea/src/components/hovering-toolbar/text-insertion-prompt-box/hovering-insertion-prompt-box.tsx
  - packages/react-textarea/src/components/hovering-toolbar/text-insertion-prompt-box/hovering-insertion-prompt-box-core.tsx
  - packages/react-textarea/src/components/hovering-toolbar/text-insertion-prompt-box/included-files-preview.tsx
  - packages/react-textarea/src/hooks/misc/use-autosize-textarea.tsx
tags: [copilotkit, react-textarea, component, hovering-editor, insertion, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - HoveringToolbar

The floating editor that pops over [[react-textarea - BaseCopilotTextarea]] (default `Cmd/Ctrl + K`) and lets the user **insert** new text or **rewrite** the current selection from a natural-language prompt. It drives the `insertionOrEditingFunction` half of the [[react-textarea - Insertion engine]].

## Provider & visibility

`HoveringEditorProvider` (`hovering-editor-provider.tsx`) exposes a tiny context `{ isDisplayed, setIsDisplayed }` via `useHoveringEditorContext`. `BaseCopilotTextarea` wraps its core in this provider; the `Cmd/Ctrl+K` keybinding (`shouldToggleHoveringEditorOnKeyPress`, see [[react-textarea - Autosuggestions config types]]) toggles `isDisplayed`. While the toolbar is open, inline autosuggestions are suppressed.

## `HoveringToolbar`

Props: `{ apiConfig: InsertionEditorApiConfig; contextCategories: string[]; hoverMenuClassname?: string }`.

- Renders only on the client (`isClient` effect) and only when `isDisplayed` and there is a Slate `selection`.
- Positions itself with `useLayoutEffect` using the DOM selection's `getBoundingClientRect()`: placed below the selection, flipped above when it would overflow the viewport bottom, and clamped horizontally. A `(0,0,0,0)` rect is treated as "selection is inside the popup itself" and ignored.
- Dismisses on outside `mousedown` and on `Escape` (the document-level Escape handler also re-focuses the editor via `ReactEditor.focus`).
- Renders through a `Portal` (to `document.body`) into a `Menu` (both from `hovering-toolbar-components.tsx`, which also exports emotion-styled `Button`, `Icon`, `Toolbar`).
- Computes the `EditingEditorState` from `getTextAroundSelection` (see [[react-textarea - slatejs-edits]]) and passes a `performInsertion` callback that deletes the selection and `Transforms.insertText`s the accepted text, then closes the toolbar.

## `HoveringInsertionPromptBox` / `…Core`

`HoveringInsertionPromptBox` is a styled shell around `HoveringInsertionPromptBoxCore`, which holds the real UI state:
- An **adjustment prompt** textarea (autosized via `useAutosizeTextArea`). `Enter` submits, `Shift+Enter` inserts a newline, `Escape` closes.
- On submit, `beginGeneratingAdjustment` calls the `insertionOrEditingFunction` (reusing the current suggestion as `selectedText` for iterative refinement), flattens the returned `Promise<ReadableStream>` with `streamPromiseFlatten`, and stores it.
- A reader effect streams tokens into the **suggestion** textarea, auto-scrolling and showing a spinner while loading; the reader lock is released on unmount.
- An **Insert** button calls `performInsertion(editSuggestion)`.
- **`@`-mentions:** when the last word of the prompt starts with `@`, it renders [[react-textarea - SourceSearchBox]]; selecting a file strips the `@token`, pushes a `DocumentPointer` into `filePointers`, and shows them via `IncludedFilesPreview` (MUI `Chip`s, removable). The selected `filePointers` are passed into the editing call so the document context reaches the prompt.

`useAutosizeTextArea(ref, value)` (`hooks/misc/use-autosize-textarea.tsx`) resets a textarea's height to `0` then to `scrollHeight` on every value change to grow it to fit content.
