#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const flavor = process.env.FLAVOR || "bebbo";
const projectRoot = process.cwd();

const imagesRoot = path.join(
  projectRoot,
  "app",
  "instances",
  flavor,
  "assets",
  "offlineImages"
);

const outputFile = path.join(
  projectRoot,
  "app",
  "instances",
  flavor,
  "assets",
  "offlineImageMap.ts"
);

const allowedExts = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function walk(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (allowedExts.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

if (!fs.existsSync(imagesRoot)) {
  console.error(`Images folder not found: ${imagesRoot}`);
  process.exit(1);
}

const files = walk(imagesRoot);

const lines = [];
lines.push('import { ImageSourcePropType } from "react-native";');
lines.push("");
lines.push("export const offlineImageMap: Record<string, ImageSourcePropType> = {");

for (const file of files) {
  const relativeFromImages = toPosix(path.relative(imagesRoot, file));
  const requirePath = "./offlineImages/" + relativeFromImages;
  lines.push(`  ${JSON.stringify(relativeFromImages)}: require(${JSON.stringify(requirePath)}),`);
}

lines.push("};");
lines.push("");

fs.writeFileSync(outputFile, lines.join("\n"), "utf8");

console.log(`Generated ${outputFile} with ${files.length} images for flavor "${flavor}"`);