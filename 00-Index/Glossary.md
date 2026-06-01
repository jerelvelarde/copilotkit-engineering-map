---
title: Glossary
type: moc
layer: meta
tags: [copilotkit, glossary, index, moc, layer/meta, type/moc]
---
# Glossary

Quick definitions of the core CopilotKit concepts. Each term links to its full note in the [[Concepts MOC|Architecture notes]]. For the relationships between them, see [[Concepts MOC]]; for the overall map, see [[🗺️ Home]].

## Architecture

- **[[Three-Layer Architecture]]** — the spine: Frontend → Runtime → Agent, each speaking AG-UI.
- **[[AG-UI Protocol]]** — the event-based SSE wire format every layer uses to exchange messages, tool calls, and state.
- **[[Request Lifecycle]]** — the end-to-end path of a single user message from frontend through runtime to agent and back.
- **[[@copilotkit vs @copilotkitnext]]** — the two npm scopes: what is built from this repo vs published externally.

## Frontend ↔ Runtime

- **[[ProxiedAgent]]** — the frontend `AbstractAgent` that forwards runs to the runtime over the wire.
- **[[Intelligence Platform vs SSE]]** — the two runtime transport modes and how the client auto-detects them.
- **[[Tools (Frontend & Backend)]]** — frontend tools, backend tools, and how tool calls round-trip between layers.
- **[[Context]]** — readable application state the client injects into every run.
- **[[Threads]]** — durable conversation grouping and history replay.
- **[[Suggestions]]** — dynamic and static next-message suggestions.

## Runtime internals

- **[[AgentRunner]]** — the runtime abstraction that executes and streams an agent run.
- **[[Middleware]]** — before/after request hooks plus auto-applied agent middleware.
- **[[A2UI (Generative UI)]]** — agent-driven generative UI and its supporting middlewares.
- **[[Multi-Agent]]** — running many agents under one runtime, routed by `agentId`.

## Operations & diagnostics

- **[[Debug Mode]]** — granular event/lifecycle logging across the stack.
- **[[DebugConfig]]** — the debug config shape and its `resolveDebugConfig` normalization.
- **[[Telemetry & Licensing]]** — anonymous telemetry, opt-out, and license gating.
