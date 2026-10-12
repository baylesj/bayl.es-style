# Changelog

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
