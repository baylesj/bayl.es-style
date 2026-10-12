// Loads the bayl.es fonts (Schibsted Grotesk, Fira Code) in Home Assistant, self-hosted from
// /config/www/bayles/fonts. Register as a dashboard resource (module): /local/bayles/bayles-fonts.js
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
