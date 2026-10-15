# Home Assistant theme

`bayles.yaml` is a Home Assistant theme called **bayl.es**, with light and dark modes. It's generated
from `src/tokens.css` by `scripts/ha-theme.mjs`, so its colors stay in step with the sites. HA uses
home.bayl.es's signature: teal, with green for "on".

## Install

1. Copy `bayles.yaml` to `/config/themes/bayles/` (needs `frontend: themes: !include_dir_merge_named themes`).
2. Copy `bayles-fonts.js` to `/config/www/bayles/`, and these woff2 files from Fontsource to
   `/config/www/bayles/fonts/`:
   - `schibsted-grotesk-latin-wght-normal.woff2` (`@fontsource-variable/schibsted-grotesk`)
   - `fira-code-latin-400-normal.woff2` and `fira-code-latin-500-normal.woff2` (`@fontsource/fira-code`)
3. Copy `icons/` to `/config/www/bayles/icons/`. `bayles-fonts.js` swaps HA's favicon and iOS home-screen icon
   for the eopsin tile in Home Assistant blue (rendered from `../icons/ha.svg` by `scripts/icon-png.py`).
4. Add the dashboard resource `/local/bayles/bayles-fonts.js` (JavaScript module).
5. Call `frontend.reload_themes`, then pick **bayl.es** under Profile → Theme.

It's opt-in: the default theme doesn't change.

## Keeping it in sync

On eopsin, `unraid-config/scripts/ha/theme-sync.sh` installs this theme at the version pinned in
`stacks/shared/style-version`, the same pin the server apps use. Bump the pin, run the script, and HA
matches the sites.
