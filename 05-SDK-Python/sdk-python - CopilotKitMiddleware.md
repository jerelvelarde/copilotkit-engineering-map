---
title: sdk-python - CopilotKitMiddleware
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/copilotkit_lg_middleware.py
tags: [copilotkit, sdk-python, langgraph, middleware, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - CopilotKitMiddleware

A LangGraph **`AgentMiddleware`** (the LangGraph 1.0 `create_agent` middleware style) that makes any prebuilt-or-custom LangGraph agent CopilotKit-aware. Implements [[Middleware]] on the Python agent side. Part of the [[sdk-python - overview]] package; works alongside [[sdk-python - LangGraphAGUIAgent]].

```python
from langgraph.prebuilt import create_agent
from copilotkit import CopilotKitMiddleware

agent = create_agent(model="openai:gpt-4o", tools=[backend_tool],
                     middleware=[CopilotKitMiddleware()])
```

```python
class StateSchema(AgentState):
    copilotkit: CopilotKitProperties          # from copilotkit.langgraph

class CopilotKitMiddleware(AgentMiddleware[StateSchema, Any]):
    def __init__(self, *, expose_state: Union[bool, Iterable[str]] = False): ...
```

## Responsibilities (by lifecycle hook)

- **`wrap_model_call` / `awrap_model_call`** — before each model call: install the [[sdk-python - header_propagation|httpx header hook]] on the model client (`_ensure_httpx_hook`), optionally append a state note (see `expose_state`), and **merge frontend tools** from `state["copilotkit"]["actions"]` into `request.tools`. The async variant additionally runs `_fix_messages_for_bedrock` first.
- **`before_agent` / `abefore_agent`** — injects an `App Context:\n{...}` `SystemMessage` built from `state["copilotkit"]["context"]` (or `runtime.context`). Inserts right after the first system/developer message, or replaces an existing context message **in place** by reusing its id (so the `add_messages` reducer updates rather than appends a duplicate).
- **`after_model` / `aafter_model`** — **intercepts frontend tool calls.** Splits the last AIMessage's `tool_calls` into backend vs frontend (by name against `state["copilotkit"]["actions"]`), rewrites the AIMessage to keep only backend calls, and stashes the frontend ones in `copilotkit.intercepted_tool_calls` (+ `original_ai_message_id`). This prevents LangGraph's `ToolNode` from trying to execute tools that only exist on the frontend.
- **`after_agent` / `aafter_agent`** — **restores** the intercepted frontend tool calls back onto the original AIMessage before the agent exits, so the frontend sees them and can execute/render them. Clears the stash.

## `expose_state` — surfacing user state to the LLM

Controls `_build_state_note` / `_apply_state_note` (appended to `request.system_message` as `Current agent state:\n{json}`):

- `False` (default) — never surface state (avoids leaking arbitrary state into prompts).
- `True` — serialize every non-reserved, non-underscore key with a non-empty value.
- `list`/`tuple`/`set[str]` — only the named keys.

Reserved keys never surfaced: `_RESERVED_STATE_KEYS = {messages, copilotkit, ag-ui, tools, structured_response, thread_id, remaining_steps}`.

## `_fix_messages_for_bedrock(messages)` (static)

Repairs the checkpoint message list before sending to AWS Bedrock's Converse API, undoing artifacts of CopilotKit's intercept/restore dance. Five passes, in order:

1. **Deduplicate `ToolMessage`s by `tool_call_id`** — `patch_orphan_tool_calls` injects "…was interrupted before completion." placeholders with fresh random ids on every checkpoint load; this keeps the real result (moving it into the placeholder's adjacent position) and drops duplicates. Matched via `_INTERRUPTED_PAT` regex.
2. **Sync `content` tool_use blocks with `tool_calls`** — strip `tool_use` blocks not present in `msg.tool_calls` (or all of them when there are no tool calls).
3. **Strip unanswered `tool_calls`** — only ToolMessages *immediately adjacent* to the AIMessage count as answers (Bedrock requires the toolResult turn right after the assistant turn); unanswered calls and their content blocks are removed.
4. **Coerce string args/input to dicts** — `tc["args"]` and `tool_use` `input` parsed from JSON (or `{}` on failure / `None`).
5. **Remove orphan ToolMessages** whose `tool_call_id` no longer matches any remaining tool call.

This logic is Bedrock-specific and is the reason the async path differs from the sync path.

## Related

[[sdk-python - overview]] · [[sdk-python - CopilotKitState]] · [[sdk-python - langgraph integration]] · [[sdk-python - header_propagation]] · [[sdk-python - LangGraphAGUIAgent]] · [[Middleware]] · [[Tools (Frontend & Backend)]]
