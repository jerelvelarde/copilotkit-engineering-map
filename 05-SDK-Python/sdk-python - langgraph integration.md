---
title: sdk-python - langgraph integration
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/langgraph.py
  - sdk-python/copilotkit/langchain.py
tags: [copilotkit, sdk-python, langgraph, langchain, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - langgraph integration

The `copilotkit.langgraph` module — utilities you call from **inside** LangGraph nodes to control what CopilotKit streams, emit intermediate updates, and raise human-in-the-loop interrupts. This is the Python mirror of the JS [[@copilotkit/sdk-js|sdk-js]] langgraph utilities. Part of the [[sdk-python - overview]] package.

> `copilotkit.langchain` is a thin **deprecated** shim that re-exports every symbol below from `copilotkit.langgraph` and warns on import.

## State types (also exported as [[sdk-python - CopilotKitState]])

```python
class CopilotContextItem(TypedDict): description: str; value: Any
class CopilotKitProperties(TypedDict):
    actions: List[Any]; context: List[CopilotContextItem]
    intercepted_tool_calls: Any         # private, used by CopilotKitMiddleware
    original_ai_message_id: Any         # private
class CopilotKitState(MessagesState):
    copilotkit: CopilotKitProperties
```

## `copilotkit_customize_config(base_config=None, *, emit_messages=None, emit_tool_calls=None, emit_intermediate_state=None, emit_all=None)`

Returns a `RunnableConfig` with CopilotKit flags written into `metadata`:

- `copilotkit:emit-messages` (bool) and `copilotkit:emit-tool-calls` (bool | str | List[str]) — toggle/whitelist what streams to the UI.
- `copilotkit:emit-intermediate-state` — list of `IntermediateStateConfig` (`state_key`, `tool`, `tool_argument?`), enabling predict-state streaming of tool args. See [[sdk-python - LangGraphAGUIAgent]] (which reads this metadata in `_handle_single_event` and re-keys it to `predict_state`).
- `emit_all` is **deprecated** (warns); CopilotKit now emits everything by default.

## Emit helpers (`adispatch_custom_event` → consumed by LangGraphAGUIAgent)

Each dispatches a LangChain custom event and `await asyncio.sleep(0.02)`; the matching `CustomEventNames` are handled in [[sdk-python - LangGraphAGUIAgent]]`._dispatch_event`:

- `copilotkit_exit(config)` → `"copilotkit_exit"` — signals the agent to stop *after* the current run.
- `copilotkit_emit_state(config, state)` → `"copilotkit_manually_emit_intermediate_state"`.
- `copilotkit_emit_message(config, message)` → `"copilotkit_manually_emit_message"` (generates a uuid message id, role `assistant`).
- `copilotkit_emit_tool_call(config, *, name, args)` → `"copilotkit_manually_emit_tool_call"`.

## `copilotkit_interrupt(message=None, action=None, args=None)`

Wraps LangGraph's `interrupt(...)`. Requires `message` **or** `action` (else `ValueError`). Builds an `AIMessage` (plain content for `message`, or an empty-content message carrying a synthetic tool call for `action`) and interrupts with a payload keyed `__copilotkit_interrupt_value__` and `__copilotkit_messages__`. Normalizes the resume value (str / dict→json / list→last `.content`) and returns `(answer, raw_response)`. This is the backend half of [[sdk-python - CopilotKitState|human-in-the-loop]] / the runtime's `LangGraphInterruptEvent`.

## `langchain_messages_to_copilotkit(messages) -> List[Message]`

Converts LangChain `BaseMessage`s to CopilotKit [[sdk-python - types & exceptions|Message]] dicts. Notable behaviors verified in source:

- Flattens list/dict content (e.g. Anthropic content blocks) by concatenating all `text` parts — not just the first.
- **Always** emits the assistant message even when content is empty, so tool calls (split into separate messages referencing it via `parentMessageId`) are not orphaned.
- `ToolMessage`s become result messages and are **reordered** to sit immediately after their originating tool call; resolves the action name from the AI message's tool-call map.

## Related

[[sdk-python - overview]] · [[sdk-python - CopilotKitState]] · [[sdk-python - LangGraphAGUIAgent]] · [[sdk-python - CopilotKitMiddleware]] · [[@copilotkit/sdk-js]] · [[AG-UI Protocol]]
