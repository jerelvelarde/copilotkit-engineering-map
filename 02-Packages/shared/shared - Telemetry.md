---
title: shared - Telemetry
type: subsystem
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/telemetry/index.ts
  - packages/shared/src/telemetry/telemetry-client.ts
  - packages/shared/src/telemetry/lambda-client.ts
  - packages/shared/src/telemetry/events.ts
  - packages/shared/src/telemetry/utils.ts
  - packages/shared/src/telemetry/scarf-client.ts
tags: [copilotkit, shared, telemetry, analytics, licensing, layer/shared, type/subsystem, pkg/shared]
---
# shared - Telemetry

CopilotKit's opt-out usage telemetry. Best-effort and fail-silent by design — **telemetry must never break the host application** (every network path swallows errors). This is the V1/shared client; [[@copilotkit/runtime]] V2 has a parallel client that reuses the same `lambdaClient` and telemetry-id parsing. See the concept note [[Telemetry & Licensing]].

`src/telemetry/index.ts` exports `TelemetryClient`, the default `lambdaClient`, `parseTelemetryIdFromLicense`, `parseAndWarnTelemetryId`, and the `LambdaSendOptions` type.

## `TelemetryClient` (`telemetry-client.ts`)

```ts
new TelemetryClient({ packageName, packageVersion, telemetryDisabled?, telemetryBaseUrl?, sampleRate? })
await client.capture(event, properties)   // event ∈ keyof AnalyticsEvents
client.setGlobalProperties(props)
client.setCloudConfiguration({ publicApiKey, baseUrl })
client.setLicenseToken(token)
```

Behavior:
- **Opt-out:** disabled if constructed with `telemetryDisabled` OR `isTelemetryDisabled()` — which checks `COPILOTKIT_TELEMETRY_DISABLED=true|1` or `DO_NOT_TRACK=true|1`. When disabled the client returns early and never constructs the Segment client.
- **Two sinks per `capture`:** the CopilotKit telemetry-sink `lambdaClient.send(...)`, and Segment (`@segment/analytics-node`, default write key baked in, overridable via `COPILOTKIT_SEGMENT_WRITE_KEY`). Properties are flattened (`flattenObject`) and, for Segment, key-sorted for stable ordering.
- **Sampling:** default `sampleRate = 0.05` (overridable via constructor or `COPILOTKIT_TELEMETRY_SAMPLE_RATE`; validated to `[0,1]`, `NaN` rejected). **Anonymous** events are gated by `Math.random() < sampleRate`; **identified** events (a license token yielded a `telemetry_id`) bypass the gate and ship at 100%. Per-event `samplingMeta` is attached (`sampleRate`, `sampleRateAdjustmentFactor`, `sampleWeight = 1/effectiveRate`) so downstream weight-based extrapolation is correct for both populations — identified events get `effectiveRate = 1`.
- **Identity:** an `anonymousId = anon_<uuid>`; the **license JWT itself is never shipped** — only its decoded `telemetry_id` travels (via the `X-CopilotKit-Telemetry-Id` header set in `lambdaClient`). API keys (CopilotCloud `ck_*`) are unrelated and flow only into Segment.

## `lambdaClient` (`lambda-client.ts`)

The telemetry-**sink** sender. POSTs to `COPILOTKIT_TELEMETRY_URL` or `https://telemetry.copilotkit.ai/ingest` (3s `AbortController` timeout), which fans out server-side to Scarf/Reo so vendor changes don't require SDK releases. Strips `cloud.public_api_key`/`cloud.publicApiKey` at the wire boundary.

- **`parseTelemetryIdFromLicense(token?)`** — base64url-decodes the JWT *payload* (`<header>.<payload>.<sig>`, must be 3 parts) and returns `telemetry_id` if it's a string, else `null`. **Does not verify** the Ed25519 signature — that is the [[@copilotkit/shared]] license-verifier's job (trust model is claim-only on the Lambda side). Works in browser (`atob`) and Node (`Buffer`).
- **`parseAndWarnTelemetryId(token)`** — same parse but `console.warn`s once when no id is found (so callers don't silently emit anonymous on every capture). `TelemetryClient.setLicenseToken` calls this and caches the id.

## Events catalog (`events.ts`)

`AnalyticsEvents` is a typed map keyed by event name (all `oss.runtime.*`): `instance_created` (`RuntimeInstanceCreatedInfo`), `copilot_request_created`, `agent_execution_stream_{started,ended,errored}` (`AgentExecutionResponseInfo`). `capture<K>` is generic over these keys so payloads are type-checked at the call site.

## Utilities & legacy

- `utils.ts`: `flattenObject(obj)` (dot-joined recursion) and `printSecurityNotice(advisory)` (chalk-colored severity banner to the console).
- `scarf-client.ts`: a legacy direct-to-Scarf `GET` pixel client (`copilotkit.gateway.scarf.sh/<version>`), superseded by the sink `lambdaClient` but still present; not re-exported from `telemetry/index.ts`.

> The empty `security-check.ts` file currently exports nothing (a placeholder).

Part of [[@copilotkit/shared]]. Consumed by the runtime layer ([[@copilotkit/runtime]]) at instance-creation and per-run. License token plumbing connects to [[Telemetry & Licensing]].
