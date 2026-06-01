const fs = require("fs");
const VAULT = require("path").resolve(__dirname, "..");
const CANVAS = VAULT + "/_canvas";

// ---- helpers ----
const W = 240, H = 60;
const fileNode = (id, file, x, y, color) => ({ id, type: "file", file, x, y, width: W, height: H, ...(color ? { color } : {}) });
const textNode = (id, text, x, y, w, h, color) => ({ id, type: "text", text, x, y, width: w, height: h, ...(color ? { color } : {}) });
const group = (id, label, x, y, w, h, color) => ({ id, type: "group", label, x, y, width: w, height: h, ...(color ? { color } : {}) });
const edge = (id, fromNode, toNode, fromSide, toSide, label, color) => ({ id, fromNode, toNode, fromSide, toSide, ...(label ? { label } : {}), ...(color ? { color } : {}) });
const pk = (slug) => `02-Packages/${slug}`;
const arch = (name) => `01-Architecture/${name}.md`;
const write = (name, obj) => { fs.writeFileSync(`${CANVAS}/${name}`, JSON.stringify(obj, null, 2)); console.log("wrote", name, "-", obj.nodes.length, "nodes,", obj.edges.length, "edges"); };

// colors (canvas presets "1".."6": 1 red,2 orange,3 yellow,4 green,5 cyan,6 purple)
const FE = "6", RT = "5", AGENT = "2", SHARED = "3", TOOL = "4";

// overview file paths
const OV = {
  shared: pk("shared/shared.md"), core: pk("core/core.md"), runtime: pk("runtime/runtime.md"),
  rcgql: pk("runtime-client-gql/runtime-client-gql.md"), reactCore: pk("react-core/react-core.md"),
  reactUi: pk("react-ui/react-ui.md"), reactTextarea: pk("react-textarea/react-textarea.md"),
  reactNative: pk("react-native/react-native.md"), angular: pk("angular/angular.md"), vue: pk("vue/vue.md"),
  a2ui: pk("a2ui-renderer/a2ui-renderer.md"), voice: pk("voice/voice.md"), webInspector: pk("web-inspector/web-inspector.md"),
  sdkjs: pk("sdk-js/sdk-js.md"), sqlite: pk("sqlite-runner/sqlite-runner.md"), agentcore: pk("agentcore-runner/agentcore-runner.md"),
  demo: pk("demo-agents/demo-agents.md"), tsconfig1: pk("config-packages/typescript-config.md"),
  tsconfig2: pk("config-packages/tsconfig (legacy presets).md"), tailwind: pk("config-packages/tailwind-config.md"),
};

