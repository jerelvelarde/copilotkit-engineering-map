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

let fixed = 0;
const report = [];
for (const f of walk(VAULT)) {
  const c = fs.readFileSync(f, "utf8");
  const m = c.match(/^(---\n)([\s\S]*?)(\n---\n?)([\s\S]*)$/);
  if (!m) continue;
  let fm = m[2]; const body = m[4];
  const tm = fm.match(/^title:\s*(.+)$/m);
  if (!tm) continue;
  const title = tm[1].trim().replace(/^["']|["']$/g, "");
  const base = path.basename(f, ".md");
  if (title === base) continue;           // filename already matches the title -> Obsidian resolves it

  // collect existing aliases
  let aliases = [];
  const inline = fm.match(/^aliases:\s*\[(.*)\]\s*$/m);
  let mode = "none";
  if (inline) { aliases = inline[1].split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean); mode = "inline"; }
  else { const block = fm.match(/^aliases:\s*\n((?:[ \t]*-[ \t]*.+\n?)+)/m); if (block) { aliases = block[1].split("\n").map(l => { const x = l.match(/-[ \t]*(.+)/); return x ? x[1].trim().replace(/^["']|["']$/g, "") : null; }).filter(Boolean); mode = "block"; } }

  if (aliases.includes(title)) continue;  // already aliased
  const merged = [...aliases, title];
  const line = "aliases: [" + merged.map(a => JSON.stringify(a)).join(", ") + "]";

  let fm2;
  if (mode === "inline") fm2 = fm.replace(/^aliases:\s*\[.*\]\s*$/m, () => line);
  else if (mode === "block") fm2 = fm.replace(/^aliases:\s*\n(?:[ \t]*-[ \t]*.+\n?)+/m, () => line + "\n");
  else fm2 = fm.replace(/^title:.*$/m, (t0) => t0 + "\n" + line);

  fs.writeFileSync(f, m[1] + fm2 + m[3] + body);
  fixed++; report.push(path.relative(VAULT, f) + "  +alias→ " + title);
}
console.log("Overviews/notes aliased:", fixed);
for (const r of report) console.log("  " + r);
