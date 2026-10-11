# bayl.es-style

The shared look of the `*.bayl.es` sites: color tokens, base styles and components, in one stylesheet.
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
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v1.1.0/dist/eopsin.min.css"
/>

<body data-site="home">
  <!-- jordan | home | my | id | audible -->
</body>
```

**Always pin a tag** (`@v1.0.0`), never a branch. A pinned site only changes when you bump its tag.

You can also install it as a dependency, pinned to a tag, and bundle it in a build:

```sh
npm install github:baylesj/bayl.es-style#v1.1.0
```

```js
import "bayl.es-style"; // dist/eopsin.css
```

All rules are in the cascade layers `tokens`, `base` and `components`. A site's own unlayered CSS
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
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v1.1.0/icons/home.svg"
/>
```

Every token is a custom property on `:root`, so you can use them in site CSS:

- colors: `--ink`, `--comment`, `--teal`, …
- signature: `--sig`, `--sig2`, `--sig-text`
- fonts: `--sans`, `--mono`, `--serif`

## Develop

```sh
npm install
npm run format   # Prettier + Stylelint --fix
npm run check    # lint, build, and fail if dist/ is out of date
```

Edit files in `src/`. `dist/` is built by Lightning CSS (bundled, with fallbacks for the browsers in
`browserslist`) and committed, because jsDelivr serves files straight from git tags.

## Release

[Semantic versioning](https://semver.org):

- **patch:** visual fixes
- **minor:** new tokens or components
- **major:** a renamed or removed class or token

1. Update `CHANGELOG.md` and `version` in `package.json`.
2. Run `npm run check`.
3. Commit, then tag: `git tag v1.1.0 && git push && git push origin v1.1.0`.
4. Bump the tag in each site:
   - jordan.bayl.es: `package.json`
   - unraid-config: `stacks/shared/style-version`
