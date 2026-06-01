---
title: sdk-python - header_propagation
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/header_propagation.py
tags: [copilotkit, sdk-python, headers, httpx, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - header_propagation

Forwards `x-*`-prefixed request headers onto the agent's **outgoing LLM HTTP calls**, using a `contextvars.ContextVar` for per-request ambient state plus an httpx event hook. Mirrors the JS runtime's `extractForwardableHeaders()` behavior. Part of the [[sdk-python - overview]] package; exported from the package root.

```python
_forwarded_headers: ContextVar[Dict[str, str]] = ContextVar("copilotkit_forwarded_headers")

def set_forwarded_headers(headers: Dict[str, str]) -> None
def get_forwarded_headers() -> Dict[str, str]
def install_httpx_hook(client) -> None
```

## How it works

1. **`set_forwarded_headers(headers)`** — filters the incoming request headers to only those whose (lower-cased) name starts with `x-`, and stores them in the ContextVar. Called once per request by [[sdk-python - fastapi integration|the FastAPI handler]] (`set_forwarded_headers(dict(request.headers))`), notably to propagate `x-aimock-*` headers to outgoing LLM traffic for testing.
2. **`get_forwarded_headers()`** — returns the current ContextVar value (default `{}`).
3. **`install_httpx_hook(client)`** — appends a `request` event hook that injects the forwarded headers onto every outgoing httpx request. It handles two client shapes:
   - OpenAI / Anthropic SDK clients, which wrap an httpx client at `client._client` (hook attached to `client._client.event_hooks["request"]`).
   - Raw `httpx.Client` / `httpx.AsyncClient` (hook attached to `client.event_hooks["request"]`).
   - Anything else → a `warnings.warn` that headers won't be forwarded (no-op).

[[sdk-python - CopilotKitMiddleware]] calls `install_httpx_hook` on the model's `client`/`async_client` lazily (`_ensure_httpx_hook`, tracked by object id so it installs at most once per client). The hook is a no-op when no headers are set (normal demo traffic).

## Related

[[sdk-python - overview]] · [[sdk-python - CopilotKitMiddleware]] · [[sdk-python - fastapi integration]] · [[@copilotkit/sdk-js]]
