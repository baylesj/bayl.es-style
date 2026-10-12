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
  href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&family=Fira+Code:wght@400;500&display=swap"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v1.5.0/dist/eopsin.min.css"
/>

<body data-site="home">
  <!-- jordan | home | my | id | audible -->
</body>
```

**Always pin a tag** (`@v1.0.0`), never a branch. A pinned site only changes when you bump its tag.

You can also install it as a dependency, pinned to a tag, and bundle it in a build:

```sh
npm install github:baylesj/bayl.es-style#v1.5.0
```

```js
import "bayl.es-style"; // dist/eopsin.min.css
```

All rules are in the cascade layers `tokens`, `base`, `components` and `utilities`. A site's own unlayered CSS
therefore always wins without specificity fights, so site-specific styles need no `!important`.

## Pieces

```html
<!-- Header: prompt line, wordmark (the signature dot is added in CSS) -->
<header class="top">
  <div>
    <span class="prompt"><span class="u">jordan</span>@eopsin:<span class="p">~</span></span>
    <h1 class="mark">eopsin</h1>
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

<!-- Shared footer: this site's links first, the style guide last -->
<footer>
  <span><a href="/">start</a> · <a href="https://home.bayl.es">your apps</a></span>
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
- `.panel` and `.panel.alert` tinted panels
- `.steps` numbered lists
- form fields, `.btn` and `.btn.quiet` buttons, `.actions` button rows
- `.seg` mono toggle groups
- role colors: `.public`, `.private`, `.num`, `.warn`, `.err`
- type helpers: `.title`, `.lede`, `.soft`, `.muted`, `.mono`, `.stack`

Each server site has a favicon in `icons/` (`home.svg`, `my.svg`, `id.svg`, `audible.svg`): an "e." monogram on
a tile in the site's signature color. Link it at the same pinned tag:

```html
<link
  rel="icon"
  type="image/svg+xml"
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v1.5.0/icons/home.svg"
/>
```

Every token is a custom property on `:root`, so you can use them in site CSS:

- colors: `--ink`, `--comment`, `--teal`, …
- signature: `--sig`, `--sig2`, `--sig-text`
- fonts: `--sans`, `--mono`, `--serif`

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
4. Tag and push: `git tag v1.5.0 && git push && git push origin v1.5.0`.
5. Bump the tag in each site:
   - jordan.bayl.es: `package.json`
   - unraid-config: `stacks/shared/style-version`
