---
title: shared - Parameter & Action Types
type: symbol
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/types/action.ts
  - packages/shared/src/utils/json-schema.ts
tags: [copilotkit, shared, actions, parameters, json-schema, zod, layer/shared, type/symbol, pkg/shared]
---
# shared - Parameter & Action Types

The legacy V1 action model and its type-level argument inference, plus the bidirectional **Parameter ↔ JSON Schema ↔ Zod** conversion utilities. This is the shape behind V1 `useCopilotAction` and backend actions; see [[Tools (Frontend & Backend)]] for how the broader tool concept layers on top.

## `Parameter` (discriminated union)

`src/types/action.ts` defines a discriminated union over a `type` field drawn from `TypeMap` keys (`string`, `number`, `boolean`, `object`, and their `[]` array variants). Special cases narrow the shape:

```ts
type AbstractParameter = { name: string; type?: keyof TypeMap; description?: string; required?: boolean };
interface StringParameter      extends AbstractParameter { type: "string"; enum?: string[] }
interface ObjectParameter      extends AbstractParameter { type: "object";   attributes?: Parameter[] }
interface ObjectArrayParameter extends AbstractParameter { type: "object[]"; attributes?: Parameter[] }
export type Parameter = BaseParameter | StringParameter | ObjectParameter | ObjectArrayParameter;
```

`string` params can carry an `enum`; `object` / `object[]` params nest `attributes: Parameter[]` recursively.

## `Action<T>` and `MappedParameterTypes<T>`

```ts
export type Action<T extends Parameter[] | [] = []> = {
  name: string;
  description?: string;
  parameters?: T;
  handler?: T extends [] ? () => any | Promise<any>
                         : (args: MappedParameterTypes<T>) => any | Promise<any>;
  additionalConfig?: Record<string, any>;
};
```

**`MappedParameterTypes<T>`** is the type-level engine that turns a `Parameter[]` literal into the strongly-typed argument object the `handler` receives — keyed by each parameter's `name`, with `enum` narrowing, recursive object mapping, array handling, and `| undefined` for `required: false`. (Empty params → `Record<string, any>`.) The file preserves the original "superhuman" version in a long comment with an attribution link; the active implementation is the refactored split into `OptionalParameterType` / `StringParameterType` / `ObjectParameterType` / `ObjectArrayParameterType` / `BaseParameterType`.

## Conversion utilities (`src/utils/json-schema.ts`)

A self-contained JSON-Schema dialect (`JSONSchema` union of string/number/boolean/object/array) plus converters:

- **`actionParametersToJsonSchema(params)`** → wraps `Parameter[]` into a `{ type: "object", properties, required }` schema. A param is required unless `required === false`.
- **`jsonSchemaToActionParameters(schema)`** → inverse. Handles null-union types like `["string","null"]` by picking the non-null type (and marking optional), maps `object`/`array-of-object` to nested `attributes`.
- **`convertJsonSchemaToZodSchema(jsonSchema, required, definitions?, visitedRefs?)`** → a full JSON-Schema → Zod v3 compiler: resolves `$ref` against `$defs`/`definitions`, **detects circular `$ref` cycles** (falls back to `z.any()` with a warning), handles `anyOf`/`oneOf` → `z.union`, null-unions, objects/arrays/enums/primitives, and warns-then-`z.any()` on unsupported types rather than throwing.
- **`getZodParameters(parameters)`** → convenience: `Parameter[]` → JSON Schema → `z.ZodSchema` (or `z.object({})` when empty).

This file depends on `zod`. For the *modern* schema path (Standard Schema → JSON Schema, no Zod assumption) see [[shared - standard-schema (schemaToJsonSchema)]].

Part of [[shared - Types]] and [[@copilotkit/shared]]. Consumed by [[@copilotkit/runtime]] service adapters and [[@copilotkit/sdk-js]] (which converts actions to LangChain `DynamicStructuredTool`s) — implements the registry shape described in [[Tools (Frontend & Backend)]].
