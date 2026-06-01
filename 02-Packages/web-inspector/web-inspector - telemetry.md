---
title: web-inspector - telemetry
type: subsystem
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/lib/telemetry.ts
tags: [copilotkit, web-inspector, telemetry, analytics, privacy, layer/frontend, type/subsystem, pkg/web-inspector]
---
# web-inspector - telemetry

Browser-side **anonymous funnel telemetry** for the inspector. Fire-and-forget POSTs to the CopilotKit sink at `https://telemetry.copilotkit.ai/ingest`. Distinct from runtime/server telemetry — see [[Telemetry & Licensing]] and [[shared - Telemetry]]. Identity + opt-out persistence is delegated to [[web-inspector - persistence]].

## Events (V1 funnel)

```ts
TELEMETRY_EVENTS = {
  bannerViewed:      "oss.inspector.banner_viewed",
  bannerClicked:     "oss.inspector.banner_clicked",
  threadsTabClicked: "oss.inspector.threads_tab_clicked",
};
```

Namespaced `oss.inspector.*` so the server-side lambda allowlist can gate them; adding an event requires a matching allowlist entry. Constants exported: `TELEMETRY_INGEST_URL`, `TELEMETRY_DOCS_URL` (`https://docs.copilotkit.ai/telemetry`). `PACKAGE_NAME` is sent as `package.name`; a 3-second `FETCH_TIMEOUT_MS` caps each request.

## API

- `track(event, properties?)` — builds `{ event, properties: { ...props, distinct_id }, package, ts }` and dispatches via `postBestEffort`. Returns synchronously.
- Typed per-event helpers enforce property shape at the call site: `trackBannerViewed({ banner_id, cta_label? })`, `trackBannerClicked({ banner_id, cta: "body" | "dismiss", cta_label? })`, `trackThreadsTabClicked()`.
- `getTelemetryDistinctIdForUrl()` → `string | null` — the anon ID for cross-domain propagation onto banner-CTA links (returns `null` when opted out), enabling the website's `posthog.alias(...)` to merge anon IDs for `banner_viewed → banner_clicked → signup` attribution.
- `ensureTelemetryDistinctId()` — seed the ID into storage on mount (no-op when opted out).
- `maybeShowDisclosure()` — one-time `console.info` disclosure on first run (skipped when opted out; deliberately does **not** mark the flag while opted out, so a later opt-in still gets first-run behavior).
- Re-exports `isTelemetryOptedOut` from persistence.

## Privacy invariants (enforced in source)

- **Never** sends message content, agent state, prompts, completions, or banner markdown — properties are event metadata only (`banner_id`, `cta`, `ts`).
- The opt-out short-circuits **before** any network call; there is no buffer/retry queue.
- All errors are swallowed; `postBestEffort` uses an `AbortController` timeout, `Content-Type: application/json` + an `X-CopilotKit-Telemetry-Id` header, and **no credentials / no Authorization** (anonymous endpoint).
- The endpoint URL is intentionally human-readable so it's obvious in the DevTools Network tab.

## Collaborators

Called from [[web-inspector - cpk-web-inspector (Lit)]] — `ensureTelemetryDistinctId`/`maybeShowDisclosure` on connect (gated by `core.telemetryDisabled`), `trackBannerViewed`/`trackBannerClicked` around the announcement banner, and `trackThreadsTabClicked` on the Threads menu. Identity/opt-out flags live in [[web-inspector - persistence]].
