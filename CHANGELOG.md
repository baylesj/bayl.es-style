# Changelog

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
