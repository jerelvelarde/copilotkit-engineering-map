---
title: runtime - Logging (Pino)
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/lib/logger.ts
  - packages/runtime/src/lib/integrations/shared.ts
tags: [copilotkit, runtime, logging, pino, observability, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Logging (Pino)

The runtime's structured logger, built on **Pino** (`pino` + `pino-pretty`). Defined in `lib/logger.ts`.

```ts
type LogLevel = "debug" | "info" | "warn" | "error";
function createLogger(options?: { level?: LogLevel; component?: string }): CopilotRuntimeLogger
```

- Level precedence: `process.env.LOG_LEVEL` → `options.level` → `"error"` (default is `error`, i.e. quiet).
- Output goes through `pino-pretty` with `colorize: true`.
- `redact: { paths: ["pid", "hostname"], remove: true }` strips process noise from every line.
- When `component` is supplied, returns a child logger bound with `{ component }`; otherwise the root logger. `CopilotRuntimeLogger` is `ReturnType<typeof createLogger>`.

## Where it's used

- **Framework integrations** ([[runtime - Framework Integrations (v1)]]) obtain a logger via `getCommonConfig(options).logging` in `lib/integrations/shared.ts`, which calls `createLogger({ component: "CopilotKit Runtime", level: logLevel })` where `logLevel = process.env.LOG_LEVEL || options.logLevel || "error"`. Each endpoint logs `logger.debug("Creating <framework> endpoint")` and the Node HTTP handler logs `warn`/`debug` around body re-buffering.
- The **GraphQL layer** ([[runtime - GraphQL Layer (v1)]]): `buildSchema()` logs schema build steps, and `GraphQLContext.logger` is a Pino instance that resolvers `child()` per operation (e.g. `CopilotResolver.generateCopilotResponse`).

Distinct from the user-facing [[Debug Mode]] / `DebugConfig` (a [[@copilotkit/shared]] / frontend concern) and from product [[Telemetry & Licensing]] (handled by the [[runtime - Hooks & Debug Event Bus]] / telemetry client). This note covers server-side operational logging only. Part of [[@copilotkit/runtime]].
