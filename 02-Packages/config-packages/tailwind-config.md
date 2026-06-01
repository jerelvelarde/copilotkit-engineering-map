---
title: tailwind-config
type: package
layer: tooling
package: "tailwind-config"
source:
  - packages/tailwind-config/package.json
  - packages/tailwind-config/tailwind.config.js
tags: [copilotkit, tooling, config, tailwind, css, layer/tooling, type/package, pkg/tailwind-config]
---
# tailwind-config

Shared **Tailwind CSS** preset for the monorepo's styled packages and demo apps. Published as the **unscoped, private** package **`tailwind-config`** at **v1.4.12** (`"private": true`, `main: "index.js"`). Pins **Tailwind v3** (`tailwindcss: "^3.2.4"` devDependency). Part of [[Config Packages MOC]].

## What it defines

`tailwind.config.js` is a CommonJS module exporting a Tailwind config object:

```js
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brandblue: colors.blue[500],
        brandred: colors.red[500],
      },
    },
  },
  plugins: [],
};
```

- **`content`** globs `src/**/*.{js,ts,jsx,tsx}` (a commented-out line shows how to also scan `../../packages/**` when not transpiling).
- **`theme.extend.colors`** adds two brand aliases — `brandblue` (Tailwind `blue-500`) and `brandred` (`red-500`).
- No custom `plugins`.

## Who consumes it

Declared as `"tailwind-config": "workspace:*"` (verified in `package.json`) by **[[@copilotkit/react-ui]]**, **[[@copilotkit/react-textarea]]**, and the `examples/v1/next-openai` + `examples/v1/next-pages-router` demo apps.

> [!note] Tailwind v3 here, Tailwind v4 elsewhere
> This shared preset targets Tailwind **v3**. Some newer packages run their own Tailwind toolchain instead — e.g. [[@copilotkit/web-inspector]] uses the **Tailwind v4** CLI (`@tailwindcss/cli`) to pre-build a `generated.css` it inlines into its Lit shadow DOM, and does not depend on this package.

Like the other config packages it ships a `typedoc.json` (`extends ../../typedoc.base.json`, empty `entryPoints`) so docs generation skips it.
