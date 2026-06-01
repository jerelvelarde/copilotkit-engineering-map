---
title: "sdk-js - zodState"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/middleware.ts
tags: [copilotkit, sdk-js, langgraph, zod, standard-schema, state, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - zodState

`zodState<T extends object>(schema: T): WithJsonSchema<T>` — augments a Standard-Schema-compatible schema (e.g. a Zod field) so a LangGraph custom state key actually appears in the graph's `output_schema`. Defined in `src/langgraph/middleware.ts`, exported from `@copilotkit/sdk-js/langgraph`. Part of [[@copilotkit/sdk-js]]; relates to [[shared - standard-schema (schemaToJsonSchema)]].

## Why it exists

LangGraph's `StateSchema.getJsonSchema` calls `getJsonSchemaFromSchema`, which checks `isStandardJSONSchema()`. Zod v4 fields expose only `~standard.validate` + `vendor` (no `~standard.jsonSchema`), so that check fails and the field is **silently dropped** from `output_schema`. Because AG-UI `STATE_SNAPSHOT` events are filtered against the schema, the field then never reaches the frontend even though the thread state holds the value.

## What it does

If the schema's `~standard` exists and has no `jsonSchema` property, `zodState` attaches a lazy, cached `~standard.jsonSchema.input` hook. The hook prefers Zod v4's native `z.toJSONSchema(schema)`; if unavailable it returns `{}` (langgraph-api treats the field as an opaque object, which is enough to keep it in the schema). The original schema object is returned (mutated in place), typed as `WithJsonSchema<T>`.

## Usage

```ts
import { zodState } from "@copilotkit/sdk-js/langgraph";
import { z } from "zod";

const stateSchema = z.object({
  todos: zodState(z.array(TodoSchema).default(() => [])),
});
```

Apply it to any custom state field you want visible to the frontend via `useAgent().state.*`. The middleware itself wraps its internal `copilotkit` field with `zodState` — see [[sdk-js - createCopilotkitMiddleware]].
