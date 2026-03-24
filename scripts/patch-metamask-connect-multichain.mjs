import fs from "node:fs";
import path from "node:path";

const filesToPatch = [
  "node_modules/@metamask/connect-evm/node_modules/@metamask/connect-multichain/dist/browser/es/connect-multichain.mjs",
  "node_modules/@metamask/connect-evm/node_modules/@metamask/connect-multichain/dist/src/domain/logger/index.js",
];

const from = "const { DEBUG } = process.env;";
const to = "const DEBUG = process.env.DEBUG;";

for (const relativePath of filesToPatch) {
  const filePath = path.resolve(relativePath);
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const source = fs.readFileSync(filePath, "utf8");
  if (!source.includes(from) || source.includes(to)) {
    continue;
  }

  fs.writeFileSync(filePath, source.replaceAll(from, to));
  console.log(`Patched ${relativePath}`);
}
