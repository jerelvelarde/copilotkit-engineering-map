---
title: runtime - Bedrock Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/bedrock/bedrock-adapter.ts
tags: [copilotkit, runtime, service-adapters, bedrock, aws, langchain, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Bedrock Adapter

`BedrockAdapter extends` [[runtime - LangChain Adapter]] for **AWS Bedrock** via LangChain's `ChatBedrockConverse` (`@langchain/aws`). Like [[runtime - Google GenAI Adapter]], it implements [[runtime - Service Adapter (interface)]] only through the LangChain base — it provides a `chainFn`, not its own `process()`.

```ts
new BedrockAdapter({ model?, region?, credentials? })
```

- `provider = "bedrock"`, default `model = "amazon.nova-lite-v1:0"`, default `region = "us-east-1"`.
- `credentials?: { accessKeyId?, secretAccessKey? }` — when omitted, the LangChain/AWS SDK default credential chain applies.

## chainFn behavior

Lazily `require`s `@langchain/aws` (optional peer dep), constructs `new ChatBedrockConverse({ model, region, credentials }).bindTools(tools)`, and returns `model.stream(messages)`. All event translation is inherited from `streamLangChainResponse` in the [[runtime - LangChain Adapter]]. No V2 `getLanguageModel()`.

Part of [[@copilotkit/runtime]]; see [[Tools (Frontend & Backend)]].
