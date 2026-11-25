# Changelog

## 2.2.2 (2026-11-24)

- The bar header is `.scope.thin` (was `.scope.bar`): zero.bayl.es already had a `.bar` progress bar (8px tall), which
  took the header with it. `.bar` stays free for pages.

## 2.2.1 (2026-11-24)

- `.who` is the header's own child (`.scope > .who`), not part of the panel: on wide screens a card at the map's right,
  level with the panel; on phones still the chip in the map's corner.

## 2.2.0 (2026-11-24)

The bar header: the galaxy carries the context, so nothing is said twice (climb.bayl.es first, then every site).

- `.scope.thin` (named `.scope.bar` in 2.2.0 and 2.2.1): the panel holds only the site's controls (or is left out); no prompt line or wordmark in it. The
  site is named by its lit waypoint; the page's `<h1>` stays for screen readers with the new `.vh` utility.
- `.who`: a chip in the map's corner with the signed-in user and the theme switch. `js/galaxy.js` keeps its stars and
  labels clear of it.
- `.seg.fill`: on phones a segmented control spreads across the panel, each button as wide as its word, so a tab bar
  never scrolls (12px, 11px under 360px).
- Sites stop using `.caption` ("galaxy · waypoint …"), which repeated the waypoint's label. It still works.
- DESIGN.md: "the galaxy says where you are, once" replaces the prompt-line principle, and pages open with what they
  are for.

## 2.1.1 (2026-11-24)

- Hover corners on `.bk` and `.seg` buttons only where a pointer hovers (`@media (hover: hover)`). On phones a tapped
  button keeps `:hover`, so the last-tapped choice kept grey corners beside the selected one and two looked chosen.

## 2.1.0 (2026-11-20)

