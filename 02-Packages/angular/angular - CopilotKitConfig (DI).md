---
title: angular - CopilotKitConfig (DI)
type: symbol
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/config.ts
  - packages/angular/src/lib/license-watermark.ts
tags: [copilotkit, angular, di, config, license, layer/frontend, type/symbol, pkg/angular]
---
# angular - CopilotKitConfig (DI)

The dependency-injection entry point for [[@copilotkitnext/angular]]. An app calls `provideCopilotKit(config)` in its providers; the resulting `COPILOT_KIT_CONFIG` token is consumed by the [[angular - CopilotKit service]] at construction.

```ts
export interface CopilotKitConfig {
  runtimeUrl?: string;
  headers?: Record<string, string>;
  licenseKey?: string;
  properties?: Record<string, unknown>;
  agents?: Record<string, AbstractAgent>;
  selfManagedAgents?: Record<string, AbstractAgent>;
  tools?: ClientTool[];
  renderToolCalls?: RenderToolCallConfig[];
  frontendTools?: FrontendToolConfig[];
  humanInTheLoop?: HumanInTheLoopConfig[];
}

export const COPILOT_KIT_CONFIG = new InjectionToken<CopilotKitConfig>("COPILOT_KIT_CONFIG");
export function injectCopilotKitConfig(): CopilotKitConfig;   // inject(COPILOT_KIT_CONFIG)
export function provideCopilotKit(config: CopilotKitConfig): Provider;
```

The tool/renderer config types (`ClientTool`, `RenderToolCallConfig`, `FrontendToolConfig`, `HumanInTheLoopConfig`) come from [[angular - Tools & ToolRenderer]]; `AbstractAgent` is from `@ag-ui/client`.

## `provideCopilotKit` & license resolution

`provideCopilotKit` resolves the license **before** providing the value:

- `resolveLicense(config)` picks `config.licenseKey` or the `X-CopilotCloud-Public-Api-Key` header, and validates it against `^ck_pub_[0-9a-f]{32}$`.
- If invalid/missing, it logs a one-time console warning (guarded by a global flag) telling the user to add a `licenseKey`.
- If a **valid** key was supplied via `licenseKey` (and the header isn't already set), it is merged into `headers` as `X-CopilotCloud-Public-Api-Key`.
- Returns `{ provide: COPILOT_KIT_CONFIG, useValue: { ...config, headers: mergedHeaders } }`.

## License watermark

`license-watermark.ts` (`ensureLicenseWatermark(headers)`, called from the `CopilotKit` service constructor) appends a fixed-position `#copilotkit-license-watermark` DOM node reading "CopilotKit Unlicensed" whenever no valid `ck_pub_…` header is present and a `document` exists (SSR-safe guard). This is the local, client-side enforcement path for [[Telemetry & Licensing]] — note this package does **not** import `@copilotkit/license-verifier`; it does its own regex check.

## Chat labels (separate DI surface)

[[angular - Chat components]] add a parallel config surface in `chat-config.ts`: `CopilotChatLabels`, `COPILOT_CHAT_DEFAULT_LABELS`, the `COPILOT_CHAT_LABELS` token, `injectChatLabels()`, and `provideCopilotChatLabels(partial)` — used for i18n/customization of button and placeholder strings.
