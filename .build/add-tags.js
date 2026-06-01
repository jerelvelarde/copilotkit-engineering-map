const fs = require("fs");
const path = require("path");
const VAULT = require("path").resolve(__dirname, "..");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".obsidian" || e.name === ".build" || e.name.startsWith(".git")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}
const slug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9\-/]+/g, "-").replace(/^-|-$/g, "");
const uniq = (a) => [...new Set(a)];

const files = walk(VAULT);
const taxonomy = {};
let changed = 0, skipped = 0;

for (const f of files) {
  const c = fs.readFileSync(f, "utf8");
  const m = c.match(/^(---\n)([\s\S]*?)(\n---\n?)([\s\S]*)$/);
  if (!m) { skipped++; continue; }
  let fm = m[2]; const body = m[4];
  const get = (k) => { const r = fm.match(new RegExp("^" + k + ":\\s*(.+)$", "m")); return r ? r[1].trim().replace(/^["']|["']$/g, "") : null; };
  const type = get("type"), layer = get("layer"), pkg = get("package");

  // existing tags (inline or block)
  let existing = [], mode = "none";
  const inline = fm.match(/^tags:\s*\[(.*)\]\s*$/m);
  if (inline) { existing = inline[1].split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean); mode = "inline"; }
  else { const block = fm.match(/^tags:\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/m); if (block) { existing = block[1].split("\n").map(l => { const x = l.match(/-[ \t]*(.+)/); return x ? x[1].trim().replace(/^["']|["']$/g, "") : null; }).filter(Boolean); mode = "block"; } }

  const add = ["copilotkit"];
  if (layer) add.push("layer/" + slug(layer));
  if (type) add.push("type/" + slug(type));
  if (pkg) add.push("pkg/" + slug(pkg.split("/").pop()));
  const merged = uniq([...existing, ...add]);
  for (const t of add) taxonomy[t] = (taxonomy[t] || 0) + 1;

  const newLine = "tags: [" + merged.join(", ") + "]";
  let fm2;
  if (mode === "inline") fm2 = fm.replace(/^tags:\s*\[.*\]\s*$/m, newLine);
  else if (mode === "block") fm2 = fm.replace(/^tags:\s*\n(?:[ \t]*-[ \t]*.+\n?)+/m, newLine + "\n");
  else fm2 = fm.replace(/\s*$/, "") + "\n" + newLine;

  const out = m[1] + fm2 + m[3] + body;
  if (out !== c) { fs.writeFileSync(f, out); changed++; }
}

console.log("Notes updated:", changed, "| skipped (no frontmatter):", skipped, "| total:", files.length);
console.log("\nTag taxonomy added (tag : note count):");
for (const k of Object.keys(taxonomy).sort()) console.log("  #" + k + "  (" + taxonomy[k] + ")");
