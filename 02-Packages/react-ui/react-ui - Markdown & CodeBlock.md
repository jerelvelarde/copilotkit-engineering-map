---
title: react-ui - Markdown & CodeBlock
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Markdown.tsx
  - packages/react-ui/src/components/chat/CodeBlock.tsx
tags: [copilotkit, react-ui, markdown, codeblock, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - Markdown & CodeBlock

Markdown rendering for assistant messages, with syntax-highlighted, copyable, downloadable code blocks. Part of [[@copilotkit/react-ui]].

**`Markdown`** (`Markdown.tsx`) — wraps a memoized `react-markdown`. It:
- Merges a `defaultComponents` map (every element gets a `copilotKitMarkdownElement` class; links open in a new tab; paragraphs render as `div.copilotKitParagraph`) with any user `components` (the `markdownTagRenderers` / `ComponentsMap` passed down from [[react-ui - CopilotChat]] → [[react-ui - Messages]]).
- Configures plugins: `remarkGfm`, `remarkMath` (`singleDollarTextMath: false`), and `rehypeRaw` (so raw HTML in markdown is rendered), plus any user-supplied plugins.
- Handles a streaming cursor: a `▍` block becomes a pulsing animated span; inline-vs-block code is detected by language class or embedded newlines, routing block code to `CodeBlock`.

**`CodeBlock`** (`CodeBlock.tsx`) — a memoized fenced-code renderer:
- Uses `react-syntax-highlighter` — starts with the lightweight `Light` build and upgrades to `Prism` after confirming lookbehind regex support (avoids SSR/old-engine crashes).
- Toolbar shows the language plus download and copy buttons (`useCopyToClipboard`, see [[react-ui - hooks (useDarkMode/usePushToTalk)]]).
- `downloadAsFile` builds a Blob and prompts for a filename, mapping language → extension via the exported `programmingLanguages` map; `generateRandomString` makes a default filename.
- Ships an inlined `vscDarkPlus`-style theme (`highlightStyle`) because importing the upstream style broke the Next.js classic (pages router) build.

**Collaborators:** consumed by `AssistantMessage` / `ErrorMessage` in [[react-ui - Messages]]; icons from `chat/Icons.tsx`.
