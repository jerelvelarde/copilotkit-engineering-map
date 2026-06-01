---
title: sdk-python - a2ui helpers
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/a2ui.py
tags: [copilotkit, sdk-python, a2ui, generative-ui, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - a2ui helpers

The `copilotkit.a2ui` module — pure-Python builders for **A2UI v0.9** operations, so a Python agent (typically from inside a LangGraph tool) can emit generative-UI surfaces. Implements the Python producer side of [[A2UI (Generative UI)]]. Part of the [[sdk-python - overview]] package.

```python
from copilotkit import a2ui

schema = a2ui.load_schema("flight_card.json")

@tool
def search_flights(flights: list[Flight]) -> str:
    return a2ui.render([
        a2ui.create_surface("my-surface"),
        a2ui.update_components("my-surface", schema),
        a2ui.update_data_model("my-surface", {"flights": flights}),
    ])
```

## Operation builders

Each returns a `dict` stamped `"version": "v0.9"`:

- **`create_surface(surface_id, catalog_id=BASIC_CATALOG_ID)`** → `createSurface`. `BASIC_CATALOG_ID = "https://a2ui.org/specification/v0_9/basic_catalog.json"`.
- **`update_components(surface_id, components)`** → `updateComponents` — the component tree.
- **`update_data_model(surface_id, data, path="/")`** → `updateDataModel` — writes a plain JSON value at `path`.
- **`load_schema(path)`** — reads a component schema list from a JSON file.

## `render(operations) -> str`

Wraps the operations list under the container key `A2UI_OPERATIONS_KEY = "a2ui_operations"` and `json.dumps`-es it. Returning this string from a tool is the signal the frontend [[A2UI (Generative UI)|A2UI renderer]] uses to detect and apply the operations.

## Dynamic-generation prompt builder

For agents that *generate* A2UI JSON with an LLM rather than emitting fixed schema:

- **`a2ui_prompt(component_schema, generation_guidelines=DEFAULT_GENERATION_GUIDELINES, design_guidelines=DEFAULT_DESIGN_GUIDELINES)`** — assembles a system prompt from generation rules + design rules + the available-components schema. The agent reads its component schema from `state["ag-ui"]["a2ui_schema"]`.
- **`DEFAULT_GENERATION_GUIDELINES`** encodes the hard constraints: exactly one component with `id="root"`, unique ids, the child/children tree must be a DAG (no self-references), relative paths inside `List` templates vs absolute paths elsewhere, and the rule that `{ "path": ... }` binding is only legal on properties whose schema declares path support (otherwise inline literals — using path on a non-path property crashes the renderer).
- **`DEFAULT_DESIGN_GUIDELINES`** encodes visual conventions (heading hierarchy, `Row`/`Column` `justify`/`align`, `Button` action shape `{ event: { name, context } }`, form path-binding patterns, image URL guidance).

## Related

[[sdk-python - overview]] · [[A2UI (Generative UI)]] · [[sdk-python - langgraph integration]]
