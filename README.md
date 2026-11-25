# bayl.es-style

The shared look of the `*.bayl.es` sites: color tokens, base styles and components, in one stylesheet.
The **[style guide](https://style.bayl.es)** shows the rules and every component live, and
[DESIGN.md](DESIGN.md) explains the rules and the reasoning behind them. This file covers how to use
the stylesheet.

## Use it

Load the fonts and the stylesheet, then set the site on `<body>`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400..700&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap"
/>
<!-- only the two characters of the goddess's name, for the footer credit -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Sunflower:wght@700&text=%EC%97%85%EC%8B%A0&display=swap"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v2.0.0/dist/eopsin.min.css"
/>

<body data-site="home">
  <!-- jordan | home | my | id | audible | orbit | zero | climb -->
</body>
```

jordan.bayl.es also loads Geologica for the name (`family=Geologica:wght,SHRP@200,100`).

**Always pin a tag** (`@v1.0.0`), never a branch. A pinned site only changes when you bump its tag.

You can also install it as a dependency, pinned to a tag, and bundle it in a build:

```sh
npm install github:baylesj/bayl.es-style#v2.0.0
```

```js
import "bayl.es-style"; // dist/eopsin.min.css
```

All rules are in the cascade layers `tokens`, `base`, `components` and `utilities`. A site's own unlayered CSS
therefore always wins without specificity fights, so site-specific styles need no `!important`.

## Pieces

```html
<!-- The galaxy header (2.2.0, the bar): the map (js/galaxy.js, below) carries the context. Its lit waypoint names
     the site, .who in its corner holds the signed-in user and the theme switch, and the panel holds only the
     site's own controls (or is left out). The <h1> is for screen readers. -->
<header class="scope bar">
  <canvas></canvas>
  <div class="wrap">
    <h1 class="vh">orbit</h1>
    <div class="head">
      <div class="controls">
        <div class="seg fill" role="tablist">
          <button aria-pressed="true">people</button><button>map</button>
        </div>
      </div>
    </div>
  </div>
  <div class="who">
    <span class="u">jordan</span>@<abbr
      class="eopsin"
      title="The server is named for 업신 (Eopsin), the Korean household goddess of storage and wealth"
      >eopsin</abbr
    ><button class="theme-toggle" type="button"></button>
  </div>
</header>
<!-- With nothing to put in a panel, leave .head out: <div class="wrap"><h1 class="vh">zero</h1></div><div class="who">…</div> -->

<!-- Before 2.2.0: the prompt line and the wordmark in the panel (still styled, for pages not yet moved) -->
<header class="scope">
  <canvas></canvas>
  <div class="wrap">
    <div class="head">
      <span class="prompt"><span class="u">jordan</span>@eopsin:<span class="p">~</span></span>
      <h1 class="mark">home</h1>
    </div>
  </div>
</header>

<!-- Without the galaxy: the plain header over a hairline -->
<header class="top">
  <div>
    <span class="prompt"><span class="u">guest</span>@eopsin:<span class="p">~/wiki</span></span>
    <h1 class="mark">kiwix</h1>
  </div>
</header>

<!-- Section label, optionally numbered -->
<h2 class="label"><span class="n">01</span>shortcuts</h2>

<!-- Rows on hairlines -->
<div class="rows">
  <a class="row" href="…">
    <img alt="" src="icon.svg" />
    <span class="txt"
      ><span class="name">Jellyfin</span><span class="desc">Movies and TV</span></span
    >
    <span class="meta public">jellyfin.bayl.es</span>
  </a>
</div>

<!-- Shared footer: this site's links first, then the credit to the goddess the server is named
     for, the style guide last -->
<footer>
  <span><a href="/">start</a> · <a href="https://home.bayl.es">your apps</a></span>
  <span
    title="The server is named for 업신 (Eopsin), the Korean household goddess of storage and wealth"
    >served by eopsin, after <span class="eop" lang="ko">업신</span></span
  >
  <a href="https://style.bayl.es">style.bayl.es</a>
</footer>

<!-- Label column beside content -->
<section class="split">
  <h2 class="label"><span class="n">01</span>code</h2>
  <div>…</div>
</section>
```

Also available:

- `.kv` key/value rows
- `.dot.ok|warn|err` status dots
- `.keyrow` of `.step`s with `.sq.full|line|mid` and `.h-green|amber`: a key for what a site's steps measure
- `.panel` and `.panel.alert` tinted panels
- `.steps` numbered lists
- form fields, `.btn` and `.btn.quiet` buttons, `.actions` button rows
- `.seg` mono toggle groups (the current button is bracketed: `.on` or `aria-pressed="true"`), and `.bk` to
  bracket any other control
- `.name-mark`, jordan.bayl.es's name; `.eop`, the goddess's name in Sunflower; `.notes` footnotes
- `.theme-toggle`, the light/dark switch (with `js/theme.js`, below)
- role colors: `.public`, `.private`, `.num`, `.warn`, `.err`
- type helpers: `.title`, `.lede`, `.soft`, `.muted`, `.mono`, `.stack`

Each site has a favicon in `icons/` (`jordan.svg`, `home.svg`, `my.svg`, `id.svg`, `audible.svg`,
`orbit.svg`, `zero.svg`, `climb.svg`): the Big Dipper on a night tile, edged in the site's hue, with the site's own star
lit. `ha.svg` is Home Assistant's: 업 in Sunflower on HA's blue. `scripts/icons.mjs` generates them from the
tokens (part of `npm run build`), and `scripts/icon-png.py` renders `ha.svg` to PNG. Link one at the same
pinned tag:

```html
<link
  rel="icon"
  type="image/svg+xml"
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v2.0.0/icons/home.svg"
/>
```

### The galaxy

`js/galaxy.js` draws the map behind a `.scope` header: one galaxy from a fixed seed, the same on every site,
with the sites as the Big Dipper's stars (and Alcor) and this site's star lit (DESIGN.md has the story). It redraws on
resize, on a theme change and when `data-site` changes, and keeps everything clear of the panel, the caption and `.who`.
Load it once, `defer` is fine:

```html
<script src="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v2.0.0/js/galaxy.js" defer></script>
```

Like `js/theme.js`, it can be inlined (`import galaxy from "bayl.es-style/js/galaxy.js?raw"`). Without
JavaScript the header shows the plain field color behind the panel.

### Theme switch

Every site can offer an auto/light/dark switch. Load the script in `<head>` (so a chosen theme is applied
before the page draws) and put an empty button where it belongs, usually the header:

```html
<script src="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v2.0.0/js/theme.js"></script>
...
<button class="theme-toggle" type="button"></button>
```

Sites that install the package can inline it instead (`import theme from "bayl.es-style/js/theme.js?raw"` in
Astro or Vite), so nothing loads from the CDN.

The script fills in the icon (half circle, sun, moon) and cycles auto → light → dark. On `*.bayl.es` the choice
is a cookie on `bayl.es`, so picking dark on one site makes them all dark; elsewhere it's this site's
`localStorage`. Without JavaScript the button stays hidden and the system theme applies.

Every token is a custom property on `:root`, so you can use them in site CSS:

- colors: `--ink`, `--comment`, `--teal`, …
- signature: `--sig`, `--sig2`, `--sig-text`, `--star`, `--bracket`
- fonts: `--sans`, `--mono`, `--name` (jordan.bayl.es), `--eop` (the goddess's name)

## Home Assistant

`home-assistant/` has a matching HA theme (**bayl.es**, light and dark) generated from the same tokens,
plus a font loader. See [home-assistant/README.md](home-assistant/README.md).

## Develop

```sh
npm install
npm run format   # Prettier + Stylelint --fix
npm run check    # lint, build, and fail if dist/ is out of date
```

There are two built files:

- **`dist/eopsin.css`**, the readable one. Colors stay as `light-dark(light, dark)`, and the file opens
  with a table of every color token and its role. Read this one; it needs a 2024+ browser.
- **`dist/eopsin.min.css`**, the one sites load. It's minified, with fallbacks so older browsers still
  get the colors.

Edit files in `src/`. `dist/` is built by Lightning CSS (bundled, with fallbacks for the browsers in
`browserslist`) and committed, because jsDelivr serves files straight from git tags.

## Release

[Semantic versioning](https://semver.org):

- **patch:** visual fixes
- **minor:** new tokens or components
- **major:** a renamed or removed class or token

1. Update `CHANGELOG.md`, `version` in `package.json` and `VERSION` in `docs/index.html` (`check` verifies
   they match).
2. `npm run build`, then commit (`dist/` included).
3. `npm run check`, which fails if `dist/` doesn't match the commit.
4. Tag and push: `git tag v2.0.0 && git push && git push origin v2.0.0`.
5. Bump the tag in each site:
   - jordan.bayl.es: `package.json`
   - unraid-config: `stacks/shared/style-version`, then `bash scripts/ha/theme-sync.sh` on the server to update the
     Home Assistant theme
