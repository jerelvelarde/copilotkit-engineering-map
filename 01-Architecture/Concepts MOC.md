---
title: Concepts MOC
type: moc
layer: meta
tags: [copilotkit, architecture, moc, layer/meta, type/moc]
---
# Concepts MOC

Cross-cutting concepts that span the CopilotKit packages. Each concept note explains the idea and links to the concrete packages/symbols that implement it. Start here, then dive into [[🗺️ Home|the package overviews]] for package-level detail.

## The big picture

- [[Three-Layer Architecture]] — Frontend → Runtime → Agent, the spine of the whole framework.
- [[AG-UI Protocol]] — the event-based SSE wire format every layer speaks.
- [[Request Lifecycle]] — what happens end-to-end when a user sends a message.
- [[@copilotkit vs @copilotkitnext]] — which scope is built here vs published externally.

## Frontend ↔ Runtime wiring

- [[ProxiedAgent]] — the frontend `AbstractAgent` that forwards runs to the runtime.
- [[Intelligence Platform vs SSE]] — the two runtime modes and how the client auto-detects them.
- [[Tools (Frontend & Backend)]] — frontend tools, backend tools, and how tool calls round-trip.
- [[Context]] — readable context the client injects into every run.
- [[Threads]] — durable conversation grouping and history replay.
- [[Suggestions]] — dynamic/static next-message suggestions.

## Runtime internals

- [[AgentRunner]] — the runtime abstraction that executes/streams an agent run.
- [[Middleware]] — before/after request hooks plus auto-applied agent middleware.
- [[A2UI (Generative UI)]] — agent-driven generative UI and the three UI middlewares.
- [[Multi-Agent]] — many agents under one runtime, routed by `agentId`.

## Operations & diagnostics

- [[Debug Mode]] — granular event/lifecycle logging.
- [[DebugConfig]] — the config shape and `resolveDebugConfig` normalization.
- [[Telemetry & Licensing]] — anonymous telemetry, opt-out, and license gating.

## Implementing packages

The concepts above are realized primarily in [[@copilotkit/core]] (frontend orchestrator), [[@copilotkit/runtime]] (server), and [[@copilotkit/shared]] (cross-cutting types/utilities), with framework bindings in [[@copilotkit/react-core]], [[@copilotkitnext/angular]], and [[@copilotkit/vue]].
