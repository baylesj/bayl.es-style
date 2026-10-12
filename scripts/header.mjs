// Prepends a readable index of the color tokens to dist/eopsin.css, so anyone opening the file sees
// the palette first. Run by `npm run build`.
import { readFileSync, writeFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const tokens = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
const rows = [
  ...tokens.matchAll(
    /--([\w-]+):\s*light-dark\((#[0-9a-f]+),\s*(#[0-9a-f]+)\);[ \t]*(?:\/\*[ \t]*(.*?)[ \t]*\*\/)?/gi,
  ),
].map(([, name, light, dark, note]) =>
  ` *   --${name.padEnd(14)} ${light.padEnd(8)} ${dark.padEnd(8)} ${note ?? ""}`.trimEnd(),
);
const header = `/*
 * bayl.es-style ${version}: the shared look of the *.bayl.es sites.
 * https://style.bayl.es · https://github.com/baylesj/bayl.es-style
 *
 * This is the readable build: colors are written as light-dark(light, dark), which needs a 2024+
 * browser. Sites should load eopsin.min.css, which adds fallbacks for older browsers.
 *
 * Color tokens (light, dark):
${rows.join("\n")}
 *
 * Signature per site: <body data-site="jordan|home|my|id|audible"> sets --sig, --sig2, --sig-text,
 * --sig-fill and --sig2-fill. Layers: tokens, base, components, utilities.
 */

`;
const path = new URL("../dist/eopsin.css", import.meta.url);
writeFileSync(path, header + readFileSync(path, "utf8"));
console.log("dist/eopsin.css header");
