---
title: runtime - BuiltInAgent
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/agent/index.ts
tags: [copilotkit, runtime, agent, vercel-ai-sdk, ag-ui, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - BuiltInAgent

The Vercel-AI-SDK-powered agent that ships inside the runtime. There is **no `packages/agent`** — the BuiltInAgent lives at `packages/runtime/src/agent/index.ts`. It extends `AbstractAgent` from `@ag-ui/client` and bridges an LLM call (or a user-supplied stream) into the [[AG-UI Protocol]] event stream consumed by the runtime's [[runtime - AgentRunner (base)]] / [[runtime - InMemoryAgentRunner]].

```ts
class BuiltInAgent extends AbstractAgent {
  constructor(config: BuiltInAgentConfiguration)
  run(input: RunAgentInput): Observable<BaseEvent>
  getCapabilities(): Promise<AgentCapabilities>
  canOverride(property: OverridableProperty): boolean
  clone(): BuiltInAgent
  abortRun(): void
}
```

## Two modes

`BuiltInAgentConfiguration` is a union — `isFactoryConfig()` (a `"factory" in config` check) selects the path:

- **Classic** (`BuiltInAgentClassicConfig`): you pass `model` + sampling params + `tools`/`mcpServers`/`mcpClients`; the agent owns the `streamText()` call, prompt assembly, tool merging, MCP wiring, and state tools. `run()` drives this.
- **Factory** (`BuiltInAgentFactoryConfig`, type `"aisdk" | "tanstack" | "custom"`): you own the LLM call via a `factory(ctx)` returning a stream; the agent only manages lifecycle. `runFactory()` drives this and delegates conversion to [[runtime - AI SDK Converters]] (`convertAISDKStream` / `convertTanStackStream`); `"custom"` yields `BaseEvent`s directly.

## Model resolution

`resolveModel(spec, apiKey?)` accepts a `LanguageModel` instance (pass-through) or a `"provider/model"` / `"provider:model"` string. Switches on provider: `openai` → `createOpenAI`, `anthropic` → `createAnthropic`, `google`/`gemini`/`google-gemini` → `createGoogleGenerativeAI`, `vertex` → `createVertex`. API key falls back to `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GOOGLE_API_KEY`. `BuiltInAgentModel` is a union of known model ids (gpt-5/4.1/4o, o3/o4-mini, claude-sonnet-4.5/opus-4.1/3.5-haiku, gemini-2.5-pro/flash) widened with `(string & {})`.

## Classic run() pipeline

1. Emit `RUN_STARTED`. Throws if an `abortController` already exists ("Agent is already running").
2. Build an optional **system prompt** from `config.prompt` + `input.context` (`## Context from the application`) + `input.state` (`## Application State`, JSON-fenced).
3. Convert messages via `convertMessagesToVercelAISDKMessages()` (see [[runtime - AI SDK Converters]]) and prepend the system message.
4. Merge tools: frontend tools from `input.tools` (`convertToolsToVercelAITools`) + config `tools` (`convertToolDefinitionsToVercelAITools`) + two built-in **state tools** `AGUISendStateSnapshot` / `AGUISendStateDelta` + tools from `mcpClients` and `mcpServers`.
5. Apply `forwardedProps` overrides, each gated by `canOverride(prop)` against `config.overridableProperties` (`model`, `toolChoice`, `temperature`, `topP`, `topK`, penalties, `stopSequences`, `seed`, `maxRetries`, `providerOptions`, `maxOutputTokens`). `maxSteps` maps to `stopWhen: stepCountIs(n)`.
6. `streamText({...})` then translate `fullStream` parts into AG-UI events: `text-delta` → `TEXT_MESSAGE_CHUNK`; `tool-input-*`/`tool-call` → `TOOL_CALL_START/ARGS/END`; `tool-result` → `TOOL_CALL_RESULT` (and `STATE_SNAPSHOT`/`STATE_DELTA` when the tool name is a state tool); `reasoning-*` → `REASONING_*`; `finish`/`abort` → `RUN_FINISHED`; `error` → `RUN_ERROR`.

## Notable behaviors

- **Reasoning auto-close**: some providers (notably `@ai-sdk/anthropic`) never emit `reasoning-end`. A `closeReasoningIfOpen()` helper synthesizes `REASONING_MESSAGE_END` + `REASONING_END` on any non-`reasoning-delta` event so downstream state machines do not stall. The same logic is mirrored in the converters.
- **Non-unique id guard**: `text-start` / `reasoning-start` ids that are falsy, `"0"`, or match `/^(txt|reasoning|msg)-0$/` (emitted by `@ai-sdk/openai-compatible`) are replaced with `randomUUID()`.
- **Intelligence MCP auto-attach**: when `input.forwardedProps.auth.copilotkitIntelligence` carries `{ userId, apiKey, mcpUrl }`, a per-request HTTP MCP server is appended whose `options.fetch` stamps `Authorization: Bearer <apiKey>` and the `X-Cpki-User-Id` header (`INTELLIGENCE_USER_ID_HEADER` from the [[runtime - Intelligence Platform Client]]). Skipped if the user already configured the same URL. See [[Intelligence Platform vs SSE]].
- **MCP lifecycle**: `mcpServers` clients are created and closed by the agent; `mcpClients` (a `MCPClientProvider` with `tools()`) are user-owned and never closed.
- `clone()` copies the private `AbstractAgent.middlewares` array (via `@ts-expect-error`) to preserve [[Middleware]] chains.

## Tooling helpers (exported)

`defineTool(config)` builds a `ToolDefinition` (Standard Schema params + `execute`). `convertToolDefinitionsToVercelAITools` passes Zod schemas straight through and converts non-Zod via `schemaToJsonSchema()` + `jsonSchema()`. `convertToolsToVercelAITools` / `convertJsonSchemaToZodSchema` convert JSON-Schema frontend tools to Zod. See [[Tools (Frontend & Backend)]].

## Deprecated aliases

`BasicAgent extends BuiltInAgent` (logs a deprecation warning) and `BasicAgentConfiguration = BuiltInAgentClassicConfig` remain for backward compatibility.

Used by [[@copilotkit/runtime]] via `CopilotRuntime` to wrap a [[runtime - Service Adapter (interface)]]'s `getLanguageModel()` into a classic-config agent. Implements [[AgentRunner]] semantics and the [[AG-UI Protocol]].
