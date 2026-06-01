---
title: docs - Fumadocs setup
type: subsystem
layer: docs
source:
  - docs/source.config.ts
  - docs/app/source.ts
  - docs/app/layout.tsx
  - docs/app/layout.config.tsx
  - docs/app/(home)/layout.tsx
  - docs/app/(home)/[[...slug]]/page.tsx
  - docs/package.json
tags: [copilotkit, docs, fumadocs, nextjs, mdx, layer/docs, type/subsystem]
---
# docs - Fumadocs setup

The documentation site is a **Next.js App Router** app (`next ^16`, React `^19`) built on **Fumadocs** — `fumadocs-core`, `fumadocs-ui`, `fumadocs-mdx` (all `^16`/`^14`) — plus `fumadocs-docgen` and `fumadocs-typescript`. Part of the [[Docs-Site MOC]].

## The content pipeline

`source.config.ts` is the Fumadocs build config. It calls `defineDocs({ docs, meta })` to declare the MDX collection and extends the default `frontmatterSchema` with three optional fields:

```ts
const extendedFrontmatterSchema = frontmatterSchema.extend({
  hideHeader: z.boolean().optional(),
  hideTOC: z.boolean().optional(),
  doc_type: z.enum(["how-to","explanation","reference","tutorial"]).optional(),
});
```

`defineConfig({ mdxOptions })` wires the markdown toolchain:
- **rehype:** `rehypeCode` with Shiki transformers — `transformerNotationDiff`, `transformerNotationHighlight`, `transformerNotationWordHighlight` (all `matchAlgorithm: "v3"`) for `// [!code]` annotations in fenced code.
- **remark:** `remarkMermaid` (renders ```mermaid blocks), `remarkInstall` (the `npm`/`pnpm`/`yarn`/`bun` package-manager tabs, persisted under id `package-manager`), and `remarkDocGen` with `fileGenerator()` (lets MDX embed file contents).

The `postinstall` script runs `fumadocs-mdx`, which compiles `content/` into a generated `.source/` module. `next.config.mjs` wraps the config with `createMDX()` from `fumadocs-mdx/next`.

## The source loader

`app/source.ts` is tiny and central — every page, the sitemap, search, and OG routes import it:

```ts
import { docs } from "@/.source/server";
export const source = loader({ baseUrl: "/", source: docs.toFumadocsSource(), icon });
```

`loader()` (from `fumadocs-core/source`) exposes `source.getPage(slug)`, `source.getPages()`, `source.generateParams()`, and `source.pageTree`. The `icon` resolver is from `@/lib/icons`. Because `baseUrl` is `/`, docs live at the site root (e.g. `/quickstart`, not `/docs/quickstart`).

## Layouts

- `app/layout.tsx` — root HTML. Fonts (`Plus_Jakarta_Sans` body, `Spline_Sans_Mono`), the Fumadocs `RootProvider` (theme enabled, system default; custom `SearchDialog`), a `ProvidersWrapper`, top `Banners`, and three injected analytics scripts (HubSpot, reb2b, Reo).
- `app/layout.config.tsx` — shared `baseOptions` for Fumadocs layouts: `githubUrl` and a custom `<Navbar>` fed `source.pageTree`.
- `app/(home)/layout.tsx` — the docs shell. It runs the tree through [[docs - navigation (meta.json)|patchPageTree]], renders a custom `Navbar`, a `ConditionalSidebar`, `ScrollReset`, and the Fumadocs `DocsLayout` with its own nav/sidebar/search **disabled** (CopilotKit supplies bespoke chrome).

## The MDX component map

`app/(home)/[[...slug]]/page.tsx` (the catch-all docs page, mirrored by `app/integrations/[[...slug]]/page.tsx`) renders `page.data.body` with a large `mdxComponents` map: Fumadocs defaults plus `Tabs/Tab`, `Steps/Step`, `TypeTable`, `Callout`, `Frame`, `Mermaid`, `Cards/Card`, `Accordions/Accordion`, `PropertyReference`, and CopilotKit-specific MDX components (`LinkToCopilotCloud`, `OpsPlatformCTA`, `SignupLink`, `InsecurePasswordProtected`). The `a` override routes internal links through a `NavigationLink` (preserving the active sub-doc) while leaving hash/anchor and Fumadocs heading-anchor links as plain `<a>`; `pre` is wrapped in Fumadocs `CodeBlock`.

The page also computes UI affordances: a **Cloud Only** badge (`cloudOnlyFeatures` allow-list), a **Premium** badge (slug contains `premium`, title heuristic, or frontmatter flag), `hideHeader`/`hideTOC` from frontmatter, and a TOC merged with [[docs - snippets|snippet TOCs]]. Page metadata emits a `doc-type` meta tag from the `doc_type` frontmatter.

## Build & test

No test framework — this is a content app. `npm run dev` / `npm run build` are plain `next` commands gated by `predev`/`prebuild` hooks (see [[docs - build & deploy]]). It is **not** an Nx project; it builds standalone on Vercel. Styling is Tailwind v4 via `@tailwindcss/postcss` + `app/global.css`, with `components.json` (shadcn-style) and Radix primitives.
