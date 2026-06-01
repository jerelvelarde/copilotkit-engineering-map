---
title: react-textarea - CopilotTextarea
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/components/copilot-textarea/copilot-textarea.tsx
tags: [copilotkit, react-textarea, component, autocomplete, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - CopilotTextarea

The public, batteries-included component of [[@copilotkit/react-textarea]]. It is a `forwardRef` wrapper around [[react-textarea - BaseCopilotTextarea]] that supplies the **standard, runtime-backed** suggestion and insertion functions, so consumers only have to describe the textarea's purpose.

```tsx
export interface CopilotTextareaProps
  extends Omit<BaseCopilotTextareaProps, "baseAutosuggestionsConfig"> {
  autosuggestionsConfig: AutosuggestionsConfigUserSpecified; // textareaPurpose required
}

export const CopilotTextarea = React.forwardRef<HTMLCopilotTextAreaElement, CopilotTextareaProps>(...)
```

**What it does:**
1. Splits `autosuggestionsConfig` off the forwarded props and merges it over `defaultAutosuggestionsConfig` with `lodash.merge` (see [[react-textarea - Autosuggestions config types]]).
2. Builds the inline-completion function via `useMakeStandardAutosuggestionFunction` and the insert/edit function via `useMakeStandardInsertionOrEditingFunction` (both from [[react-textarea - Insertion engine]]).
3. Renders `<BaseCopilotTextarea>` with a `baseAutosuggestionsConfig.apiConfig` of `{ autosuggestionsFunction, insertionOrEditingFunction }`.

**Key props** (the rest are forwarded to the underlying editable `<div>`):
- `autosuggestionsConfig: { textareaPurpose, chatApiConfigs: { suggestionsApiConfig?, insertionApiConfig? }, ... }` — `textareaPurpose` is mandatory; everything else is partial and merged over defaults.
- `value` / `onValueChange` — controlled text (plain string).
- `onChange` — receives a synthetic `React.ChangeEvent<HTMLTextAreaElement>` whose `target.value` is the text (a "semi-fake" event built in `BaseCopilotTextarea`).
- `disableBranding`, `placeholderStyle`, `suggestionsStyle`, `hoverMenuClassname`, `shortcut` (default `"k"` for `Cmd/Ctrl+K`).

Drop-in usage requires the stylesheet: `import "@copilotkit/react-textarea/styles.css"`. The component reads page context through the V1 [[@copilotkit/react-core]] context, so it must be rendered inside a CopilotKit V1 provider. See the parent [[@copilotkit/react-textarea]] overview for the note that the underlying model call is currently stubbed.
