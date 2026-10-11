# Changelog

## 1.0.0 (2026-10-11)

First release, extracted from unraid-config `stacks/shared/eopsin.css`. Changes since then:

- Light and dark colors use `light-dark()`, and `<html data-theme>` can force a theme.
- Everything is in the cascade layers `tokens`, `base` and `components`.
- Class selectors are no longer tied to elements (`.mark`, `.label`, `.top`, `.steps`).
- New `.split` component (a label column beside content) and `--serif` token.
- `data-site="id"` added (purple, like my).
