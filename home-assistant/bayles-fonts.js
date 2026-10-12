// Loads the bayl.es fonts (Schibsted Grotesk, Fira Code) in Home Assistant, self-hosted from
// /config/www/bayles/fonts, and gives markdown cards the bayl.es table style (src/base.css).
// Register as a dashboard resource (module): /local/bayles/bayles-fonts.js
const FACES = `
@font-face { font-family: "Schibsted Grotesk"; font-style: normal; font-weight: 400 700; font-display: swap;
  src: url("/local/bayles/fonts/schibsted-grotesk-latin-wght-normal.woff2") format("woff2"); }
@font-face { font-family: "Fira Code"; font-style: normal; font-weight: 400; font-display: swap;
  src: url("/local/bayles/fonts/fira-code-latin-400-normal.woff2") format("woff2"); }
@font-face { font-family: "Fira Code"; font-style: normal; font-weight: 500; font-display: swap;
  src: url("/local/bayles/fonts/fira-code-latin-500-normal.woff2") format("woff2"); }
`;
if (!document.getElementById("bayles-fonts")) {
  const style = document.createElement("style");
  style.id = "bayles-fonts";
  style.textContent = FACES;
  document.head.append(style);
}

// The table rules from src/base.css, in HA's theme variables. HA themes can only set a few
// --markdown-table-* variables (no radius, header fill or column sizing), so this adds a stylesheet to
// each <ha-markdown> shadow root, after HA's own styles so it wins at equal specificity.
const TABLES = `
table { width: 100%; border: 1px solid var(--divider-color); border-radius: 10px;
  border-collapse: separate; border-spacing: 0; overflow: hidden; font-variant-numeric: tabular-nums; }
th, td { padding: 8px 12px; border: 0; border-bottom: 1px solid var(--divider-color);
  text-align: start; vertical-align: baseline; }
th { background: color-mix(in srgb, var(--primary-color) 9%, var(--card-background-color));
  color: var(--secondary-text-color); font-size: 13px; font-weight: 600; }
tr:last-child > td { border-bottom: 0; }
:is(th, td):first-child { width: 100%; }
:is(th, td):not(:first-child) { white-space: nowrap; }
:is(th, td):is([align="right"], .num) { text-align: end; }
`;
const tables = new CSSStyleSheet();
tables.replaceSync(TABLES);
const adopt = (root) => {
  if (root && !root.adoptedStyleSheets.includes(tables)) {
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, tables];
  }
};

customElements.whenDefined("ha-markdown").then(() => {
  // Cards created from now on: add the sheet when Lit attaches the shadow root.
  const proto = customElements.get("ha-markdown").prototype;
  const createRenderRoot = proto.createRenderRoot;
  proto.createRenderRoot = function () {
    const root = createRenderRoot.call(this);
    adopt(root);
    return root;
  };
  // Cards already on the page (this module can load after the first render).
  const walk = (node) => {
    for (const el of node.querySelectorAll("*")) {
      if (el.localName === "ha-markdown") adopt(el.shadowRoot);
      if (el.shadowRoot) walk(el.shadowRoot);
    }
  };
  walk(document);
});