// =================== 1) Package Dependency Graph ===================
(() => {
  const nodes = [], edges = [];
  nodes.push(textNode("title", "# Package Dependency Graph\nAll 20 packages, edges = depends-on (internal @copilotkit/* only). Foundation at bottom.", -700, -150, 700, 80));
  nodes.push(textNode("legend", "**Node color = layer:**  🟣 frontend · 🟢 runtime · 🟠 agent · 🟡 shared · 🟢 tooling(config)", -700, -56, 800, 32));
  // tier positions
  const T0 = 0, T1 = 200, T2 = 420, T3 = 640;
  const place = [
    // T0 leaves / UI
    ["react-ui", OV.reactUi, -700, T0, FE], ["react-textarea", OV.reactTextarea, -430, T0, FE],
    ["react-native", OV.reactNative, -160, T0, FE], ["angular", OV.angular, 110, T0, FE], ["vue", OV.vue, 380, T0, FE],
    // T1
    ["react-core", OV.reactCore, -560, T1, FE], ["a2ui-renderer", OV.a2ui, -290, T1, FE], ["web-inspector", OV.webInspector, -20, T1, FE],
    ["voice", OV.voice, 250, T1, RT], ["sqlite-runner", OV.sqlite, 520, T1, RT], ["agentcore-runner", OV.agentcore, 790, T1, RT],
    ["sdk-js", OV.sdkjs, 1060, T1, AGENT], ["demo-agents", OV.demo, 1330, T1, AGENT],
    // T2
    ["core", OV.core, -430, T2, FE], ["runtime-client-gql", OV.rcgql, -160, T2, FE], ["runtime", OV.runtime, 520, T2, RT],
    // T3 foundation
    ["shared", OV.shared, -160, T3, SHARED],
    // config cluster (right)
    ["typescript-config", OV.tsconfig1, 1060, T2, TOOL], ["tsconfig", OV.tsconfig2, 1060, T2 + 90, TOOL], ["tailwind-config", OV.tailwind, 1330, T2, TOOL],
  ];
  for (const [id, file, x, y, c] of place) nodes.push(fileNode(id, file, x, y, c));
  const deps = [
    ["core", "shared"], ["runtime-client-gql", "shared"], ["runtime", "shared"], ["sdk-js", "shared"],
    ["react-core", "core"], ["react-core", "runtime-client-gql"], ["react-core", "shared"], ["react-core", "a2ui-renderer"], ["react-core", "web-inspector"],
    ["react-ui", "react-core"], ["react-ui", "runtime-client-gql"], ["react-ui", "shared"],
    ["react-textarea", "react-core"], ["react-textarea", "runtime-client-gql"], ["react-textarea", "shared"],
    ["react-native", "core"], ["react-native", "react-core"], ["react-native", "shared"],
    ["angular", "core"], ["angular", "shared"], ["vue", "core"], ["vue", "shared"], ["vue", "web-inspector"],
    ["web-inspector", "core"], ["sqlite-runner", "runtime"], ["agentcore-runner", "runtime"], ["voice", "runtime"],
  ];
  let i = 0;
  for (const [a, b] of deps) edges.push(edge("d" + i++, a, b, "bottom", "top"));
  write("Package Dependency Graph.canvas", { nodes, edges });
})();

// =================== 2) Architecture Overview ===================
(() => {
  const nodes = [], edges = [];
  nodes.push(textNode("title", "# Architecture Overview\nFrontend → Runtime → Agent, all over the AG-UI protocol.", -760, -150, 760, 80));
  nodes.push(group("gFE", "Frontend (browser)", -760, 0, 1500, 240, FE));
  nodes.push(group("gRT", "Runtime (server — trust & protocol boundary)", -760, 320, 1500, 250, RT));
  nodes.push(group("gAG", "Agent", -760, 650, 1500, 220, AGENT));
  // frontend
  nodes.push(fileNode("core", OV.core, -200, 60, FE));
  nodes.push(fileNode("reactCore", OV.reactCore, -540, 60, FE));
  nodes.push(textNode("bindings", "**Other bindings**\nreact-ui · vue · angular · react-native · react-textarea", 140, 60, 320, 60, FE));
  nodes.push(fileNode("proxied", arch("ProxiedAgent"), -200, 150, FE));
  // runtime
  nodes.push(fileNode("handler", arch("Request Lifecycle"), -540, 380, RT));
  nodes.push(fileNode("rt", "02-Packages/runtime/runtime - CopilotRuntime (v2).md", -200, 380, RT));
  nodes.push(fileNode("mw", arch("Middleware"), 140, 380, RT));
  nodes.push(fileNode("runner", arch("AgentRunner"), -200, 470, RT));
  // agent
  nodes.push(fileNode("builtin", "02-Packages/runtime/runtime - BuiltInAgent.md", -540, 710, AGENT));
  nodes.push(textNode("external", "**External frameworks**\nLangGraph · CrewAI · Mastra · ADK · custom AbstractAgent", -160, 710, 340, 60, AGENT));
  nodes.push(fileNode("sdkpy", "05-SDK-Python/sdk-python - overview.md", 260, 710, AGENT));
  // side
  nodes.push(fileNode("shared", OV.shared, 900, 90, SHARED));
  nodes.push(fileNode("agui", arch("AG-UI Protocol"), 900, 390, RT));
  edges.push(edge("e1", "reactCore", "core", "right", "left", "wraps"));
  edges.push(edge("e2", "core", "proxied", "bottom", "top"));
  edges.push(edge("e3", "proxied", "handler", "bottom", "top", "AG-UI / SSE"));
  edges.push(edge("e4", "handler", "rt", "right", "left"));
  edges.push(edge("e5", "rt", "runner", "bottom", "top"));
  edges.push(edge("e6", "runner", "builtin", "bottom", "top"));
  edges.push(edge("e7", "runner", "external", "bottom", "top"));
  edges.push(edge("e8", "runner", "proxied", "right", "right", "SSE event stream"));
  write("Architecture Overview.canvas", { nodes, edges });
})();

