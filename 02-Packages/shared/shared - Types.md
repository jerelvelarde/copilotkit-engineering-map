---
title: shared - Types
type: subsystem
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/types/index.ts
  - packages/shared/src/types/error.ts
  - packages/shared/src/types/copilot-cloud-config.ts
  - packages/shared/src/types/utility.ts
  - packages/shared/src/types/openai-assistant.ts
  - packages/shared/src/utils/errors.ts
  - packages/shared/src/utils/types.ts
tags: [copilotkit, shared, types, errors, layer/shared, type/subsystem, pkg/shared]
---
# shared - Types

The shared type barrel. `src/types/index.ts` re-exports six modules: `openai-assistant`, `action`, `copilot-cloud-config`, `utility`, `error`, `message`. The two largest get dedicated notes — [[shared - Message Types]] and [[shared - Parameter & Action Types]] — this note covers the rest plus the **error class hierarchy** (which physically lives in `src/utils/errors.ts` but is the canonical CopilotKit error surface).

## Error classes (`src/utils/errors.ts`)

The base class **`CopilotKitError` extends `GraphQLError`** (from `graphql`) — a deliberate choice so V1 GraphQL resolvers in [[@copilotkit/runtime]] can throw and serialize these uniformly. Each error carries `code: CopilotKitErrorCode`, `statusCode`, `severity?: Severity`, and `visibility: ErrorVisibility`, packed into GraphQL `extensions`.

```ts
enum CopilotKitErrorCode { NETWORK_ERROR, NOT_FOUND, AGENT_NOT_FOUND, API_NOT_FOUND,
  REMOTE_ENDPOINT_NOT_FOUND, AUTHENTICATION_ERROR, MISUSE, UNKNOWN, VERSION_MISMATCH,
  CONFIGURATION_ERROR, MISSING_PUBLIC_API_KEY_ERROR, UPGRADE_REQUIRED_ERROR }
enum Severity { CRITICAL, WARNING, INFO }
enum ErrorVisibility { BANNER, TOAST, SILENT, DEV_ONLY }
```

`ERROR_CONFIG` maps each code → `{ statusCode, troubleshootingUrl, visibility, severity }` (URLs point at `https://docs.copilotkit.ai/...`). Subclasses each set a distinct `name` (from `ERROR_NAMES`):

- `CopilotKitMisuseError` — wrong component/API usage; appends a docs link.
- `CopilotKitVersionMismatchError` — built from `{ reactCoreVersion, runtimeVersion, runtimeClientGqlVersion }`; message tells the user to align all `@copilotkit/*` versions.
- `CopilotKitApiDiscoveryError` / `CopilotKitRemoteEndpointDiscoveryError` — endpoint not found/contactable; tailors the message by inspecting the URL path (`/info`, `/actions/execute`, `/agents/state`, `/agents/execute`).
- `CopilotKitAgentDiscoveryError` — agent name not in the available set; lists available agents.
- `CopilotKitLowLevelError` — pre-HTTP transport failures (`ECONNREFUSED`/`ENOTFOUND`/`ETIMEDOUT`), distinct from `ResolvedCopilotKitError` which wraps a received HTTP status (400→ApiDiscovery, 404→Remote/Api, else→`UNKNOWN`).
- `ConfigurationError` → `MissingPublicApiKeyError`, `UpgradeRequiredError` (cloud/licensing config issues; see [[Telemetry & Licensing]]).

Helpers: `isStructuredCopilotKitError(err)`, `ensureStructuredError(err, converter)`, and `getPossibleVersionMismatch(...)` (compares `COPILOTKIT_VERSION` against runtime/client versions). `BANNER_ERROR_NAMES` (alias `COPILOT_CLOUD_ERROR_NAMES`) lists the names rendered as banners. These feed the error-event types in `src/types/error.ts` (`CopilotErrorEvent`, `CopilotRequestContext`, `CopilotErrorHandler`), used by [[Debug Mode]]/dev-console surfaces.

## Cloud config (`src/types/copilot-cloud-config.ts`)

`CopilotCloudConfig` — nested guardrails shape: `guardrails.input.restrictToTopic.{enabled, validTopics, invalidTopics}`. Paired with the `COPILOT_CLOUD_*` constants in `src/constants/`.

## Utility generics (`src/types/utility.ts`)

`PartialBy<T, K>` (make keys optional) and `RequiredBy<T, K>` (make keys required). A separate `src/utils/types.ts` adds `MaybePromise<T>`, `NonEmptyRecord<T>`, the **`RuntimeInfo`** surface (`version`, `agents: Record<string, AgentDescription>`, `audioFileTranscriptionEnabled`, `mode`, `intelligence?`, `a2uiEnabled?`, `openGenerativeUIEnabled?`, `licenseStatus?`, `telemetryDisabled?`), `RuntimeMode = "sse" | "intelligence"` with `RUNTIME_MODE_SSE`/`RUNTIME_MODE_INTELLIGENCE` (see [[Intelligence Platform vs SSE]]), `AgentDescription`, and `RuntimeLicenseStatus`.

## OpenAI Assistant shapes (`src/types/openai-assistant.ts`)

Legacy V1 tool/function-calling types: `FunctionDefinition` (`name`, `parameters: Record<string, unknown>`, `description?`), `ToolDefinition` (`{ type: "function"; function }`), `FunctionCallHandler`, `CoAgentStateRenderHandler`, an OpenAI-Assistant-style `AssistantMessage`, and a `JSONValue` recursive type.

Part of [[@copilotkit/shared]]. Errors here are consumed across the [[Three-Layer Architecture]]; `RuntimeInfo`/error events surface in [[@copilotkit/runtime-client-gql]] and [[@copilotkit/react-core]].
