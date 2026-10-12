// Generates home-assistant/bayles.yaml, a Home Assistant theme with light and dark modes, from the
// color tokens in src/tokens.css, so HA stays in step with the sites. Run by `npm run build`.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");
const tokens = {};
for (const [, name, light, dark] of css.matchAll(
  /--([\w-]+):\s*light-dark\((#[0-9a-f]{3,6}),\s*(#[0-9a-f]{3,6})\)/gi,
)) {
  tokens[name] = { light: expand(light), dark: expand(dark) };
}

function expand(hex) {
  const h = hex.slice(1).toLowerCase();
  return "#" + (h.length === 3 ? [...h].map((c) => c + c).join("") : h);
}
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const mix = (a, b, t) =>
  "#" +
  rgb(a)
    .map((v, i) =>
      Math.round(v * t + rgb(b)[i] * (1 - t))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const rgbList = (hex) => rgb(hex).join(", ");

const SANS = '"Schibsted Grotesk", -apple-system, system-ui, sans-serif';
const MONO = '"Fira Code", ui-monospace, monospace';

function mode(m) {
  const t = (name) => {
    if (!tokens[name]) throw new Error(`missing token --${name}`);
    return tokens[name][m];
  };
  // HA is a card UI, so cards sit on a slightly deeper page tone instead of being boxed with borders.
  const page = m === "light" ? mix(t("ink"), t("ground"), 0.04) : t("ground");
  const card = m === "light" ? "#ffffff" : t("field");
  return {
    // Type
    "primary-font-family": SANS,
    "paper-font-common-base_-_font-family": SANS,
    "paper-font-common-code_-_font-family": MONO,
    "code-font-family": MONO,
    "ha-font-family-body": SANS,
    "ha-font-family-heading": SANS,
    "ha-font-family-code": MONO,
    // Surfaces
    "primary-background-color": page,
    "secondary-background-color": card,
    "lovelace-background": page,
    "card-background-color": card,
    "ha-card-background": card,
    "ha-card-border-radius": "10px",
    "ha-card-border-width": "0px",
    "ha-card-box-shadow": "none",
    "dialog-background-color": card,
    "input-fill-color": m === "light" ? mix(t("ink"), card, 0.04) : mix(t("ink"), card, 0.06),
    // Newer HA inputs (ha-input, 2026.x) read these instead of input-fill-color, and fall back to grey.
    "ha-color-form-background":
      m === "light" ? mix(t("ink"), card, 0.04) : mix(t("ink"), card, 0.06),
    "ha-color-form-background-hover":
      m === "light" ? mix(t("ink"), card, 0.07) : mix(t("ink"), card, 0.1),
    "ha-color-form-background-disabled": card,
    "ha-color-border-neutral-quiet": t("line"),
    "ha-color-border-neutral-normal": mix(t("comment"), card, 0.5),
    "ha-color-border-neutral-loud": t("comment"),
    "divider-color": t("line"),
    // Text
    "primary-text-color": t("ink"),
    "secondary-text-color": t("comment"),
    "disabled-text-color": t("comment"), // grey, never faded (see DESIGN.md, Contrast)
    "text-primary-color": t("on-sig"),
    "rgb-primary-text-color": rgbList(t("ink")),
    "rgb-secondary-text-color": rgbList(t("comment")),
    "rgb-text-primary-color": rgbList(t("on-sig")),
    // Signature: HA belongs with home.bayl.es (teal -> green)
    "primary-color": t("teal"),
    "accent-color": t("teal"),
    "rgb-primary-color": rgbList(t("teal")),
    "rgb-accent-color": rgbList(t("teal")),
    "link-text-color": t("teal"),
    // Roles
    "success-color": t("green"),
    "warning-color": t("amber-text"),
    "error-color": t("orange"),
    "info-color": t("teal"),
    "state-icon-color": t("comment"),
    "switch-checked-color": t("green"),
    "switch-checked-button-color": m === "light" ? "#ffffff" : t("ink"),
    "switch-checked-track-color": t("green-bright"),
    // Chrome
    "app-header-background-color": page,
    "app-header-text-color": t("ink"),
    "app-header-selection-bar-color": t("teal"),
    "sidebar-background-color": page,
    "sidebar-text-color": t("ink"),
    "sidebar-icon-color": t("comment"),
    "sidebar-selected-icon-color": t("teal"),
    "sidebar-selected-text-color": t("teal"),
    "sidebar-selected-background-color": mix(t("teal-bright"), page, 0.12),
  };
}

// Contrast guard: text colors must meet WCAG AA (4.5:1) on the page and on cards, in both modes.
const lum = (hex) =>
  rgb(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
for (const m of ["light", "dark"]) {
  const v = mode(m);
  for (const bg of ["primary-background-color", "card-background-color"]) {
    for (const fg of [
      "primary-text-color",
      "secondary-text-color",
      "primary-color",
      "success-color",
      "warning-color",
      "error-color",
    ]) {
      const r = ratio(v[fg], v[bg]);
      if (r < 4.5) throw new Error(`${m}: ${fg} on ${bg} is ${r.toFixed(2)}:1, under 4.5:1`);
    }
  }
  const onPrimary = ratio(v["text-primary-color"], v["primary-color"]);
  if (onPrimary < 4.5) throw new Error(`${m}: text on primary is ${onPrimary.toFixed(2)}:1`);
}

const q = (v) => `'${String(v).replaceAll("'", "''")}'`;
const block = (vars) =>
  Object.entries(vars)
    .map(([k, v]) => `      ${k}: ${q(v)}`)
    .join("\n");
const yaml = `# Generated by scripts/ha-theme.mjs from src/tokens.css (bayl.es-style). Don't edit by hand.
# Install: home-assistant/README.md.
bayl.es:
  modes:
    light:
${block(mode("light"))}
    dark:
${block(mode("dark"))}
`;
writeFileSync(new URL("../home-assistant/bayles.yaml", import.meta.url), yaml);
console.log("home-assistant/bayles.yaml");
