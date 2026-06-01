---
title: react-textarea - Slate editor (useCopilotTextareaEditor)
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/hooks/base-copilot-textarea-implementation/use-copilot-textarea-editor.tsx
  - packages/react-textarea/src/types/base/custom-editor.tsx
  - packages/react-textarea/src/hooks/base-copilot-textarea-implementation/use-populate-copilot-textarea-ref.ts
tags: [copilotkit, react-textarea, slate, editor, hook, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - Slate editor (useCopilotTextareaEditor)

The Slate editor factory at the heart of [[react-textarea - BaseCopilotTextarea]]. `useCopilotTextareaEditor(): CustomEditor` memoizes one editor for the component's lifetime, composing `withReact` + `withPartialHistory` (see [[react-textarea - slatejs-edits]]) and teaching Slate about a custom `suggestion` node.

```ts
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;
```

## The `suggestion` node

Inline AI completions are rendered as a dedicated Slate element so they live in the document tree without being part of the "real" text:

```ts
export type ParagraphElement  = { type: "paragraph";  children: CustomText[] };
export type SuggestionElement = { type: "suggestion"; inline: boolean; content: string; children: CustomText[] };
export type CustomText = { text: string };
```

The editor overrides three methods so a `suggestion` element behaves as an **inline void**:
- `isVoid(el)` → `true` for `suggestion` (no editable children).
- `markableVoid(el)` → `true` for `suggestion`.
- `isInline(el)` → `element.inline` for `suggestion` (so it flows inside the paragraph).

Suggestion content is shown by the `renderElement` function (`render-element.tsx`) as a non-editable `<span>` styled with `suggestionsStyle`; the text it displays is `element.content`, not editor text.

## History exclusion

The editor is created with a custom `shouldSave` predicate passed to `withPartialHistory`. It returns `false` for any operation (`insert_node`, `remove_node`, `set_node`, `merge_node`, `split_node`) that touches a `suggestion` node, so **adding/removing ghost completions never pollutes undo/redo**. All other ops fall through to `defaultShouldSave` (which skips `set_selection`).

## Imperative ref bridge — `usePopulateCopilotTextareaRef`

`usePopulateCopilotTextareaRef(editor, ref)` (`use-populate-copilot-textarea-ref.ts`) wires `useImperativeHandle` to a `Proxy` over the live DOM node (`ReactEditor.toDOMNode`). The proxy resolves custom methods first, then falls through to real `HTMLElement` members:
- `focus()` → `ReactEditor.focus(editor)`
- `blur()` → `ReactEditor.blur(editor)`
- `get value` → `getFullEditorTextWithNewlines(editor)`
- `set value` → `replaceEditorText(editor, value)`

This is what makes the component satisfy the `HTMLCopilotTextAreaElement` ref contract used by [[react-textarea - CopilotTextarea]].
