---
title: core - RunHandler
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/run-handler.ts
tags: [copilotkit, core, tools, run, follow-up, layer/frontend, type/symbol, pkg/core]
---
# core - RunHandler

Delegate of [[core - CopilotKitCore]] that owns the **frontend tool registry** and the **agent run lifecycle** including tool execution and recursive follow-ups. The busiest subsystem in [[@copilotkit/core]]. Implements [[Tools (Frontend & Backend)]] and the client side of [[Request Lifecycle]]. Tool type: [[core - FrontendTool types]].

## Tool registry

`_tools: FrontendTool<any>[]`. `addTool` (warns + skips on duplicate name+agentId), `removeTool(id, agentId?)`, `setTools`, and `getTool({ toolName, agentId })` — agent-specific tool wins, falling back to a global (no-`agentId`) tool of the same name.

`buildFrontendTools(agentId?)` filters out `available === false | "disabled"` and agent-mismatched tools, then maps each to an `@ag-ui/client` `Tool` with `parameters` produced by `createToolSchema` → `schemaToJsonSchema(tool.parameters, { zodToJsonSchema })` ([[@copilotkit/shared]] + `zod-to-json-schema`). `$schema` is stripped, `type`/`properties` defaulted, and `additionalProperties` recursively removed (some providers reject it).

## runAgent

```ts
async runAgent({ agent, forwardedProps? }): Promise<RunAgentResult>
```
1. Clears suggestions for the agent.
2. Applies headers to `HttpAgent`s; `await agent.detachActiveRun()` to finalize any prior pipeline (e.g. a long-lived `connectAgent`) before starting — awaited deliberately (fire-and-forget caused dropped runs in older `@ag-ui/client`).
3. **Top-level only** (`_runDepth === 0`): creates `_runAbortController` and monkey-patches `agent.abortRun` so calling it directly also aborts in-flight tool execution and blocks follow-ups. `_runDepth` tracks recursion so the controller/patch are set up/torn down only at the outermost call.
4. Calls `agent.runAgent` with merged `properties` + `forwardedProps`, built tools, and `Object.values(context)`, plus an error subscriber.
5. `processAgentResult`.

Errors emit `AGENT_RUN_FAILED` (local exception); the error subscriber emits `AGENT_RUN_FAILED_EVENT` / `AGENT_THREAD_LOCKED` (on `AgentThreadLockedError`, see [[core - IntelligenceAgent]]) / `AGENT_RUN_ERROR_EVENT`.

## processAgentResult — the follow-up engine

Scans `newMessages` for assistant tool calls lacking a matching `tool` result message. For each, runs the matching registered tool (or a `"*"` **wildcard** tool). If any executed tool wants a follow-up and the run isn't aborted, it:
- `await waitForPendingFrameworkUpdates()` (lets deferred framework state — e.g. React `useAgentContext` — flush into [[core - ContextStore]] before re-reading), then
- recursively calls `runAgent({ agent })`.

When no follow-up is needed, it calls `suggestionEngine.reloadSuggestions(agentId)`.

## Tool execution

`executeToolHandler` (shared by specific tools and `runTool`): parses args via `parseToolArguments`, fires `onToolExecutionStart`, invokes `tool.handler(args, { toolCall, agent, signal })` (signal = the run abort controller), stringifies the result (objects → `JSON.stringify`, null/undefined → `""`), fires `onToolExecutionEnd`. On parse failure emits `TOOL_ARGUMENT_PARSE_FAILED`; on handler throw emits `TOOL_HANDLER_FAILED` and stores `Error: <message>` as the result.

`executeSpecificTool` / `executeWildcardTool` then splice a `role: "tool"` result message after the parent assistant message — **but only if the parent is still in `agent.messages`** (skipped if the thread switched mid-execution, preventing cross-thread corruption). Follow-up is requested when there was no error and `tool.followUp !== false`. Wildcard tools receive args wrapped as `{ toolName, args }`.

## runTool (programmatic)

`runTool({ name, agentId?, parameters?, followUp? })` executes a registered tool **without an LLM turn**: pushes a synthetic assistant message with a tool call, runs the handler, inserts the tool result message, and optionally triggers a follow-up run. `followUp`: `false` (default) = stop; `"generate"` = run the agent so the LLM responds; any other string = append that as a user message, then run. Emits `TOOL_NOT_FOUND` / `AGENT_NOT_FOUND` (default agent id `"default"`).

## connectAgent

`connectAgent({ agent })` establishes the initial connection (used by the Intelligence transport's replay). Tracks `_lastConnectedThreadId`: a **fresh restore** (different threadId) clears `messages`/`state` and calls `clearReplayCursor` so the gateway replays full history; a **same-thread re-connect** (effect churn / transient disconnect) preserves local state and lets the gateway resume from `lastSeenEventId`. Abort errors are swallowed; other failures emit `AGENT_CONNECT_FAILED`.

## Exported helpers (test-only)

`parseToolArguments(rawArgs, toolName)` — normalises `""`/`null`/`undefined` to `{}` (some providers send empty strings), else `JSON.parse`. `ensureObjectArgs(parsed, toolName)` — throws if the parsed value isn't a plain object.

Collaborators: [[core - CopilotKitCore]] (`stopAgent` → `abortCurrentRun`), [[core - SuggestionEngine]], [[core - ContextStore]], [[core - ProxiedCopilotRuntimeAgent]] (the typical agent), [[core - IntelligenceAgent]] (`AgentThreadLockedError`).
