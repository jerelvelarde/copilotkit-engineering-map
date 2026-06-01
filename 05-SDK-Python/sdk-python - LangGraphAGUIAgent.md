---
title: sdk-python - LangGraphAGUIAgent
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/langgraph_agui_agent.py
tags: [copilotkit, sdk-python, langgraph, ag-ui, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - LangGraphAGUIAgent

The agent class you register for a compiled LangGraph graph. It subclasses **`ag_ui_langgraph.LangGraphAgent`** and emits native [[AG-UI Protocol]] SSE events — so, unlike CrewAI, it does **not** use the [[sdk-python - protocol (RuntimeEvent types)|custom JSON-lines protocol]] or the [[sdk-python - runloop]]. Part of the [[sdk-python - overview]] package; registered via [[sdk-python - CopilotKitRemoteEndpoint & SDK]].

```python
class LangGraphAGUIAgent(LangGraphAgent):
    def __init__(self, *, name: str, graph: CompiledStateGraph,
                 description: Optional[str] = None,
                 config: Union[Optional[RunnableConfig], dict] = None):
        super().__init__(...)
        self.constant_schema_keys += ["copilotkit"]   # never strip the copilotkit state key
```

## What it overrides

- **`_dispatch_event(event)`** — the heart of the class. Translates CopilotKit custom events (from the [[sdk-python - langgraph integration|emit helpers]]) into AG-UI events:
  - `copilotkit_manually_emit_message` → a `TextMessageStart`/`Content`/`End` triple.
  - `copilotkit_manually_emit_tool_call` → a `ToolCallStart`/`Args`/`End` triple (args JSON-stringified if needed).
  - `copilotkit_manually_emit_intermediate_state` → stashes into `active_run["manually_emitted_state"]` and emits a `StateSnapshotEvent`.
  - `copilotkit_exit` → an AG-UI `CustomEvent(name="Exit", value=True)`.
  - **Metadata filtering:** for text/tool events it reads the raw event's `metadata`; if `copilotkit:emit-messages` or `copilotkit:emit-tool-calls` is `False`, it returns `None` to drop the event. (Handles both dict and object `raw_event` shapes — see CopilotKit issue #2066.)
- **`run(input)`** — wraps the parent generator to filter out the `None`s that `_dispatch_event` produces for suppressed events (the base class's `str` return annotation is intentionally violated; `None`s are stripped here before the encoder).
- **`_handle_single_event(event, state)`** — on `on_chat_model_stream`, copies `copilotkit:emit-intermediate-state` metadata into a `predict_state` key so the base class's predict-state machinery fires, then delegates.
- **`langgraph_default_merge_state(state, messages, input)`** — after the base merge, injects a `copilotkit` key built from the AG-UI `tools`/`context` (`actions` + `context`), each item `model_dump()`-ed if Pydantic. This is what surfaces frontend tools to [[sdk-python - CopilotKitMiddleware]].
- **`dict_repr()`** — adds `"type": "langgraph_agui"` to the base representation (so the runtime knows which adapter to use).

## Supporting types

`CustomEventNames` and `LangGraphEventTypes` enums; `PredictStateTool`; aliases `State`, `SchemaKeys`, `TextMessageEvents`, `ToolCallEvents`. Imports `BaseMessage` with a try/except to support both LangChain `<1.0` (`langchain.schema`) and `>=1.0` (`langchain_core.messages`).

## Role

This is the modern, recommended way to serve a LangGraph agent from Python. It is the AG-UI-native counterpart of the v1 runtime's [[runtime - LangGraphAgent (v1)]] and is typically paired with [[sdk-python - CopilotKitMiddleware]] for frontend-tool injection.

## Related

[[sdk-python - overview]] · [[sdk-python - langgraph integration]] · [[sdk-python - CopilotKitMiddleware]] · [[sdk-python - CopilotKitState]] · [[AG-UI Protocol]] · [[runtime - LangGraphAgent (v1)]]
