---
title: web-inspector - persistence
type: subsystem
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/lib/persistence.ts
tags: [copilotkit, web-inspector, localstorage, persistence, telemetry, layer/frontend, type/subsystem, pkg/web-inspector]
---
# web-inspector - persistence

The inspector's storage layer. Two concerns live here: (1) persisting **window/dock layout state** as a JSON blob, and (2) flat per-key storage for the **anonymous telemetry** identity + opt-out flags consumed by [[web-inspector - telemetry]]. All access is guarded for SSR/test (`typeof window === "undefined"`) and wrapped in try/catch — storage failures must never break the host app.

## Layout state

```ts
type PersistedContextState = {
  anchor?: Anchor; anchorOffset?: Position; size?: Size; hasCustomPosition?: boolean;
};
type PersistedState = {
  button?: Omit<PersistedContextState, "size">;
  window?: PersistedContextState;
  isOpen?: boolean; dockMode?: DockMode;
  selectedMenu?: string; selectedContext?: string;
};
```

- `loadInspectorState(storageKey)` → `PersistedState | null` — reads `localStorage`; if absent, falls back to a **legacy cookie** of the same key and migrates it (URL-decoded JSON). Returns `null` on any parse failure.
- `saveInspectorState(storageKey, state)` — JSON-stringifies to `localStorage`; logs a warning (not a throw) on failure.
- Validators used during hydration so corrupt blobs don't crash layout: `isValidAnchor`, `isValidPosition`, `isValidSize`, `isValidDockMode`, and `isFiniteNumber`. (The main element uses storage key `cpk:inspector:state`.)

## Telemetry identity (flat keys)

Stored as independent `localStorage` keys rather than inside the JSON blob, so each can be read/written without round-tripping the whole state object:

- `cpk:inspector:telemetry:distinct_id`, `:opt_out`, `:disclosure_shown`.
- `getOrCreateTelemetryDistinctId()` — returns the persisted anonymous ID, minting a UUID v4 if absent. Falls back to a module-level **in-memory** ID when storage is unavailable (so `banner_viewed`→`banner_clicked` in one page-load still share an ID); SSR returns a fresh non-persistent UUID.
- `isTelemetryOptedOut()` / `setTelemetryOptOut(boolean)` — read/toggle the opt-out flag.
- `hasTelemetryDisclosureBeenShown()` / `markTelemetryDisclosureShown()` — gate the one-time console disclosure.
- `generateUuidV4()` — `crypto.randomUUID()` when available, else a non-cryptographic fallback (acceptable: the value is just an anonymous correlation ID).
- `_resetTelemetryPersistenceForTesting()` — clears the in-memory fallback between tests.

## Collaborators

Layout helpers in [[web-inspector - context-helpers]] produce the `anchor`/`offset`/`size` values stored here. The telemetry helpers here are imported by [[web-inspector - telemetry]] and surfaced through the main element's settings panel ([[web-inspector - cpk-web-inspector (Lit)]]). See [[Telemetry & Licensing]] for the broader posture.
