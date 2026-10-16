/*
 * The bayl.es theme switch: auto (follows the system), light, dark, in turn.
 *
 * Load it in the page's head (a script tag pointing at js/theme.js on the CDN, or inlined: see the README), so
 * a chosen theme is applied before the page is drawn, and put an empty button with class "theme-toggle"
 * where it belongs (usually the header). This script fills in the icons and wires it up; without JavaScript
 * the button stays hidden.
 *
 * This comment must never contain a closing script tag: sites inline this file into a script element.
 *
 * On *.bayl.es the choice is a cookie on bayl.es, so it follows you from site to site; anywhere else
 * (localhost, a Tailscale name) it's kept in this site's localStorage. "auto" forgets it.
 */
(() => {
  const KEY = "theme";
  const MODES = ["auto", "light", "dark"];
  const shared = /(^|\.)bayl\.es$/.test(location.hostname);

  const read = () => {
    const cookie = document.cookie.match(/(?:^|;\s*)theme=(light|dark)\b/);
    if (cookie) return cookie[1];
    try {
      const saved = localStorage.getItem(KEY);
      return saved === "light" || saved === "dark" ? saved : "auto";
    } catch {
      return "auto"; // storage blocked (private mode)
    }
  };

  const write = (mode) => {
    const keep = mode !== "auto";
    if (shared) {
      const life = keep ? `${mode}; Max-Age=31536000` : "; Max-Age=0";
      document.cookie = `${KEY}=${life}; Domain=bayl.es; Path=/; SameSite=Lax; Secure`;
    }
    try {
      if (keep) localStorage.setItem(KEY, mode);
      else localStorage.removeItem(KEY);
    } catch {
      /* storage blocked: the cookie (or nothing) will do */
    }
  };

  const apply = (mode) => {
    if (mode === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = mode;
  };

  apply(read());

  const svg = (body) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const ICONS = {
    auto: svg(
      '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    ),
    light: svg(
      '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    ),
    dark: svg('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
  };

  const show = (button, mode) => {
    button.innerHTML = ICONS[mode];
    button.dataset.mode = mode;
    button.setAttribute("aria-label", `Theme: ${mode}`);
    button.title = mode === "auto" ? "Theme: auto (follows your system)" : `Theme: ${mode}`;
  };

  const wire = () => {
    const buttons = document.querySelectorAll(".theme-toggle");
    buttons.forEach((button) => {
      show(button, read());
      button.addEventListener("click", () => {
        const mode = MODES[(MODES.indexOf(read()) + 1) % MODES.length];
        write(mode);
        apply(mode);
        buttons.forEach((b) => show(b, mode));
      });
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
  else wire();
})();
