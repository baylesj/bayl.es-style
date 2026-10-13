# Immich theme

`bayles.css` is custom CSS for [Immich](https://immich.app) v3, generated from `src/tokens.css` by
`scripts/immich-theme.mjs` (run by `npm run build`), so the photo library matches the sites: teal
primary, teal-tinted grays, the sites' page and text colors in light and dark mode, and Schibsted Grotesk.

## Install

Administration → Settings → Theme → Custom CSS, paste `bayles.css`, Save. On eopsin,
`unraid-config/scripts/ha/theme-sync.sh` does this at the version pinned in `stacks/shared/style-version`.

Immich serves it at `/custom.css`; behind a CDN, make sure that path isn't cached (Cloudflare caches
`.css` for 4 hours by default).
