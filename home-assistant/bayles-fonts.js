// Loads the bayl.es fonts (Atkinson Hyperlegible Next and Mono) in Home Assistant, self-hosted from
// /config/www/bayles/fonts, gives markdown cards the bayl.es table style (src/base.css), and swaps HA's
// favicon and home-screen icon for the eopsin tile in Home Assistant blue (업 in Sunflower) (/config/www/bayles/icons).
// Register as a dashboard resource (module): /local/bayles/bayles-fonts.js
const FACES = `
@font-face { font-family: "Atkinson Hyperlegible Next"; font-style: normal; font-weight: 200 800; font-display: swap;
  src: url("/local/bayles/fonts/atkinson-hyperlegible-next-latin-wght-normal.woff2") format("woff2"); }
@font-face { font-family: "Atkinson Hyperlegible Mono"; font-style: normal; font-weight: 200 800; font-display: swap;
  src: url("/local/bayles/fonts/atkinson-hyperlegible-mono-latin-wght-normal.woff2") format("woff2"); }
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
table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
th, td { padding: 7px 12px 7px 0; border: 0; border-bottom: 1px solid var(--divider-color);
  text-align: start; vertical-align: baseline; }
th { color: var(--secondary-text-color); font: 400 12px var(--code-font-family, monospace); }
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

// The eopsin icon in place of HA's: the tab favicon and the iOS home-screen icon
// (Safari reads apple-touch-icon when you add the page to the home screen, so it sees the swapped link).
const ICONS = {
  'link[rel="icon"]': "/local/bayles/icons/eopsin.svg",
  'link[rel="apple-touch-icon"]': "/local/bayles/icons/eopsin-apple-180.png",
};
for (const [selector, href] of Object.entries(ICONS)) {
  const links = document.head.querySelectorAll(selector);
  for (const link of links) {
    link.href = href;
    link.removeAttribute("sizes");
    if (selector.includes('"icon"'))
      link.type = href.endsWith(".svg") ? "image/svg+xml" : "image/png";
  }
  if (!links.length) {
    const link = document.createElement("link");
    link.rel = selector.match(/rel="([^"]+)"/)[1];
    link.href = href;
    document.head.append(link);
  }
}
