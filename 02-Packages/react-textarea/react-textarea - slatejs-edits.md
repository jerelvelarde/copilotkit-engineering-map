---
title: react-textarea - slatejs-edits
type: subsystem
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/lib/slatejs-edits/add-autocompletions.ts
  - packages/react-textarea/src/lib/slatejs-edits/clear-autocompletions.ts
  - packages/react-textarea/src/lib/slatejs-edits/replace-text.ts
  - packages/react-textarea/src/lib/slatejs-edits/with-partial-history.ts
  - packages/react-textarea/src/lib/get-text-around-cursor.ts
  - packages/react-textarea/src/lib/editor-to-text.ts
tags: [copilotkit, react-textarea, slate, transforms, history, layer/frontend, type/subsystem, pkg/react-textarea]
---
# react-textarea - slatejs-edits

The low-level Slate plumbing under [[@copilotkit/react-textarea]]. These functions mutate or read the [[react-textarea - Slate editor (useCopilotTextareaEditor)|custom editor]] and are called from [[react-textarea - BaseCopilotTextarea]], [[react-textarea - useAutosuggestions]], and [[react-textarea - HoveringToolbar]].

## Suggestion node transforms (`lib/slatejs-edits/`)

- **`addAutocompletionsToEditor(editor, newSuggestion, point)`** — inserts a `{ type: "suggestion", inline: true, content, children: [{text:""}] }` void node at `point`, then restores the prior cursor selection so the ghost text doesn't move the caret.
- **`clearAutocompletionsFromEditor(editor)`** — walks `Node.nodes(editor)`, collects every `suggestion` element path, and `Transforms.removeNodes` them (guarded by try/catch). Called before inserting a new suggestion and on blur.
- **`replaceEditorText(editor, newText)`** — deletes the whole document range (`Editor.start`→`Editor.end`) and inserts a single `paragraph` with `newText` (skips insertion for empty text to avoid visual glitches). Backs both the controlled-`value` sync and the imperative `ref.value` setter.

## Partial undo history (`with-partial-history.ts`)

`withPartialHistory(editor, shouldSave)` is a fork of slate-history's `withHistory` whose only change is that the **`shouldSave` predicate is injected**. The editor (`useCopilotTextareaEditor`) supplies a predicate that returns `false` for any op touching a `suggestion` node, so ghost completions never enter undo/redo. Exposes `ShouldSaveToHistory` and `defaultShouldSave` (which skips `set_selection`). Standard merge-on-typing and the 100-entry undo cap from upstream are preserved.

## Text extraction (`get-text-around-cursor.ts`)

The bridge between Slate's node tree and the plain strings the AI functions need:
- **`getTextAroundCollapsedCursor(editor): EditorAutocompleteState | null`** — returns `{ cursorPoint, textBeforeCursor, textAfterCursor }` only when the selection is collapsed (used for inline autocomplete).
- **`getTextAroundSelection(editor): EditorTextState | null`** — returns before / selected / after text for a (well-ordered) range; used by the [[react-textarea - HoveringToolbar]] to build `EditingEditorState`.
- **`getFullEditorTextWithNewlines(editor)`** and the shared **`extractTextWithNewlines(editor, range)`** — flatten text nodes, inserting `\n` between `paragraph` blocks. `extractTextWithNewlines` excludes void (`suggestion`) content so ghost text never appears in the extracted value.

## `editor-to-text.ts`

`editorToText(editor)` is a separate flattener used by `TrackerTextEditedSinceLastCursorMovement` (in `BaseCopilotTextarea`) to detect "cursor moved but text unchanged". It drops inline `suggestion` elements and the empty `{text:""}` neighbors Slate inserts around them, then joins blocks with `\n`.
