---
title: react-textarea - useAutosuggestions
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/hooks/base-copilot-textarea-implementation/use-autosuggestions.ts
  - packages/react-textarea/src/lib/debouncer.ts
  - packages/react-textarea/src/types/base/autosuggestion-state.ts
  - packages/react-textarea/src/types/base/editor-autocomplete-state.ts
tags: [copilotkit, react-textarea, hook, autocomplete, debounce, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - useAutosuggestions

The inline-completion state machine used by [[react-textarea - BaseCopilotTextarea]]. It owns the lifecycle of the **ghost suggestion** shown ahead of the cursor: when to fetch one, when to accept it, and when to abort.

```ts
function useAutosuggestions(
  debounceTime: number,
  shouldAcceptAutosuggestionOnKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => boolean,
  shouldAcceptAutosuggestionOnTouch:   (e: React.TouchEvent<HTMLDivElement>) => boolean,
  autosuggestionFunction: AutosuggestionsBareFunction,
  insertAutocompleteSuggestion: (s: AutosuggestionState) => void,
  disableWhenEmpty: boolean,
  disabled: boolean,
): UseAutosuggestionsResult
```

Returns `{ currentAutocompleteSuggestion, onChangeHandler, onKeyDownHandler, onTouchStartHandler }`.

## Flow

1. **On change** (`onChangeHandler(newEditorState)`): compares the incoming `EditorAutocompleteState` against the previous one via `areEqual_autocompleteState` (offset + path + before/after text) wrapped in `nullableCompatibleEqualityCheck`. If unchanged → no-op. If changed → clears the current suggestion and schedules a fetch through the `Debouncer` (below).
2. **Fetch** (`awaitForAndAppendSuggestion`): early-returns when `disabled`, or when `disableWhenEmpty` and both before/after text are empty. Otherwise awaits `autosuggestionFunction(editorState, abortSignal)`; if the result is empty or the signal aborted it throws `DOMException("Aborted")`. On success it sets `currentAutocompleteSuggestion = { text, point: cursorPoint }`.
3. **Accept** (`onKeyDownHandler` / `onTouchStartHandler`, same `keyDownOrTouchHandler`): if a suggestion exists and the configured accept predicate returns true (default: `Tab` key; touch off by default), it `preventDefault()`s, calls `insertAutocompleteSuggestion`, and clears the suggestion.

## Supporting pieces

- **`AutosuggestionState`** = `{ text: string; point: BasePoint }` — the pending completion and where it anchors.
- **`EditorAutocompleteState`** = `{ cursorPoint: BasePoint; textBeforeCursor: string; textAfterCursor: string }` plus the `areEqual_autocompleteState` comparator.
- **`Debouncer<T>`** (`lib/debouncer.ts`): wraps `setTimeout` + an `AbortController`. `debounce(fn, ...args)` cancels any in-flight call (aborting its signal) before scheduling a new one; `cancel()` aborts and clears. The unmount/disable cleanup effect calls `cancel()` and nulls the suggestion.

The `autosuggestionFunction` is the `AutosuggestionsBareFunction` produced by [[react-textarea - Insertion engine]] and passed in via `apiConfig.autosuggestionsFunction`.
