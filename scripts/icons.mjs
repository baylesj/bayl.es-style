// Generates the favicons in icons/ from src/tokens.css. Run by `npm run build`.
//
// Each site's icon is the Big Dipper on a night tile, edged in the site's hue (its dark-theme text
// color, so it reads on the night tile) with the site's own star lit in its --star color. Home
// Assistant keeps HA's blue and carries the server's mark instead: 업, the first syllable of 업신
// (Eopsin), in Sunflower Bold, as outlines (a favicon can't load fonts), in the 2399 box that
// scripts/icon-png.py renders to PNG.
import { readFileSync, writeFileSync } from "node:fs";

const css = readFileSync(new URL("../src/tokens.css", import.meta.url), "utf8");

const dark = {};
for (const [, name, , d] of css.matchAll(
  /--([\w-]+):\s*light-dark\((#[0-9a-f]{3,6}),\s*(#[0-9a-f]{3,6})\)/gi,
)) {
  dark[name] = d.toLowerCase();
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

// The site blocks: [data-site="x"], [data-site="y"] { … --sig-text: var(--z); … --star: color-mix(…) }
const sites = {};
for (const [, selectors, body] of css.matchAll(/((?:\[data-site="\w+"\],?\s*)+)\{([^}]*)\}/g)) {
  const text = body.match(/--sig-text:\s*var\(--([\w-]+)\)/);
  const star = body.match(/--star:\s*color-mix\(in srgb, (#[0-9a-f]{6}) (\d+)%, (#[0-9a-f]{6})\)/i);
  if (!text || !star) continue;
  for (const [, site] of selectors.matchAll(/data-site="(\w+)"/g)) {
    sites[site] = { edge: dark[text[1]], star: mix(star[1], star[3], Number(star[2]) / 100) };
  }
}

// Big Dipper, bowl then handle, in a 48 box; the order matches js/galaxy.js.
const DIPPER = {
  home: [38, 21],
  my: [39, 32],
  id: [28, 35],
  audible: [26, 25],
  orbit: [18, 22],
  zero: [11, 18],
  climb: [17, 11], // Alcor: faint on every tile (it's in the sky either way), lit on climb's
  jordan: [6, 11],
};
// Field stars (DESIGN.md): a site outside the Dipper lights its own star in the tile's open top-right corner,
// with the Dipper unlit. No halo: the cluster is the mark, and a ring would swallow it. binder is the Pleiades: Alcyone and its sisters, as in js/galaxy.js.
const FIELD = {
  binder: {
    at: [35, 11],
    cluster: [
      [-8.5, 1.3],
      [-8.5, -2],
      [2, 4.4],
      [6.8, 1.7],
      [8.5, -2.4],
      [5.1, -4.4],
      [6.8, -7.8],
    ],
  },
};
const NIGHT = "#0a1f22";
const DIM = "#b7cfce";

const fieldStar = ({ at: [x, y], cluster }, star) =>
  `<circle cx="${x}" cy="${y}" r="3.4" fill="${star}"/>` +
  cluster
    .map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="1.5" fill="${star}"/>`)
    .join("");

const starTile = (site, { edge, star }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">` +
  `<rect width="48" height="48" rx="7" fill="${NIGHT}"/>` +
  `<rect x="1" y="1" width="46" height="46" rx="6" fill="none" stroke="${edge}" stroke-width="2"/>` +
  Object.entries(DIPPER)
    .map(([k, [x, y]]) =>
      k === site && !FIELD[site]
        ? `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${star}" stroke-width="1.2" opacity="0.6"/>` +
          `<circle cx="${x}" cy="${y}" r="5" fill="${star}"/>`
        : `<circle cx="${x}" cy="${y}" r="${k === "climb" ? 1.6 : 3}" fill="${DIM}"/>`,
    )
    .join("") +
  (FIELD[site] ? fieldStar(FIELD[site], star) : "") +
  `</svg>\n`;

for (const [site, colors] of Object.entries(sites)) {
  writeFileSync(new URL(`../icons/${site}.svg`, import.meta.url), starTile(site, colors));
  console.log(`icons/${site}.svg`);
}

// 업 in Sunflower Bold (1000 units per em; bounds x 108..740, y -184..796), scaled into the 2399 box.
const EOP =
  "M740 -95V204V781H622V620H501Q486 668 451.0 702.5Q416 737 368 751V796H250V751Q219 741 193.0 722.5Q167 704 148.0 678.5Q129 653 118.5 622.5Q108 592 108 559Q108 518 124.0 481.5Q140 445 168.0 418.0Q196 391 232.0 375.0Q268 359 309 359Q344 359 375.5 370.0Q407 381 432.5 401.0Q458 421 476.0 447.5Q494 474 503 506H622V144V116H431V204H313V-95Q313 -132 338.5 -158.0Q364 -184 401 -184H652Q670 -184 686.0 -177.0Q702 -170 714.0 -158.0Q726 -146 733.0 -129.5Q740 -113 740 -95ZM392 559Q392 521 368.0 496.0Q344 471 309 471Q275 471 250.5 496.0Q226 521 226 559Q226 597 250.5 622.0Q275 647 309 647Q344 647 368.0 622.0Q392 597 392 559ZM622 -70H431V2H622Z";
const S = 1560 / 980; // glyph height 980 units -> 1560 of 2399
const scaled = EOP.replace(/([MLQHVZ])([^MLQHVZ]*)/g, (_, cmd, args) => {
  const n = args.trim()
    ? args
        .trim()
        .split(/[\s,]+/)
        .map(Number)
    : [];
  return cmd + n.map((v) => (v * S).toFixed(1)).join(" ");
});
const tx = (1199.5 - ((108 + 740) / 2) * S).toFixed(1);
const ty = (1199.5 + ((796 - 184) / 2) * S).toFixed(1);
const ha =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2399 2399">` +
  `<rect width="2399" height="2399" rx="528" fill="#18BCF2"/>` +
  `<g transform="translate(${tx} ${ty}) scale(1 -1)"><path fill="#14282B" d="${scaled}"/></g></svg>\n`;
writeFileSync(new URL("../icons/ha.svg", import.meta.url), ha);
writeFileSync(new URL("../home-assistant/icons/eopsin.svg", import.meta.url), ha);
console.log("icons/ha.svg, home-assistant/icons/eopsin.svg");
