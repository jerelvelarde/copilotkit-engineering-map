---
title: showcase integration - spring-ai
type: app
layer: frontend
source:
  - showcase/integrations/spring-ai/manifest.yaml
  - showcase/integrations/spring-ai/src/app/api/copilotkit/route.ts
  - showcase/integrations/spring-ai/src/main/java/com/copilotkit/showcase/springai/Application.java
  - showcase/integrations/spring-ai/pom.xml
tags: [copilotkit, showcase, integration, spring-ai, java, layer/frontend, type/app]
---
# showcase integration - spring-ai

Showcase for [Spring AI](https://spring.io/projects/spring-ai) — a **Java** agent backend (`manifest.yaml` `sort_order: 170`, `category: enterprise-platform`, `language: java`, `docs_mode: hidden`). Member of [[Apps MOC]].

**Framework:** Spring Boot + Spring AI (`spring-ai.version 1.0.1`, `spring-ai-starter-model-openai`), bridged to AG-UI by the **community `com.ag-ui.community:spring-ai` SDK** (installed from source in the Dockerfile). Built with Maven (`pom.xml`).

**Structure:** canonical showcase **frontend** + a **Spring Boot app under `src/main/java/`** (this integration has no `requirements.txt`-driven Python backend; the `requirements.txt` present is vestigial/JS-only):
- `Application.java` — Spring Boot entrypoint.
- `*Controller.java` — one controller per demo surface (`AgentController`, `InterruptAgentController`, `SharedStateReadWriteController`, `SubagentsController`, `SharedStateStreamingController`, `ByocJsonRenderController`, …).
- `tools/*.java` — `@Tool`-style backend tools (`WeatherTool`, `SearchFlightsTool`, `ScheduleMeetingTool`, `GenerateA2uiTool`, `ManageSalesTodosTool`, …).
- `AimockHeader*.java` for mock-LLM tests; `application.properties` config. Unlike most showcases, dev is `next dev` only (the Java server is run/deployed separately).

**How it consumes CopilotKit:** standard HttpAgent bridge from `@ag-ui/client` — `new HttpAgent({ url: `${AGENT_URL}${path}` })` — registered in `new CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The Spring AI backend owns the LLM (OpenAI) and tool calling and streams [[AG-UI Protocol]] events the runtime proxies ([[ProxiedAgent]]).

**Parity:** `PARITY_NOTES.md` documents that demos depending on LangGraph-specific primitives (native interrupt, multi-agent orchestration, MCP-driven UI) are skipped; interrupt scheduling is adapted ("Strategy B"). `generative_ui` omits `a2ui-fixed-schema`; `not_supported_features` is broader than the Python showcases.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]] (dynamic-schema only). Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
