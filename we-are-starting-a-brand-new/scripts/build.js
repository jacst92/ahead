const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

const files = [
  "index.html",
  "styles.css",
  "local-data.js",
  "budget-engine.js",
  "app.js",
  "decision-engine.js",
  "timeline-engine.js",
  "TFLC_BRAND_GUIDE.md",
  "AHEAD_DECISION_ENGINE.md",
];

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);

  if (!fs.existsSync(source)) {
    throw new Error(`Build input is missing: ${relativePath}`);
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function validateHtml() {
  const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  const requiredAssets = ["styles.css", "local-data.js", "budget-engine.js", "decision-engine.js", "timeline-engine.js", "app.js"];

  for (const asset of requiredAssets) {
    if (!html.includes(asset)) {
      throw new Error(`index.html does not reference ${asset}`);
    }
    if (!fs.existsSync(path.join(dist, asset))) {
      throw new Error(`Referenced asset was not copied: ${asset}`);
    }
  }

  if (html.includes("__ahead_reload")) {
    throw new Error("Production build must not include the local hot reload client.");
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of files) {
  copyFile(file);
}

validateHtml();

console.log("Ahead production build completed: dist/");
