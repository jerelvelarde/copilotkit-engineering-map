const fs = require("fs");
const path = require("path");
const VAULT = require("path").resolve(__dirname, "..");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".obsidian" || e.name === ".build" || e.name.startsWith(".git")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const all = walk(VAULT);
const mdFiles = all.filter(f => f.endsWith(".md"));
const canvasFiles = all.filter(f => f.endsWith(".canvas"));

// ---- build resolvable target set (lowercased): basenames, titles, aliases ----
const resolvable = new Set();
const titleOf = {};
for (const f of mdFiles) {
  const base = path.basename(f, ".md");
  resolvable.add(base.toLowerCase());
  const c = fs.readFileSync(f, "utf8");
  const fm = c.match(/^---\n([\s\S]*?)\n---/);
  if (fm) {
    // Obsidian resolves [[links]] by filename + aliases ONLY (not by frontmatter title),
    // so title is intentionally NOT added to the resolvable set.
    // aliases: inline [a, b] or block list
    const inline = fm[1].match(/^aliases:\s*\[(.+)\]/m);
    if (inline) inline[1].split(",").forEach(a => resolvable.add(a.trim().replace(/^["']|["']$/g, "").toLowerCase()));
    const block = fm[1].match(/^aliases:\s*\n((?:\s*-\s*.+\n?)+)/m);
    if (block) block[1].split("\n").forEach(l => { const m = l.match(/-\s*(.+)/); if (m) resolvable.add(m[1].trim().replace(/^["']|["']$/g, "").toLowerCase()); });
  }
}

// ---- scan wikilinks (strip frontmatter + code) ----
let totalLinks = 0;
const broken = {};
for (const f of mdFiles) {
  let c = fs.readFileSync(f, "utf8");
  c = c.replace(/^---\n[\s\S]*?\n---\n?/, "");      // drop frontmatter
  c = c.replace(/```[\s\S]*?```/g, "");               // drop fenced code
  c = c.replace(/`[^`]*`/g, "");                       // drop inline code
  for (const m of c.matchAll(/\[\[([^\]]+)\]\]/g)) {
    totalLinks++;
    const target = m[1].split("|")[0].split("#")[0].trim().toLowerCase();
    if (!target) continue;
    if (!resolvable.has(target)) {
      (broken[m[1].split("|")[0].trim()] ||= []).push(path.relative(VAULT, f));
    }
  }
}

// ---- canvas file-node validation ----
const canvasMissing = [];
let canvasFileNodes = 0;
for (const cf of canvasFiles) {
  let data;
  try { data = JSON.parse(fs.readFileSync(cf, "utf8")); }
  catch (e) { canvasMissing.push(`PARSE ERROR ${path.basename(cf)}: ${e.message}`); continue; }
  for (const n of data.nodes || []) {
    if (n.type === "file") {
      canvasFileNodes++;
      if (!fs.existsSync(path.join(VAULT, n.file))) canvasMissing.push(`${path.basename(cf)} -> MISSING ${n.file}`);
    }
  }
}

// ---- per-area counts ----
const areas = {};
for (const f of mdFiles) { const rel = path.relative(VAULT, f); const top = rel.split(path.sep)[0]; areas[top] = (areas[top] || 0) + 1; }

console.log("=== CopilotKit KB — Final Verification ===");
console.log("Total .md notes:", mdFiles.length);
console.log("Total .canvas boards:", canvasFiles.length, "| file-nodes:", canvasFileNodes);
console.log("Total wikilinks scanned (excl. frontmatter/code):", totalLinks);
console.log("");
console.log("Notes per area:");
for (const k of Object.keys(areas).sort()) console.log("  " + k + ": " + areas[k]);
console.log("");
const bk = Object.keys(broken);
console.log("BROKEN LINKS:", bk.length);
for (const k of bk) console.log("  [[" + k + "]]  <- " + [...new Set(broken[k])].slice(0, 4).join(", "));
console.log("");
console.log("CANVAS missing/parse issues:", canvasMissing.length);
for (const m of canvasMissing) console.log("  " + m);
