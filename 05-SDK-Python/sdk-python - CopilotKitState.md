---
title: sdk-python - CopilotKitState
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/langgraph.py
tags: [copilotkit, sdk-python, langgraph, state, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - CopilotKitState

The shared LangGraph state schema for CopilotKit agents — a `MessagesState` subclass that carries a `copilotkit` key holding frontend `actions` and `context`. Exported from the package root and from `copilotkit.langgraph`. Part of the [[sdk-python - overview]] package.

```python
from langgraph.graph import MessagesState

class CopilotContextItem(TypedDict):
    description: str
    value: Any

class CopilotKitProperties(TypedDict):
    actions: List[Any]                  # frontend tool definitions
    context: List[CopilotContextItem]   # readable app context
    intercepted_tool_calls: Any         # private: set by CopilotKitMiddleware.after_model
    original_ai_message_id: Any         # private: restore target for after_agent

class CopilotKitState(MessagesState):
    copilotkit: CopilotKitProperties
```

## Usage

Subclass it to add your own state, then use it as a node's annotation:

```python
class MyState(CopilotKitState):
    documents: list

def my_node(state: MyState, config: RunnableConfig):
    actions = state["copilotkit"]["actions"]   # frontend tools, if any
    ...
```

`MessagesState` provides the `messages` channel with the `add_messages` reducer. The `copilotkit.actions` list is populated by [[sdk-python - LangGraphAGUIAgent]]`.langgraph_default_merge_state` (from the AG-UI `tools`) and consumed by [[sdk-python - CopilotKitMiddleware]] to inject frontend [[Tools (Frontend & Backend)|tools]] into the model call. The two private keys are the bookkeeping slots the middleware uses to intercept frontend tool calls in `after_model` and restore them in `after_agent`.

## Name collision warning

There is a **separate, unrelated** `CopilotKitState`/`CopilotKitProperties` pair in the CrewAI subpackage (a `crewai.flow.FlowState` subclass, documented in [[sdk-python - crewai integration]]). They are not interchangeable — this one is the LangGraph `MessagesState` variant.

## Related

[[sdk-python - overview]] · [[sdk-python - langgraph integration]] · [[sdk-python - CopilotKitMiddleware]] · [[sdk-python - LangGraphAGUIAgent]] · [[Context]] · [[Tools (Frontend & Backend)]]
