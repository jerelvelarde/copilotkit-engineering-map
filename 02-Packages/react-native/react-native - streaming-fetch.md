---
title: react-native - streaming-fetch
type: symbol
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/streaming-fetch.ts
tags: [copilotkit, react-native, fetch, sse, streaming, xhr, frontend, layer/frontend, type/symbol, pkg/react-native]
---
# react-native - streaming-fetch

An XHR-based replacement for `global.fetch` that gives React Native a response with a readable `body` (`ReadableStream`), which RN's built-in `fetch` does not support (`response.body.getReader()` is missing). This is what makes CopilotKit's **SSE-based** agent communication work on mobile. Installed (last) by [[react-native - Polyfills]] via `installStreamingFetch()`. Part of [[@copilotkit/react-native]]. Implements the transport side of the [[AG-UI Protocol]] / [[Request Lifecycle]].

```ts
export function installStreamingFetch(): void
```

## Feature detection (skip when native supports it)

Before installing, it constructs `new Response("")` and checks whether `body.getReader` is a function. If native fetch **already** streams (newer RN / Hermes), it returns and leaves `fetch` untouched. A `Response` constructor that throws `ReferenceError`/`TypeError` is treated as "expected old RN"; any other error logs a `__DEV__` warning and proceeds to install.

## The threading fix (why every callback is deferred)

In React Native, XHR callbacks (`onprogress`, `onload`, `onreadystatechange`, …) may fire on a **native networking thread**. Calling `streamController.enqueue()` there pushes data into the stream, which can trigger downstream React `setState` on the wrong thread — on iOS this kills the process with *"deleted thread with uncommitted CATransaction"*. The fix: **every** XHR callback body is wrapped in `setTimeout(fn, 0)` to bounce execution back to the JS thread (main thread under Hermes). Latency is negligible, so streaming still feels real-time. XHR state read inside `onreadystatechange` is captured **synchronously** before the `setTimeout`, because XHR properties can change before the deferred callback runs.

## How it works

`streamingFetch(input, init)` normalizes `input` (string / `URL` / `Request`) into `url`, `method`, `headers`, `body`, `signal`, then returns a `Promise<Response>`:

- If `signal?.aborted`, rejects immediately with an `AbortError` `DOMException` (per spec).
- Opens an `XMLHttpRequest` (`responseType: "text"`, default **60 s** `timeout` to survive WiFi↔cellular transitions and serverless cold starts), sets headers, and creates a `ReadableStream<Uint8Array>` whose `start` captures the controller and whose `cancel` aborts the XHR.
- **Chunking:** `flushChunks()` slices `xhr.responseText` from `lastIndex`, `TextEncoder.encode`s the delta, and `enqueue`s it. Called on `onprogress` and again on `onload`.
- **Lifecycle:** `onload` flushes, closes the stream, resolves a `fullTextPromise`; `onerror`/`ontimeout` call `fail(...)` with a `TypeError`; a `fail` helper errors the stream, rejects `fullTextPromise`, and rejects the outer promise if not yet settled, while removing the abort listener.
- **Response object:** built in `onreadystatechange` once `readyState >= 2` and `status !== 0` (status 0 = CORS/DNS/mixed-content failure → left to `onerror`; a safety net at `readyState === 4` with `status 0` and no response fails explicitly). It is a **duck-typed** Response (not a native instance) exposing `ok/status/statusText/url/type/redirected/bodyUsed/headers/body` plus `json()`, `text()`, `arrayBuffer()`, `blob()` (all backed by `fullTextPromise`). `clone()` and `formData()` **throw** "not supported".
- **Abort:** an `abort` listener on the signal calls `fail(AbortError)` + `xhr.abort()`. It is intentionally **not** removed when the Response resolves (so mid-stream cancellation still works); cleanup happens only in terminal handlers.

## Opt-out

The original fetch is preserved at `(global.fetch as any).__originalFetch` so third-party libs that need native behavior can recover it.

## Caveats / known gaps

- Not a full `fetch` implementation: `Response.clone()` and `Response.formData()` throw; `blob()` requires a global `Blob`.
- Uses `Math.random`-grade `crypto` only indirectly (via [[react-native - Polyfills]]); the fetch itself adds no auth.
- `request.body` from a `Request` object is read as a `string | null | undefined` — streamed request bodies aren't handled.

## Collaborators

- [[react-native - Polyfills]] — installs this last; supplies `ReadableStream`, `TextEncoder`, `DOMException`, `Headers`.
- [[react-core - CopilotKitCoreReact]] — issues the SSE `fetch` calls that this powers.
- [[AG-UI Protocol]], [[Request Lifecycle]] — the event/SSE flow it carries.