// =================== 3) Runtime Internals ===================
(() => {
  const nodes = [], edges = [];
  const rf = (n) => `02-Packages/runtime/${n}.md`;
  nodes.push(textNode("title", "# Runtime Internals\n@copilotkit/runtime is dual-architecture: modern V2 (fetch) + legacy V1 (GraphQL), plus the BuiltInAgent and 9 service adapters.", -40, -150, 760, 90));
  // V2 grid
  const v2 = ["runtime - createCopilotRuntimeHandler", "runtime - CopilotRuntime (v2)", "runtime - Routing & CORS", "runtime - Middleware (v2)",
    "runtime - AgentRunner (base)", "runtime - InMemoryAgentRunner", "runtime - Endpoints (Express_Hono_Node)", "runtime - Handlers (run_connect_stop)",
    "runtime - Thread Handlers", "runtime - Transcribe Handler", "runtime - Intelligence Platform Client", "runtime - SSE Streaming", "runtime - Hooks & Debug Event Bus"];
  nodes.push(group("gV2", "V2 — modern fetch runtime (src/v2/)", -40, 0, 1100, 480, RT));
  v2.forEach((n, i) => { const col = i % 4, row = (i / 4) | 0; nodes.push(fileNode("v2_" + i, rf(n), -20 + col * 270, 50 + row * 100, RT)); });
  // V1
  const v1 = ["runtime - GraphQL Layer (v1)", "runtime - LangGraphAgent (v1)", "runtime - Framework Integrations (v1)", "runtime - Logging (Pino)"];
  nodes.push(group("gV1", "V1 — legacy GraphQL", -40, 520, 540, 260, "1"));
  v1.forEach((n, i) => { const col = i % 2, row = (i / 2) | 0; nodes.push(fileNode("v1_" + i, rf(n), -20 + col * 260, 570 + row * 100, "1")); });
  // Agent
  nodes.push(group("gAgent", "BuiltInAgent", 540, 520, 520, 160, AGENT));
  nodes.push(fileNode("ag0", rf("runtime - BuiltInAgent"), 560, 570, AGENT));
  nodes.push(fileNode("ag1", rf("runtime - AI SDK Converters"), 810, 570, AGENT));
  // Adapters
  const ad = ["runtime - Service Adapter (interface)", "runtime - OpenAI Adapter", "runtime - OpenAI Assistant Adapter", "runtime - Anthropic Adapter",
    "runtime - Google GenAI Adapter", "runtime - Groq Adapter", "runtime - LangChain Adapter", "runtime - Bedrock Adapter", "runtime - Unify Adapter", "runtime - Ollama Adapter (experimental)"];
  nodes.push(group("gAd", "Service Adapters (V1 LLM providers)", 1120, 0, 840, 780, "2"));
  ad.forEach((n, i) => { const col = i % 3, row = (i / 3) | 0; nodes.push(fileNode("ad_" + i, rf(n), 1140 + col * 270, 50 + row * 100, "2")); });
  edges.push(edge("r1", "v2_0", "v2_1", "right", "left"));
  edges.push(edge("r2", "v2_1", "v2_4", "bottom", "top"));
  edges.push(edge("r3", "v2_4", "v2_5", "right", "left"));
  edges.push(edge("r4", "ag0", "ag1", "right", "left"));
  write("Runtime Internals.canvas", { nodes, edges });
})();

