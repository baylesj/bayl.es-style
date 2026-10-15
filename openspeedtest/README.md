# OpenSpeedTest theme

`bayles.css` themes [OpenSpeedTest](https://github.com/openspeedtest/Speed-Test) 2.5 (the self-hosted speed test)
to match the sites. It's generated from `src/tokens.css` by `scripts/openspeedtest-theme.mjs` (run by
`npm run build`): the gauge, graphs and start button in the home signature (teal into green), panels and text in
the page colors for light and dark mode, numbers in Schibsted Grotesk and units in Fira Code. It hides the
OpenSpeedTest logo inside the gauge and its light/dark toggle (the page follows the system theme); the credit line
under the app stays.

## Install

Load it after the app's own CSS, and optionally add the header it styles, right after `<body>`:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/baylesj/bayl.es-style@v1.8.1/openspeedtest/bayles.css"
/>
<header class="bayles-top">
  <span class="prompt"><span class="u">you</span>@eopsin:<span class="p">~/fast</span></span>
  <span class="mark">fast</span>
</header>
```

On eopsin, `unraid-config/stacks/speedtest/index.html` is the stock page with these two added, mounted over the
container's own, so every route (fast.bayl.es, LAN, Tailscale) is themed. Bump the version there when releasing.
