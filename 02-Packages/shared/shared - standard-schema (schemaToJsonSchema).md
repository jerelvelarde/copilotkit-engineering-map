---
title: shared - standard-schema (schemaToJsonSchema)
type: symbol
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/standard-schema.ts
tags: [copilotkit, shared, standard-schema, json-schema, zod, valibot, arktype, layer/shared, type/symbol, pkg/shared]
---
# shared - standard-schema (schemaToJsonSchema)

The modern, validator-agnostic schema bridge. Built on `@standard-schema/spec` so CopilotKit's tool/parameter definitions can accept **any** Standard Schema V1 validator — Zod 3.24+, Valibot v1+, ArkType v2+ — and convert it to JSON Schema for the LLM, without `shared` itself depending on `zod-to-json-schema`. (The Zod-only path lives separately in [[shared - Parameter & Action Types]].)

## Re-exports & inference

```ts
export type { StandardSchemaV1, StandardJSONSchemaV1 };   // from @standard-schema/spec
export type InferSchemaOutput<S> = S extends StandardSchemaV1<any, infer O> ? O : never;
```

`InferSchemaOutput<S>` replaces `z.infer<S>` for generic schema inference, so downstream tool typings don't hard-code Zod.

## `schemaToJsonSchema(schema, options?)`

```ts
function schemaToJsonSchema(
  schema: StandardSchemaV1,
  options?: { zodToJsonSchema?: (schema, opts?) => Record<string, unknown> },
): Record<string, unknown>
```

Resolution strategy, in order:
1. **Standard JSON Schema V1** — if `schema['~standard'].jsonSchema.input` is a function (detected by the internal `hasStandardJsonSchema` guard), call `schema['~standard'].jsonSchema.input({ target: "draft-07" })`. This is the preferred, validator-neutral path.
2. **Zod v4 native** — if the schema exposes a `toJSONSchema()` method, call it directly.
3. **Zod v3 fallback** — if `~standard.vendor === "zod"` *and* the caller injected a `zodToJsonSchema` function via `options`, call it with `{ $refStrategy: "none" }`. (Dependency injection keeps `zod-to-json-schema` out of `shared`'s own deps.)
4. Otherwise **throw** a descriptive error naming the vendor and pointing the user at a Standard-JSON-Schema-capable library or the `zodToJsonSchema` option.

## Why injection

`shared` declares `zod` and `zod-to-json-schema` as dependencies for the legacy path, but `schemaToJsonSchema` is intentionally decoupled: the Zod v3 branch only works if a caller (e.g. a framework binding that already imports `zod-to-json-schema`) passes the function in. New code is expected to use schemas that implement Standard JSON Schema V1 directly, so branches 1–2 cover them with no injection.

Part of [[@copilotkit/shared]]. Underpins the schema side of [[Tools (Frontend & Backend)]] in the modern V2 stack ([[@copilotkit/core]], [[@copilotkit/react-core]], [[@copilotkit/vue]]). Regression-tested in `src/__tests__/standard-schema*.test.ts` and `zod-regression.test.ts`.
