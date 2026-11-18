/*
 * The bayl.es galaxy: the map behind the header, after the Sensors Manager in Homeworld.
 *
 * Every site draws the same galaxy from one fixed seed: a plane seen almost edge-on with range rings,
 * a star field, and seven waypoints on stalks that form the Big Dipper (Chilseong; see DESIGN.md). The
 * waypoint of the site you are on (<body data-site>) is lit in its star color and bracketed. At night
 * the map sits on the page's ground; by day it is etched in pale lines on slate, after the Guidestone.
 *
 * Markup:
 *   <header class="scope">
 *     <canvas></canvas>
 *     <div class="wrap"><div class="head">…prompt, wordmark, controls…</div></div>
 *     <span class="caption"></span>
 *   </header>
 * then load this file (a script tag pointing at js/galaxy.js on the CDN, or inlined; defer is fine).
 * It redraws on resize, on a theme change and when data-site changes. Nothing is drawn under the
 * panel or the caption.
 *
 * This comment must never contain a closing script tag: sites can inline this file into a script element.
 */
(() => {
  const SEED = "eopsin";
  const TILT = 0.18; // near edge-on: depth is squashed to 18% of the width
  const LIFT = 0.75; // elevation, as a share of the header's height
  // The Big Dipper, in plane units: x across, z depth (+ is nearer), y height above the plane. The bowl
  // hangs below the plane on the right, the handle rises above it to the left.
  const WAYPOINTS = {
    home: [0.376, 0.14, 0.046], // Dubhe
    my: [0.4, 0.16, -0.206], // Merak
    id: [0.133, 0.12, -0.275], // Phecda
    audible: [0.085, 0.08, -0.046], // Megrez
    orbit: [-0.109, 0.02, 0.023], // Alioth
    zero: [-0.279, -0.04, 0.115], // Mizar; an eighth site takes Alcor beside it
    jordan: [-0.4, -0.1, 0.275], // Alkaid
  };
  const FIGURE = ["jordan", "zero", "orbit", "audible", "home", "my", "id", "audible"];

  function hash(str) {
    let h = 2166136261;
    for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return h >>> 0;
  }

  function rng(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // The same stars on every page: two loose arms around a dense core, and a sparse halo.
  const STARS = (() => {
    const r = rng(hash(SEED));
    const out = [];
    for (let i = 0; i < 560; i++) {
      const halo = r() < 0.14;
      const a0 = r(),
        d0 = r(),
        j = r() - 0.5,
        h = r() - 0.5,
        b = r();
      let x, z, y;
      if (halo) {
        const a = a0 * Math.PI * 2,
          d = 0.25 + d0 * 1.05;
        [x, z, y] = [Math.cos(a) * d, Math.sin(a) * d, h * 0.5];
      } else {
        const d = 0.04 + d0 * d0 * 1.1;
        const a = (i % 2) * Math.PI + d * 3.6 + j * (0.5 + d) * 1.1;
        [x, z, y] = [Math.cos(a) * d, Math.sin(a) * d, h * 0.14 * (1.2 - d)];
      }
      out.push({ x, z, y, b: b > 0.93 ? 2 : b > 0.68 ? 1 : 0 });
    }
    return out;
  })();

  // Resolve a CSS color expression to #rrggbb where it's used (inside the header), through a 1px canvas,
  // so color-mix() and light-dark() land as the page would draw them.
  const probeCanvas = document.createElement("canvas");
  probeCanvas.width = probeCanvas.height = 1;
  const pctx = probeCanvas.getContext("2d", { willReadFrequently: true });
  function resolver(host) {
    const probe = document.createElement("span");
    probe.hidden = true;
    host.append(probe);
    return (expr) => {
      probe.style.color = expr;
      const c = getComputedStyle(probe).color;
      pctx.clearRect(0, 0, 1, 1);
      pctx.fillStyle = "#000";
      pctx.fillStyle = c;
      pctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = pctx.getImageData(0, 0, 1, 1).data;
      return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
    };
  }

  function draw(scope, state) {
    const cv = scope.querySelector(":scope > canvas");
    const head = scope.querySelector(".head");
    const caption = scope.querySelector(".caption");
    const W = cv.clientWidth,
      H = cv.clientHeight;
    if (!W || !H) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const ctx = cv.getContext("2d");
    ctx.scale(dpr, dpr);

    const site = document.body.dataset.site;
    const css = state.css;
    const v = (name) => css(`var(${name})`);
    const light = css("light-dark(#000000, #ffffff)") === "#000000";
    // by night: starlight on the ground; by day: the galaxy etched on slate
    const c = light
      ? {
          ground: v("--g-field"),
          ring: v("--e-ring"),
          spoke: v("--e-spoke"),
          stalk: v("--e-stalk"),
          dim: v("--e-dim"),
          origin: v("--e-stalk"),
          star: [v("--e-star1"), v("--e-star2"), v("--e-star3")],
          lit: v("--star"),
          bracket: v("--star"),
          readout: v("--ground"),
        }
      : {
          ground: v("--g-field"),
          ring: v("--g-ring"),
          spoke: v("--g-spoke"),
          stalk: v("--g-stalk"),
          dim: v("--g-dim"),
          origin: v("--comment"),
          star: [v("--g-star1"), v("--g-star2"), v("--g-star3")],
          lit: v("--star"),
          bracket: v("--bracket"),
          readout: v("--soft"),
        };
    if (caption) caption.textContent = WAYPOINTS[site] ? `galaxy · waypoint ${site}.bayl.es` : "";

    // the words keep clear ground: nothing is drawn under the panel or the caption
    const cb = cv.getBoundingClientRect();
    const box = (el, m) => {
      const b = el.getBoundingClientRect();
      return {
        x0: b.left - cb.left - m,
        y0: b.top - cb.top - m,
        x1: b.right - cb.left + m,
        y1: b.bottom - cb.top + m,
      };
    };
    const avoid = [head && box(head, 10), caption && caption.textContent && box(caption, 7)].filter(
      Boolean,
    );
    const blocked = (x, y) => avoid.some((b) => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1);

    const narrow = W < 700;
    const below = head ? head.getBoundingClientRect().bottom - cb.top + 8 : 0;
    // the plane runs off both edges: the galaxy is bigger than any page
    const cx = narrow ? W * 0.5 : W * 0.68;
    const cy = narrow ? below + (H - below) * 0.48 : H * 0.52;
    const R = narrow ? W * 0.95 : W * 0.78;
    const LH = narrow ? H - below : H;
    // The Dipper keeps its own size: about 440px wide at most, centred in the open space beside the
    // panel (under it on phones). Its stars span 0.8 plane units before scaling.
    const free0 = narrow || !head ? 0 : head.getBoundingClientRect().right - cb.left + 24;
    const free1 = W - 24;
    const dipS = Math.min(440, (free1 - free0) * 0.8) / (0.8 * R);
    const dipX = ((free0 + free1) / 2 - cx) / R;
    const WP = Object.fromEntries(
      Object.entries(WAYPOINTS).map(([k, [x, z, y]]) => [k, [x * dipS + dipX, z, y]]),
    );
    const proj = (x, z, y = 0) => {
      const p = 1 / (1 - 0.12 * z); // a little perspective: the near side is larger
      return [cx + x * R * p, cy + (z * R * TILT - y * LH * LIFT) * p];
    };

    ctx.fillStyle = c.ground;
    ctx.fillRect(0, 0, W, H);

    // the plane: spokes, range rings, the origin
    ctx.lineWidth = 1;
    ctx.strokeStyle = c.spoke;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const [x0, y0] = proj(Math.cos(a) * 0.08, Math.sin(a) * 0.08);
      const [x1, y1] = proj(Math.cos(a) * 1.7, Math.sin(a) * 1.7);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    ctx.strokeStyle = c.ring;
    for (const f of [0.25, 0.5, 0.75, 1, 1.3, 1.65]) {
      ctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        const [x, y] = proj(Math.cos(a) * f, Math.sin(a) * f);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
    const [ox, oy] = proj(0, 0);
    ctx.strokeStyle = c.origin;
    ctx.beginPath();
    ctx.moveTo(ox - 5, oy);
    ctx.lineTo(ox + 5, oy);
    ctx.moveTo(ox, oy - 2);
    ctx.lineTo(ox, oy + 2);
    ctx.stroke();

    // the field: three steps of starlight
    for (const s of STARS) {
      const [px, py] = proj(s.x, s.z, s.y);
      if (px < 0 || px > W - 2 || py < 0 || py > H - 2) continue;
      ctx.fillStyle = c.star[s.b];
      const sz = s.b === 2 ? 2 : 1.5;
      ctx.fillRect(Math.round(px), Math.round(py), sz, sz);
    }

    // the Dipper's figure: a faint star-chart line through the waypoint tips
    ctx.strokeStyle = c.dim;
    ctx.globalAlpha = 0.7;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    FIGURE.forEach((k, i) => {
      const [x, z, y] = WP[k];
      const [px, py] = proj(x, z, y);
      if (i) ctx.lineTo(px, py);
      else ctx.moveTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;

    // the waypoints, back to front; the current one lit
    let here = null;
    for (const [key, [x, z, y]] of Object.entries(WP).sort((a, b) => a[1][1] - b[1][1])) {
      const [fx, fy] = proj(x, z);
      const [mx, my] = proj(x, z, y);
      const cur = key === site;
      ctx.strokeStyle = cur ? c.lit : c.stalk;
      ctx.fillStyle = cur ? c.lit : c.dim;
      ctx.beginPath();
      ctx.moveTo(Math.round(fx) + 0.5, fy);
      ctx.lineTo(Math.round(mx) + 0.5, my);
      ctx.stroke();
      ctx.fillRect(Math.round(fx) - 2, Math.round(fy), 5, 1); // the foot on the plane
      const s = cur ? 4.5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(mx + 0.5, my - s);
      ctx.lineTo(mx + 0.5 + s, my);
      ctx.lineTo(mx + 0.5, my + s);
      ctx.lineTo(mx + 0.5 - s, my);
      ctx.closePath();
      ctx.fill();
      if (cur) here = { x: mx, y: my };
    }

    // the current waypoint: corner brackets and a readout on its own patch of ground
    state.here = here;
    if (!here || blocked(here.x, here.y)) return;
    ctx.strokeStyle = c.bracket;
    const k = 9,
      l = 4;
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ]) {
      const x = Math.round(here.x + sx * k) + 0.5,
        y = Math.round(here.y + sy * k) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x - sx * l, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y - sy * l);
      ctx.stroke();
    }
    // home.bayl.es is Hiigara, the homeworld, whose name means "home". Shown only on hover.
    const text = state.egg && site === "home" ? "hiigara · home.bayl.es" : `${site}.bayl.es`;
    ctx.font = `12px ${getComputedStyle(scope).getPropertyValue("--mono") || "monospace"}`;
    ctx.textBaseline = "middle";
    const w = ctx.measureText(text).width;
    const at = (lx) => ({ x0: lx - 4, y0: here.y - 9, x1: lx + w + 4, y1: here.y + 9 });
    const fits = (b) =>
      b.x0 > 2 &&
      b.x1 < W - 2 &&
      b.y0 > 1 &&
      b.y1 < H - 1 &&
      ![
        [b.x0, b.y0],
        [b.x1, b.y0],
        [b.x0, b.y1],
        [b.x1, b.y1],
      ].some(([x, y]) => blocked(x, y));
    let lx = here.x + 16;
    let b = at(lx);
    if (!fits(b)) b = at((lx = here.x - 16 - w));
    if (!fits(b)) return;
    ctx.fillStyle = c.ground;
    ctx.fillRect(b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
    ctx.fillStyle = c.readout;
    ctx.fillText(text, lx, here.y + 0.5);
  }

  function start() {
    document.querySelectorAll(".scope").forEach((scope) => {
      if (!scope.querySelector(":scope > canvas")) return;
      const state = { css: resolver(scope), here: null, egg: false };
      let queued = 0;
      const redraw = () => {
        cancelAnimationFrame(queued);
        queued = requestAnimationFrame(() => draw(scope, state));
      };
      redraw();
      new ResizeObserver(redraw).observe(scope);
      new MutationObserver(redraw).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      new MutationObserver(redraw).observe(document.body, {
        attributes: true,
        attributeFilter: ["data-site"],
      });
      matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw);
      if (document.fonts) document.fonts.ready.then(redraw);
      // pointing at the home waypoint on home.bayl.es names it
      scope.addEventListener("pointermove", (e) => {
        if (document.body.dataset.site !== "home" || !state.here) return;
        const cb = scope.querySelector(":scope > canvas").getBoundingClientRect();
        const near =
          Math.hypot(e.clientX - cb.left - state.here.x, e.clientY - cb.top - state.here.y) < 16;
        if (near !== state.egg) {
          state.egg = near;
          redraw();
        }
      });
      scope.addEventListener("pointerleave", () => {
        if (state.egg) {
          state.egg = false;
          redraw();
        }
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
