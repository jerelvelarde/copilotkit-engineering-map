---
title: Example - integration agentcore
type: example
layer: frontend
source:
  - examples/integrations/agentcore
tags: [copilotkit, examples, integrations, aws, bedrock, agentcore, langgraph, strands, layer/frontend, type/example]
---
# Example - integration agentcore

CopilotKit on **AWS Bedrock AgentCore** — a chat UI with generative charts, a shared-state todo canvas, and inline tool rendering, deployable to AWS with a choice of **LangGraph** or **Strands** agent. The most infra-heavy integration. Part of [[Examples - integrations]].

- **Framework:** LangGraph or AWS Strands (Python), under `agents/` (`langgraph-single-agent/`, `strands-single-agent/`, shared `utils/`). No root `package.json`; the app is split into `frontend/` (Next.js) plus `infra-cdk/` and `infra-terraform/` provisioning.
- **Deploy:** `deploy-langgraph.sh` / `deploy-strands.sh` (with `--skip-frontend` / `--skip-backend`) build infra + agent on AWS Bedrock AgentCore and an Amplify-hosted frontend; auth via email sign-in.
- **Demonstrates:** generative charts, shared-state todo canvas, and inline tool rendering over the [[AG-UI Protocol]], running on the AWS AgentCore runtime; relates to the local [[@copilotkit/agentcore-runner]] runner package.
- **CopilotKit packages:** `frontend/package.json` uses [[@copilotkit/react-core]], [[@copilotkit/react-ui]] (`^1.54.0`).
- **Frontend:** Next.js under `frontend/`.
