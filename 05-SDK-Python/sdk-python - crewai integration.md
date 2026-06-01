---
title: sdk-python - crewai integration
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/crewai/__init__.py
  - sdk-python/copilotkit/crewai/crewai_agent.py
  - sdk-python/copilotkit/crewai/crewai_sdk.py
  - sdk-python/copilotkit/crewai/copilotkit_integration.py
tags: [copilotkit, sdk-python, crewai, agent, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - crewai integration

The optional `copilotkit.crewai` subpackage (install via the `crewai` extra). Serves CrewAI **Crews** and **Flows** as CopilotKit agents over the legacy [[sdk-python - protocol (RuntimeEvent types)|JSON-lines protocol]], pumped by the [[sdk-python - runloop]]. Part of the [[sdk-python - overview]] package; registered via [[sdk-python - CopilotKitRemoteEndpoint & SDK]].

## `CrewAIAgent` (`crewai_agent.py`)

Subclass of the abstract [[sdk-python - Action/Agent/Parameter|Agent]]. Requires exactly one of `crew=` or `flow=` (XOR-validated in `__init__`); optional `description` and `copilotkit_config` (`{ merge_state: Callable }`).

- **`execute(...)`** — `deepcopy`s the crew/flow and dispatches to `execute_crew` or `execute_flow`.
- **`execute_crew(...)`** — wraps the crew in a `ChatWithCrewFlow` (see below) and delegates to `execute_flow`.
- **`execute_flow(...)`** — the streaming core. Generates a `run_id`, converts messages via `copilotkit_messages_to_crewai_flow`, merges state (`crewai_flow_default_merge_state` by default), builds a `CopilotKitRunExecution`, then `async for event in copilotkit_run(fn=lambda: crewai_flow_async_runner(flow, ...), execution=...)` yielding each. Finally emits a closing `agent_state_message` (`active=False`, `running` = not `should_exit`) with the flow's final state.
- **`get_state(thread_id)`** — if the flow has `_persistence`, loads stored state and converts messages back via `crewai_flow_messages_to_copilotkit`; otherwise returns an empty `threadExists: False` snapshot.
- **`dict_repr()`** — adds `"type": "crewai"`.

`ChatWithCrewFlow` is a generated `Flow` that bridges a `Crew` to chat: it builds a system message and tool schema from `crewai.cli.crew_chat` helpers, runs the LLM with `copilotkit_stream`, and on a tool call either invokes the crew (`crew_function`) or the synthetic `CREW_EXIT_TOOL` (calling `copilotkit_exit`). A module-level `_CREW_INPUTS_CACHE` memoizes generated chat inputs by `cache_key`.

`crewai_flow_default_merge_state(...)` drops a leading system message, wraps actions in OpenAI `{type:"function", function:{...}}` shape under `copilotkit.actions`, and merges `messages` into state. `filter_state(...)` strips `messages`/`id`.

## CrewAI SDK helpers (`crewai_sdk.py`)

The CrewAI analogue of [[sdk-python - langgraph integration]] — but these talk to the [[sdk-python - runloop]] queue via `queue_put`, not LangChain custom events:

- **State types:** `CopilotKitProperties(BaseModel)` (`actions`) and `CopilotKitState(FlowState)` (`messages`, `copilotkit`). **Distinct** from the LangGraph [[sdk-python - CopilotKitState]] despite the shared names.
- **`crewai_flow_async_runner(flow, inputs)`** — subscribes to the CrewAI event bus (`FlowStarted` → `RunStarted`, `MethodExecutionStarted/Finished` → `NodeStarted/Finished`, `FlowFinished` → `RunFinished`) and forwards each into the queue with `priority=True`; runs `flow.kickoff_async`, emitting `RunError` on exception. Imports flow-event classes with a try/except across two CrewAI module layouts.
- **`copilotkit_emit_state(state)` / `copilotkit_emit_message(message)` / `copilotkit_emit_tool_call(*, name, args)`** — enqueue the corresponding [[sdk-python - protocol (RuntimeEvent types)|protocol]] events using the active execution context (`get_context_execution`). No `config` argument (unlike the LangGraph helpers).
- **`copilotkit_exit()`** → enqueues a `meta_event(EXIT, True)`. **`copilotkit_predict_state(config)`** → enqueues `meta_event(PREDICT_STATE, config)`.
- **`copilotkit_stream(response)`** — streams a LiteLLM `completion(..., stream=True)`. For a `CustomStreamWrapper` it walks chunks, emitting text-message or action-execution start/args/end events and reassembling a final `ModelResponse` (so the flow code still gets a normal completion object).
- **Message converters:** `copilotkit_messages_to_crewai_flow` and `crewai_flow_messages_to_copilotkit` (mirror the LangGraph converters: split/reorder tool calls and results, always emit the assistant message even when empty).

## Standalone mixin (`copilotkit_integration.py`)

A self-contained helper set (used by some demo/example flows) for driving CopilotKit-style tool calls through a generic CrewAI `Flow`, independent of `CrewAIAgent`:

- **`CopilotKitFlow(Flow[S], Generic[S])`** — overrides `kickoff` to capture `inputs["tools"]`, plus helpers `get_message_history` (prefers persisted `conversation_history`), `get_available_tools`, `format_tools_for_llm` (→ OpenAI tool schema + proxy functions), `handle_tool_responses` (follow-up LLM call when tools ran but produced no prose), `get_tools_summary`.
- **`create_tool_proxy(tool_name)`** — returns a function that emits a `CopilotKitToolCallEvent` on the CrewAI event bus and logs into the module-level `tool_calls_log`.
- **Events:** `CopilotKitToolCallEvent` (`copilotkit_frontend_tool_call`), `CopilotKitStateUpdateEvent` (`copilotkit_state_update`); `emit_copilotkit_state_update_event(tool_name, args)` and `register_tool_call_listener()` to wire bus listeners. `FlowInputState` is a `BaseModel` describing the expected input (`messages`, `tools`, `conversation_history`).

> Note: `copilotkit_integration.py` contains a stray editor-generated comment referencing a contributor's local Downloads path — cosmetic only.

## Related

[[sdk-python - overview]] · [[sdk-python - runloop]] · [[sdk-python - protocol (RuntimeEvent types)]] · [[sdk-python - Action/Agent/Parameter]] · [[sdk-python - CopilotKitRemoteEndpoint & SDK]] · [[Multi-Agent]]
