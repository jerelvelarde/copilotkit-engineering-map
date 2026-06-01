---
title: react-textarea - BaseCopilotTextarea
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/components/base-copilot-textarea/base-copilot-textarea.tsx
  - packages/react-textarea/src/types/base/base-copilot-textarea-props.tsx
  - packages/react-textarea/src/types/html-copilot-textarea-element.ts
tags: [copilotkit, react-textarea, component, slate, headless, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - BaseCopilotTextarea

The headless UX shell of [[@copilotkit/react-textarea]] — "the basic UX component, without the business logic / AI logic." Use it directly when you want to bring your own backend: you pass the raw `autosuggestionsFunction` and `insertionOrEditingFunction` yourself instead of the runtime-backed ones that [[react-textarea - CopilotTextarea]] supplies.

It is **not** a real `<textarea>`. It renders a [[react-textarea - Slate editor (useCopilotTextareaEditor)]] inside a `<Slate>`/`<Editable>` pair, and exposes a `ref` of type `HTMLCopilotTextAreaElement` (a minimal `HTMLElement` subset: `value`, `focus()`, `blur()`).

## Structure

`BaseCopilotTextarea` wraps the real implementation in a [[react-textarea - HoveringToolbar]] provider:

```tsx
BaseCopilotTextarea
  └─ <HoveringEditorProvider>
       └─ BaseCopilotTextareaWithHoveringContext   // the private core
```

The core component:
- Merges `props.baseAutosuggestionsConfig` over `defaultBaseAutosuggestionsConfig` ([[react-textarea - Autosuggestions config types]]).
- Tracks `lastKnownFullEditorText`, `cursorMovedSinceLastTextChange`, `isUserInputActive` to compute `shouldDisableAutosuggestions`.
- Calls [[react-textarea - useAutosuggestions]] to get `currentAutocompleteSuggestion` + the change/keydown/touch handlers, and syncs the suggestion into the editor via `addAutocompletionsToEditor` / `clearAutocompletionsFromEditor` (see [[react-textarea - slatejs-edits]]).
- Renders `<TrackerTextEditedSinceLastCursorMovement>`, `<HoveringToolbar>`, and `<Editable>` with memoized `renderElement` / `renderPlaceholder`.

## `BaseCopilotTextareaProps`

Extends `Omit<TextareaHTMLAttributes<HTMLDivElement>, "onChange">` plus:
- `baseAutosuggestionsConfig: Partial<BaseAutosuggestionsConfig> & { textareaPurpose: string; apiConfig: BaseCopilotTextareaApiConfig }` — the only required prop; `apiConfig` carries the two backend functions.
- `value?`, `onValueChange?(value)`, `onChange?(ChangeEvent)`, `disableBranding?`, `placeholderStyle?`, `suggestionsStyle?`, `hoverMenuClassname?`, `shortcut?`.

## Notable behaviors

- **Controlled value sync:** an effect replaces the editor's text via `replaceEditorText` only when `props.value` changes from outside.
- **`onChange` shim:** `makeSemiFakeReactTextAreaEvent` fabricates a `React.ChangeEvent<HTMLTextAreaElement>` carrying `{ target: { value } }` so consumers expecting the standard textarea `onChange` keep working. Only `event.target.value` is reliable.
- **Branding:** `useAddBrandingCss` injects a `::after` "CopilotKit" badge unless `disableBranding`; the class list is `copilot-textarea {with-branding|no-branding} ...` merged with the user `className`.
- **Imperative ref:** `usePopulateCopilotTextareaRef` installs a `Proxy` that exposes `value`/`focus`/`blur` over the live Slate DOM node (see [[react-textarea - slatejs-edits]] for the text helpers it uses).

The `HTMLCopilotTextAreaElement` interface is also re-declared in `types/html-copilot-textarea-element.ts` (identical shape) and used as the `ref` type across both components.
