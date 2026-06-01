---
title: vue - Message renderers
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/components/index.ts
  - packages/vue/src/v2/components/MCPAppsActivityRenderer.ts
  - packages/vue/src/v2/components/OpenGenerativeUIRenderer.ts
  - packages/vue/src/v2/components/A2UIMessageRenderer.ts
  - packages/vue/src/v2/types/vue-tool-call-renderer.ts
  - packages/vue/src/v2/types/vue-activity-message-renderer.ts
  - packages/vue/src/v2/types/vue-custom-message-renderer.ts
  - packages/vue/src/v2/lib/processPartialHtml.ts
tags: [copilotkit, vue, renderers, generative-ui, mcp, layer/frontend, type/subsystem, pkg/vue]
---
# vue - Message renderers

The renderer system that turns agent output (tool calls, activity messages, custom messages) into Vue UI. Three renderer **kinds** are defined as types in `src/v2/types/` and three built-in **activity renderers** ship in `src/v2/components/`. The provider auto-registers the built-ins (see [[vue - CopilotKitProvider]]).

## Renderer type kinds

- **`VueToolCallRenderer<T>`** (`vue-tool-call-renderer.ts`) — `{ name, args: StandardSchemaV1, agentId?, render }`. `render` is a fn/`Component` receiving a discriminated union over [[Tools (Frontend & Backend)|ToolCallStatus]] (`InProgress` → partial args; `Executing` → full args; `Complete` → `result: string`). Registered via [[vue - useFrontendTool]] and `useRenderTool`.
- **`VueActivityMessageRenderer<TContent>`** (`vue-activity-message-renderer.ts`) — `{ activityType, agentId?, content: z.ZodSchema<TContent>, render }`. Resolved (with agent-scoped > global > `"*"` precedence) by `useRenderActivityMessage`, which validates `content` via `safeParse` before rendering.
- **`VueCustomMessageRenderer`** (`vue-custom-message-renderer.ts`) — `{ agentId?, render }` rendering at `position: "before"|"after"` a message, with run-relative index props. Resolved by `useRenderCustomMessages`.

## Built-in activity renderers

### MCPAppsActivityRenderer (`activityType: "mcp-apps"`)
Renders [MCP UI Apps](https://modelcontextprotocol.io) resources in a nested sandboxed iframe. Fetches the resource by `resourceUri` via `agent.runAgent({ forwardedProps: { __proxiedMCPRequest: { method: "resources/read", … } } })`, builds a CSP-locked proxy iframe (`buildSandboxHTML`), and bridges JSON-RPC 2.0 (`PROTOCOL_VERSION 2025-06-18`): handles `ui/initialize`, `ui/message` (adds a message + optional follow-up run), `ui/open-link`, `tools/call` (proxied back through the agent), and notifications (`size-changed`, `tool-input`, `tool-result`). A module-level `MCPAppsRequestQueue` serializes requests per thread and waits for the agent to go idle (30s timeout) before each run. **Always registered** by the provider. See [[A2UI (Generative UI)]] sibling protocols and [[Multi-Agent]].

### OpenGenerativeUIRenderer (`activityType: "open-generative-ui"`)
Renders the **`generateSandboxedUi`** built-in tool's streamed output (`OpenGenerativeUIContentSchema`: `initialHeight`, `css`+`cssComplete`, `html[]`+`htmlComplete`, `jsFunctions`, `jsExpressions[]`, `generating`) into a `@jetbrains/websandbox` iframe. Streams in three phases — a **preview** sandbox shows partial HTML (`processPartialHtml` / `extractCompleteStyles` from `lib/processPartialHtml.ts`) while CSS completes, then a **final** sandbox runs the complete HTML, injecting `jsFunctions` once and applying `jsExpressions` incrementally. Host functions come from [[vue - Providers & injection keys|useSandboxFunctions]] (called inside the sandbox via `Websandbox.connection.remote.<fn>`). `OpenGenerativeUIToolRenderer` shows rotating `placeholderMessages` while generating. Registered when Open Generative UI is active.

### A2UIMessageRenderer (`activityType: "a2ui-surface"`)
`createA2UIMessageRenderer({ theme, catalog, loadingComponent })` returns a `VueActivityMessageRenderer` that shows a `DefaultA2UILoading` shimmer (or a custom `loadingComponent`) until `a2ui_operations` arrive, then delegates to [[vue - A2UI (VueSurface/adapter/catalog)|A2UISurfaceActivityRenderer]]. Unshifted into the activity-renderer list by the provider when the runtime reports A2UI enabled.

`components/index.ts` re-exports these plus the chat barrel, the inspector, and the a2ui barrel. Up: [[@copilotkit/vue]].