New site, climb.bayl.es (Jordan's training, recovery and weight):

- `[data-site="climb"]`: green → amber, its star a chartreuse mixed into starlight.
- It is Alcor, Mizar's faint companion, as DESIGN.md planned for an eighth site: a waypoint beside Mizar in
  `js/galaxy.js` (off the figure line) and `icons/climb.svg`. Alcor is in the sky either way, so every
  favicon now shows it faint beside Mizar; only climb's lights it.
- climb's key measures recovery against your own baseline: diverging, green better than usual, amber worse.

## 2.0.0 (2026-11-17)

A new look: an instrument, not a storefront. See DESIGN.md and the style guide.

Breaking:

- **Fonts:** Atkinson Hyperlegible Next for words and Atkinson Hyperlegible Mono for machine facts replace
  Schibsted Grotesk and Fira Code. Sites load them from Google Fonts (README). `--serif` (EB Garamond) is
  gone; jordan.bayl.es's name is `--name`, Geologica 200 with sharpness 100, in `.name-mark`.
- **No period after the wordmark:** `.mark::after` is removed, and `.mark` is 22px/600 instead of 56px/700.
- **Muted palette:** every role color keeps its hue with chroma cut to 60% in OKLCH, re-checked for AA on
  the page, on panel tints and under button text. New `--pink-text` (jordan and orbit's text and button:
  white on plain pink was 3.96:1) and a darker `--amber-text` (it was 4.38:1 on panel tints).
- **Components restyled:** rows with 28px tiles, 3px corners on fields and buttons (40px tall), 4px panels,
  hairline tables with a mono header and no frame, `.top` closed by a hairline, and `.seg` as plain mono
  words with the current one bracketed (`.on` or `aria-pressed="true"`). Status dots are text strength.
- **Favicons:** every site's icon is the Big Dipper on a night tile with its own star lit; Home Assistant's
  is 업 in Sunflower on HA's blue (and the HA PNGs). New `icons/jordan.svg`.

New:

- **The galaxy header** (`.scope`, `.head`, `.caption`) and `js/galaxy.js`: one galaxy for every site, the
  sites as the Big Dipper's stars, this site's lit. By day the map is slate (`--slate`) with the galaxy
  etched on it. Pages with it hide the 4px signature strip.
- **Selection brackets:** `.bk` (and every `.seg` button) draws four thin corners for hover, current and
  focus, in `--bracket`.
- **Keys:** `.keyrow`, `.step`, `.sq.full|line|mid`, `.h-green|amber`.
- **Tokens:** `--star` per site, `--bracket`, `--panel`, `--alert`, `--slate` and the galaxy's `--g-*` and
  `--e-*`; `--eop` and `.eop` for 업신 in Sunflower; `abbr.eopsin`; `.notes` footnotes.
- `scripts/icons.mjs` generates the icons from the tokens as part of `npm run build`.
- Home Assistant, Immich and OpenSpeedTest themes use the Atkinson fonts; HA's font loader and markdown
  tables follow the new tables. HA needs the two new font files (home-assistant/README.md).

## 1.12.2 (2026-10-16)

- `js/theme.js` works when inlined: its header comment had a usage example with a closing script tag, which
  ended an inline script early. Loading it by `src` was unaffected.

## 1.12.1 (2026-10-16)

- `js/theme.js` is exported from the package (`bayl.es-style/js/theme.js`), so sites that bundle the style
  (jordan.bayl.es) can inline it instead of loading it from the CDN.

## 1.12.0 (2026-10-16)

- Theme switch for every site: `js/theme.js` and `.theme-toggle`. An empty `<button class="theme-toggle">`
  becomes an auto/light/dark switch (half circle, sun, moon); the choice is shared across `*.bayl.es` in a
  cookie and applied before the page draws. First used on orbit.bayl.es.

## 1.11.0 (2026-10-15)

- New site, zero.bayl.es: `[data-site="zero"]` is green → teal (it was defined in zero's own page until now),
  and `icons/zero.svg` is the "e." tile in zero's green (`#00A36C`), for its card on home.bayl.es.

## 1.10.0 (2026-10-15)

- New site, orbit.bayl.es: `[data-site="orbit"]` shares jordan.bayl.es's pink → purple signature, and
  `icons/orbit.svg` is the "e." tile in pink. DESIGN.md explains the shared hue.

## 1.9.1 (2026-10-15)

- OpenSpeedTest theme: the app is capped at 1000px wide and centered instead of filling the whole window.

## 1.9.0 (2026-10-15)

- Home Assistant icon: `icons/ha.svg`, the "e." tile in Home Assistant's blue (`#18BCF2`), with PNGs in
  `home-assistant/icons/` (192 and 512 rounded, 180 square for iOS). `bayles-fonts.js` swaps HA's tab favicon
  and apple-touch-icon for them. `scripts/icon-png.py` renders the tiles to PNG with no dependencies.

## 1.8.1 (2026-10-15)

- OpenSpeedTest theme: the idle gauge is a neutral track; the signature gradient only appears as a test fills it.

## 1.8.0 (2026-10-15)

- OpenSpeedTest theme: `openspeedtest/bayles.css`, generated from the tokens by `scripts/openspeedtest-theme.mjs`.
  The gauge, graphs and start button take the home signature (teal into green), panels and text the page
  colors in light and dark, numbers Schibsted Grotesk, units Fira Code; it hides OpenSpeedTest's in-gauge logo
  and theme toggle, and styles a `.bayles-top` prompt/wordmark header. See `openspeedtest/README.md`.

## 1.7.0 (2026-10-13)

- Immich theme: `immich/bayles.css`, custom CSS for Immich v3 generated from the tokens by
  `scripts/immich-theme.mjs` (teal primary scale, teal-tinted neutrals, page/text/panel bases for both
  modes, Schibsted Grotesk from jsDelivr). See `immich/README.md`.

## 1.6.0 (2026-10-12)

- Tables: plain `<table>` markup gets a rounded hairline frame, a header tinted with the site's signature,
  hairlines between rows and tabular numbers. The first column takes the spare width and the others hug
  their values; `align="right"` (`--:` in Markdown) right-aligns a column. Shown in the style guide.
- Home Assistant: `bayles-fonts.js` also applies the table style to markdown cards (HA themes can't set
  table radius, header fill or column widths, so it adds a stylesheet to each `ha-markdown`).

## 1.5.1 (2026-10-11)

- Home Assistant theme: themes the newer `ha-input` fields (2026.x), which ignored `input-fill-color` and
  fell back to grey, plus the neutral border colors they use.

## 1.5.0 (2026-10-11)

- `dist/eopsin.css` is now the **readable build**: colors stay as `light-dark(light, dark)`, and the
  file opens with an index of every color token and its role. It needs a 2024+ browser.
- `dist/eopsin.min.css` is what sites load: minified, with fallbacks for older browsers. The package's
  default export (`import "bayl.es-style"`) now points at it.

## 1.4.0 (2026-10-11)

- Home Assistant theme **bayl.es** (`home-assistant/bayles.yaml`), light and dark, generated from
  `src/tokens.css` by `scripts/ha-theme.mjs` during `npm run build`. The build fails if any text color
  is under 4.5:1 on the theme's page or cards. A font loader (`bayles-fonts.js`) self-hosts Schibsted
  Grotesk and Fira Code in HA. Install steps: `home-assistant/README.md`.

## 1.3.0 (2026-10-11)

- Shared footer: `footer` is a row above a hairline, with the site's own links first and a link to the
  style guide (https://style.bayl.es) last, on the right.
- The style guide is published at https://style.bayl.es.

## 1.2.1 (2026-10-11)

- `.dot.warn` uses `--amber-text`: plain amber is about 2.4:1 on the page, under the 3:1 minimum for
  marks. Found by the live ratios in the new style guide.
- Style guide page (`docs/index.html`), published to GitHub Pages.

## 1.2.0 (2026-10-11)

Accessibility: every text color now meets WCAG AA (4.5:1) in both themes, on the page and on tinted
panels.

- Light mode text colors are darker: comment `#576e71`, teal `#00748a`, green `#007b52`, orange
  `#b64914`, amber text `#916600`. Dark mode comment is `#74999c`.
- New `--teal-bright`, `--green-bright`, `--orange-bright` and `--sig-fill`/`--sig2-fill` for fills that
  only need 3:1: the signature strip, status dots and panel tints keep their brighter colors.
- Form fields have a `--comment` border, which meets the 3:1 non-text minimum.
- `.row.off` greys the text and icon instead of fading the whole row to 45% (that was about 2.7:1).
- Fix: role colors (`.public`, `.private`, `.num`, `.warn`, `.err`, `.muted`) moved to a final
  `utilities` layer, so they now take effect inside components (before, `.row .meta` overrode them).

## 1.1.0 (2026-10-11)

- Favicons in `icons/`: an "e." monogram on a tile in each site's signature color (`home`, `my`, `id`,
  `audible`). The glyphs are outlines from Schibsted Grotesk, so they don't depend on loaded fonts.

## 1.0.0 (2026-10-11)

First release, extracted from unraid-config `stacks/shared/eopsin.css`. Changes since then:

- Light and dark colors use `light-dark()`, and `<html data-theme>` can force a theme.
- Everything is in the cascade layers `tokens`, `base` and `components`.
- Class selectors are no longer tied to elements (`.mark`, `.label`, `.top`, `.steps`).
- New `.split` component (a label column beside content) and `--serif` token.
- `data-site="id"` added (purple, like my).
