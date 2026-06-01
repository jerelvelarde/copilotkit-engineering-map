---
title: Telemetry & Licensing
type: concept
layer: meta
source:
  - packages/shared/src/telemetry/telemetry-client.ts
  - packages/runtime/src/lib/telemetry-disclosure.ts
  - packages/runtime/src/v2/runtime/core/runtime.ts
  - packages/runtime/src/v2/runtime/handlers/get-runtime-info.ts
tags: [copilotkit, architecture, telemetry, licensing, layer/meta, type/concept]
---
# Telemetry & Licensing

Two related server-side concerns, both opt-in/opt-out and both surfaced through `GET /info`.

## Telemetry

CopilotKit ships **anonymous usage telemetry**, implemented by `TelemetryClient` in [[@copilotkit/shared]] ([[shared - Telemetry]], `packages/shared/src/telemetry/telemetry-client.ts`) and an instance in the runtime ([[runtime - SSE Streaming]] and handlers `capture(...)`). Key facts grounded in the code:

- **Opt-out** via env: `COPILOTKIT_TELEMETRY_DISABLED=true|1` or `DO_NOT_TRACK=true|1` (`isTelemetryDisabled()`). When disabled the client constructs nothing.
- **Disclosure**: the runtime logs a one-line console notice on first construction (`logRuntimeTelemetryDisclosure`, once per process) pointing to `https://docs.copilotkit.ai/telemetry`; suppressed when telemetry is disabled. The inspector has a matching first-run disclosure ([[web-inspector - telemetry]]).
- **Sampling**: anonymous events are sampled (default `sampleRate = 0.05`); **identified** events (when a license token yields a `telemetry_id`) bypass the sample gate and ship at 100%, with `sampleWeight` computed per event for correct extrapolation.
- **Sinks**: Segment (`@segment/analytics-node`) plus a lambda client; customer API keys are **not** sent to telemetry — only into Segment context. Events are namespaced `oss.runtime.*` (e.g. `instance_created`, `copilot_request_created`, `agent_execution_stream_started/ended/errored`). `instance_created` fires once per handler ([[runtime - createCopilotRuntimeHandler]]); per-request events carry `x-copilotcloud-public-api-key` when present.
- `GET /info` reports `telemetryDisabled` so clients/inspectors can reflect the state ([[runtime - Intelligence Platform Client|/info handler]]).

## Licensing

Feature gating uses the **external** `@copilotkit/license-verifier` (not in this repo; [[@copilotkit/shared]] re-exports only its *types* to keep Node's `crypto` out of browser bundles).

- A `licenseToken` is configured on the runtime, falling back to `COPILOTKIT_LICENSE_TOKEN`. It's an Ed25519-signed JWT.
- In [[Intelligence Platform vs SSE|Intelligence mode]] `CopilotIntelligenceRuntime` creates a `LicenseChecker` and sets the telemetry license token (so attribution and gating resolve the same way).
- Handlers consult `runtime.licenseChecker.checkFeature("agents")` and only **warn** if unlicensed ([[runtime - Handlers (run/connect/stop)]]) — it does not hard-block.
- `GET /info` returns a `licenseStatus` (`valid | none | expired | expiring | invalid | unknown`) in Intelligence mode, computed by `resolveLicenseStatus`.

Client-side, [[@copilotkit/shared]] provides `createLicenseContextValue(null)` where an absent license = unrestricted-with-branding (`checkFeature` returns `true`). SSE/self-hosted mode needs no license.