// =================== 4) Concept Map ===================
(() => {
  const nodes = [], edges = [];
  nodes.push(textNode("title", "# Concept Map\nCross-cutting concepts (left) and the packages that implement them (right).", -760, -230, 700, 70));
  nodes.push(group("gConcepts", "Concepts (01-Architecture)", -800, -130, 320, 1240, "6"));
  nodes.push(group("gPkgs", "Implementing packages", 160, -130, 320, 1010, "5"));
  const concepts =["AG-UI Protocol", "AgentRunner", "Tools (Frontend & Backend)", "Context", "Multi-Agent", "Suggestions", "Threads", "Middleware", "A2UI (Generative UI)", "Intelligence Platform vs SSE", "ProxiedAgent", "Telemetry & Licensing", "Debug Mode"];
  concepts.forEach((c, i) => nodes.push(fileNode("c_" + i, arch(c), -760, i * 86, "6")));
  const pkgs = { core: OV.core, runtime: OV.runtime, reactCore: OV.reactCore, shared: OV.shared, a2ui: OV.a2ui, rcgql: OV.rcgql };
  const order = ["core", "runtime", "reactCore", "shared", "a2ui", "rcgql"];
  order.forEach((k, i) => nodes.push(fileNode("p_" + k, pkgs[k], 200, i * 150 + 60, k === "runtime" ? RT : k === "shared" ? SHARED : FE)));
  const link = (ci, pk2) => edges.push(edge(`m${ci}_${pk2}`, "c_" + ci, "p_" + pk2, "right", "left"));
  // concept index -> packages
  link(0, "runtime"); link(0, "core");           // AG-UI
  link(1, "runtime");                              // AgentRunner
  link(2, "core"); link(2, "runtime");            // Tools
  link(3, "core");                                 // Context
  link(4, "runtime");                              // Multi-Agent
  link(5, "core");                                 // Suggestions
  link(6, "core"); link(6, "runtime");            // Threads
  link(7, "runtime");                              // Middleware
  link(8, "a2ui"); link(8, "runtime");            // A2UI
  link(9, "core"); link(9, "runtime");            // Intelligence vs SSE
  link(10, "core");                                // ProxiedAgent
  link(11, "shared"); link(11, "runtime");        // Telemetry & Licensing
  link(12, "shared");                              // Debug Mode
  write("Concept Map.canvas", { nodes, edges });
})();

// =================== graph.json (tuned, colored by folder) ===================
(() => {
  const tg = (q, hex) => ({ query: q, color: { a: 1, rgb: parseInt(hex, 16) } });
  const graph = {
    "collapse-filter": true, search: "", showTags: false, showAttachments: false, hideUnresolved: false, showOrphans: true,
    "collapse-color-groups": false,
    colorGroups: [
      tg("tag:#layer/frontend", "a882ff"), tg("tag:#layer/runtime", "3fb950"), tg("tag:#layer/agent", "ff8c42"),
      tg("tag:#layer/shared", "e3b341"), tg("tag:#layer/tooling", "fa5f67"), tg("tag:#layer/docs", "2ec4b6"),
      tg("tag:#layer/meta", "cbd5e1"),
    ],
    "collapse-display": false, showArrow: false, textFadeMultiplier: -0.3, nodeSizeMultiplier: 1.15, lineSizeMultiplier: 0.9,
    "collapse-forces": false, centerStrength: 0.32, repelStrength: 12, linkStrength: 0.65, linkDistance: 85, scale: 0.45, close: false,
  };
  fs.writeFileSync(VAULT + "/.obsidian/graph.json", JSON.stringify(graph, null, 2));
  console.log("wrote .obsidian/graph.json with", graph.colorGroups.length, "color groups");
})();

console.log("DONE");
