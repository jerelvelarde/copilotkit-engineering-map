---
title: react-core - useCopilotChat (v1)
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/hooks/use-copilot-chat.ts
  - packages/react-core/src/hooks/use-copilot-chat_internal.ts
  - packages/react-core/src/hooks/use-copilot-chat-headless_c.ts
tags: [copilotkit, react-core, hooks, chat, v1, headless, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useCopilotChat (v1)

The V1 headless chat hook for programmatic chat control. A thin facade over `useCopilotChatInternal`, exposing the open-source-friendly subset. Part of [[@copilotkit/react-core]]; see [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]].

```ts
function useCopilotChat(options?: UseCopilotChatOptions): UseCopilotChatReturn
```
`UseCopilotChatReturn` is `UseCopilotChatReturnInternal` with message/suggestion/interrupt fields **omitted** (`messages`, `sendMessage`, `suggestions`, `interrupt`, `setMessages`, …). Returns `{ visibleMessages, appendMessage, reloadMessages, stopGeneration, reset, isLoading, isAvailable, runChatCompletion, mcpServers, setMcpServers }`. Works without a `publicApiKey`. `visibleMessages`/`appendMessage` use the deprecated GQL message format and are kept for compatibility.

**`useCopilotChatInternal(options)`** (`use-copilot-chat_internal.ts`) — the real engine and the largest V1 hook. It is built **on the V2 core**: `useCopilotKit().copilotkit` + [[react-core - useAgent]]. It runs `copilotkit.connectAgent`/`runAgent`, watches `copilotkit.runtimeConnectionStatus`, subscribes to `copilotkit.interruptElement` to surface `interrupt`, manages suggestions (`clearSuggestions`, generate), and maps to/from the legacy GQL message shape via [[@copilotkit/runtime-client-gql]]. Its return type includes `messages`, `sendMessage` (current API), `setMessages`, `deleteMessage`, `suggestions`/`generateSuggestions`, and `interrupt`.

**`useCopilotChatHeadless_c(options)`** (`use-copilot-chat-headless_c.ts`) — the **premium** fully-headless variant (`UseCopilotChatReturn_c`). Always calls `useCopilotChatInternal`, but returns a non-functional stub (`createNonFunctionalReturn()`) and raises a `MISSING_PUBLIC_API_KEY_ERROR` banner via the [[react-core - V1 contexts|CopilotContext]] (`setBannerError`) when no `publicApiKey` is present. Exposes `messages`, `sendMessage`, `setMessages`, `reset`, `isLoading`, `runChatCompletion`, `generateSuggestions`/`resetSuggestions`/`isLoadingSuggestions`, `interrupt`, `mcpServers`. This is the recommended headless API; `useCopilotChat` is the lightweight, license-free subset.

Relates to [[Threads]] and [[react-core - useCopilotChat (v1)|chat]] surfaces; the prebuilt UI ([[react-core - CopilotChat (v2)]], [[@copilotkit/react-ui]]) can be driven programmatically through these hooks.
