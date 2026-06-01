---
title: sdk-python - fastapi integration
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/integrations/fastapi.py
tags: [copilotkit, sdk-python, fastapi, http, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - fastapi integration

The `copilotkit.integrations.fastapi` module — mounts a [[sdk-python - CopilotKitRemoteEndpoint & SDK|CopilotKitRemoteEndpoint]] onto a FastAPI app and routes incoming CopilotKit requests to the right SDK method. The HTTP surface of the [[sdk-python - overview]] package.

```python
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from fastapi import FastAPI

app = FastAPI()
sdk = CopilotKitRemoteEndpoint(...)
add_fastapi_endpoint(app, sdk, "/copilotkit")
```

## `add_fastapi_endpoint(fastapi_app, sdk, prefix, *, use_thread_pool=False, max_workers=10)`

Registers a single catch-all route `{normalized_prefix}/{path:path}` for `GET/POST/PUT/DELETE/OPTIONS`, dispatching to `handler`. `use_thread_pool` is **deprecated** (warns); when set it runs the handler coroutine in a fresh event loop inside a `ThreadPoolExecutor`.

## `handler(request, sdk)` — request routing

Reads the JSON body (best-effort), then calls `set_forwarded_headers(dict(request.headers))` (see [[sdk-python - header_propagation]]) and builds a [[sdk-python - CopilotKitRemoteEndpoint & SDK|CopilotKitContext]] from `properties` / `frontendUrl` / `headers`. The route table (matched against the sub-path):

| Method + path | Handler |
|---|---|
| `GET`/`POST` `""` (root) | `handle_info` — JSON, or HTML via `generate_info_html` when the `Accept` header is `text/html` |
| `POST` `agent/{name}` | `handle_execute_agent` (reads `threadId`, `state`, `messages`, `actions`, `nodeName`) |
| `POST` `agent/{name}/state` | `handle_get_agent_state` |
| `POST` `action/{name}` | `handle_execute_action` |

If none match, it falls back to **`handler_v1`** for backwards compatibility, which serves the older path scheme: `POST info`, `POST actions/execute`, `POST agents/execute` (also accepts `config` and `metaEvents`), `POST agents/state`. Unmatched → `HTTPException(404)`. `body_get_or_raise` returns `HTTPException(400)` for missing required fields.

## Per-route handlers

- **`handle_info`** → `JSONResponse` (or `HTMLResponse`) of `sdk.info(...)`.
- **`handle_execute_action`** → awaits `sdk.execute_action(...)`, returns JSON; maps `ActionNotFoundException`→404, `ActionExecutionException`/`Exception`→500.
- **`handle_execute_agent`** → wraps `sdk.execute_agent(...)` (an async generator of newline-delimited JSON from the [[sdk-python - runloop]], or AG-UI SSE from [[sdk-python - LangGraphAGUIAgent]]) in a **`StreamingResponse`** with `media_type="application/json"`; `AgentNotFoundException`→404, `AgentExecutionException`/`Exception`→500.
- **`handle_get_agent_state`** → awaits `sdk.get_agent_state(...)`, returns JSON.

Exceptions are the ones defined in [[sdk-python - types & exceptions]]; module-level logging is configured at `ERROR` level.

## Related

[[sdk-python - overview]] · [[sdk-python - CopilotKitRemoteEndpoint & SDK]] · [[sdk-python - runloop]] · [[sdk-python - LangGraphAGUIAgent]] · [[sdk-python - header_propagation]] · [[sdk-python - types & exceptions]]
