---
title: react-textarea - Autosuggestions config types
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/types/base/base-autosuggestions-config.tsx
  - packages/react-textarea/src/types/autosuggestions-config/autosuggestions-config.tsx
  - packages/react-textarea/src/types/autosuggestions-config/autosuggestions-config-user-specified.tsx
  - packages/react-textarea/src/types/autosuggestions-config/suggestions-api-config.tsx
  - packages/react-textarea/src/types/autosuggestions-config/insertions-api-config.tsx
  - packages/react-textarea/src/types/autosuggestions-config/editing-api-config.tsx
  - packages/react-textarea/src/types/autosuggestions-config/subtypes/make-system-prompt.ts
  - packages/react-textarea/src/types/base/autosuggestions-bare-function.ts
tags: [copilotkit, react-textarea, config, types, prompts, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - Autosuggestions config types

The configuration layer for [[@copilotkit/react-textarea]]. There are **two tiers**: a low-level config consumed by [[react-textarea - BaseCopilotTextarea]], and a higher-level "chat" config consumed by [[react-textarea - CopilotTextarea]].

## Tier 1 — `BaseAutosuggestionsConfig`

The raw config the base component runs on. Notable fields and their defaults (`defaultBaseAutosuggestionsConfig`):

| field | default | meaning |
|---|---|---|
| `textareaPurpose` | (required) | plain-text purpose injected into prompts |
| `debounceTime` | `250` ms | typing-idle delay before fetching |
| `contextCategories` | `defaultCopilotContextCategories` (from [[@copilotkit/react-core]]) | which readable-context buckets to include |
| `disableWhenEmpty` | `true` | no suggestion on an empty editor |
| `disabled` | `false` | hard off-switch |
| `temporarilyDisableWhenMovingCursorWithoutChangingText` | `true` | suppress after pure cursor moves |
| `temporarilyDisableNotTrustedEvents` | `true` | suppress after non-user (untrusted) changes |
| `shouldAcceptAutosuggestionOnKeyPress` | accept on `Tab` | accept predicate |
| `shouldAcceptAutosuggestionOnTouch` | `() => false` | mobile accept predicate |
| `shouldToggleHoveringEditorOnKeyPress` | `Cmd/Ctrl + shortcut` (uses `isMacOS()` from [[@copilotkit/shared]]) | opens [[react-textarea - HoveringToolbar]] |
| `apiConfig` | (required) | `BaseCopilotTextareaApiConfig` (the two backend functions) |

`apiConfig` shape (`autosuggestions-bare-function.ts`):
```ts
interface BaseCopilotTextareaApiConfig {
  autosuggestionsFunction: AutosuggestionsBareFunction;            // inline completion
  insertionOrEditingFunction: Generator_InsertionOrEditingSuggestion; // hovering editor
}
```

## Tier 2 — `AutosuggestionsConfig` & per-mode chat configs

`AutosuggestionsConfig` is `Omit<BaseAutosuggestionsConfig, "apiConfig">` with `chatApiConfigs` instead — a higher-level abstraction targeting a ChatGPT-style endpoint. It groups three per-mode configs, each carrying a `makeSystemPrompt` and `fewShotMessages`:
- `suggestionsApiConfig: SuggestionsApiConfig` — `{ makeSystemPrompt, fewShotMessages, maxTokens?, stop?, temperature? }`.
- `insertionApiConfig: InsertionsApiConfig` — `{ makeSystemPrompt, fewShotMessages, forwardedParams? }`.
- `editingApiConfig: EditingApiConfig` — `{ makeSystemPrompt, fewShotMessages, forwardedParams? }`.

`defaultAutosuggestionsConfig` spreads the base defaults and plugs in `defaultSuggestionsApiConfig` / `defaultInsertionsApiConfig` / `defaultEditingApiConfig`. Each default ships a writing-assistant system prompt and a few-shot pair (a grocery-store completion plus a legal-clause completion) — used verbatim by [[react-textarea - Insertion engine]] when assembling messages.

```ts
type MakeSystemPrompt = (textareaPurpose: string, contextString: string) => string;
```

## User-facing variant

`AutosuggestionsConfigUserSpecified` is what consumers actually pass to `CopilotTextarea`. It is a deep-partial of `AutosuggestionsConfig` except:
- `textareaPurpose: string` is **mandatory**.
- `chatApiConfigs` accepts only `suggestionsApiConfig?` and `insertionApiConfig?` (both partial); `editingApiConfig` is not user-settable here and is filled from defaults.

`CopilotTextarea` merges this over `defaultAutosuggestionsConfig` with `lodash.merge`.

## Editor-state types (`autosuggestions-bare-function.ts`)

The backend functions receive cursor-relative text slices:
```ts
interface InsertionEditorState { textBeforeCursor: string; textAfterCursor: string }
interface EditingEditorState extends InsertionEditorState { selectedText: string }

type AutosuggestionsBareFunction =
  (state: InsertionEditorState, abort: AbortSignal) => Promise<string>;
type Generator_InsertionOrEditingSuggestion =
  (state: EditingEditorState, prompt: string, documents: DocumentPointer[], abort: AbortSignal)
    => Promise<ReadableStream<string>>;
```
