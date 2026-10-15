"""Render an "e." tile from icons/ (rounded rect + glyph paths using M/L/H/V/Q/Z) to PNGs, with no dependencies.

    python3 scripts/icon-png.py icons/ha.svg home-assistant/icons/eopsin 192 512
    python3 scripts/icon-png.py --square icons/ha.svg home-assistant/icons/eopsin-apple 180

--square drops the rounded corners (iOS rounds home-screen icons itself and fills transparent corners with black).
"""

import re
import struct
import sys
import zlib


def tokens(d):
    return re.findall(r"[MLHVQZmlhvqz]|-?\d*\.?\d+(?:e-?\d+)?", d)


def flatten(d, steps=12):
    polys, cur, pt, cmd = [], [], (0.0, 0.0), None
    toks = tokens(d)
    i = 0
    while i < len(toks):
        t = toks[i]
        if t.isalpha():
            cmd = t
            i += 1
            if cmd in "Zz":
                if cur:
                    polys.append(cur)
                    cur = []
                continue
        n = {"M": 2, "L": 2, "H": 1, "V": 1, "Q": 4}[cmd.upper()]
        a = [float(x) for x in toks[i : i + n]]
        i += n
        if cmd == "M":
            if cur:
                polys.append(cur)
            pt = (a[0], a[1])
            cur = [pt]
            cmd = "L"
        elif cmd == "L":
            pt = (a[0], a[1])
            cur.append(pt)
        elif cmd == "H":
            pt = (a[0], pt[1])
            cur.append(pt)
        elif cmd == "V":
            pt = (pt[0], a[0])
            cur.append(pt)
        elif cmd == "Q":
            (x0, y0), (cx, cy), (x1, y1) = pt, (a[0], a[1]), (a[2], a[3])
            for k in range(1, steps + 1):
                s = k / steps
                cur.append(
                    (
                        (1 - s) ** 2 * x0 + 2 * (1 - s) * s * cx + s * s * x1,
                        (1 - s) ** 2 * y0 + 2 * (1 - s) * s * cy + s * s * y1,
                    )
                )
            pt = (x1, y1)
    if cur:
        polys.append(cur)
    return polys


def rounded_rect(w, h, r, steps=16):
    import math

    pts = []
    for cx, cy, a0 in ((w - r, r, -90), (w - r, h - r, 0), (r, h - r, 90), (r, r, 180)):
        for k in range(steps + 1):
            a = math.radians(a0 + 90 * k / steps)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return [pts]


def coverage(polys, size, view, ss=4):
    """Nonzero-winding scanline fill with ss x ss supersampling; returns a size*size list of 0..1."""
    scale = size / view
    edges = []
    for p in polys:
        for (x0, y0), (x1, y1) in zip(p, p[1:] + p[:1]):
            if y0 != y1:
                edges.append(
                    (
                        x0 * scale,
                        y0 * scale,
                        x1 * scale,
                        y1 * scale,
                        1 if y1 > y0 else -1,
                    )
                )
    cov = [0.0] * (size * size)
    n = size * ss
    for sy in range(n):
        y = (sy + 0.5) / ss
        xs = sorted(
            (x0 + (y - y0) * (x1 - x0) / (y1 - y0), w)
            for x0, y0, x1, y1, w in edges
            if (y0 <= y < y1) or (y1 <= y < y0)
        )
        row, wind = int(y) * size, 0
        for (a, w), (b, _) in zip(xs, xs[1:] + [(0, 0)]):
            wind += w
            if wind:
                for sx in range(max(0, int(a * ss + 0.5)), min(n, int(b * ss + 0.5))):
                    cov[row + sx // ss] += 1 / (ss * ss)
    return cov


def render(svg, size):
    view = float(re.search(r'viewBox="0 0 ([\d.]+)', svg).group(1))
    rx = float(re.search(r'rx="([\d.]+)"', svg).group(1))
    bg = re.search(r'<rect[^>]*fill="#([0-9A-Fa-f]{6})"', svg).group(1)
    tx, ty = map(
        float, re.search(r"translate\(([\d.]+) ([\d.]+)\) scale\(1 -1\)", svg).groups()
    )
    glyphs = []
    for m in re.finditer(
        r'<path fill="#([0-9A-Fa-f]{6})"(?: transform="translate\(([\d.]+) 0\)")? d="([^"]+)"',
        svg,
    ):
        fg, dx = m.group(1), float(m.group(2) or 0)
        for p in flatten(m.group(3)):
            glyphs.append([(tx + dx + x, ty - y) for x, y in p])
    tile = coverage(rounded_rect(view, view, rx), size, view)
    text = coverage(glyphs, size, view)

    def hx(h):
        return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))

    B, F = hx(bg), hx(fg)
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            t, g = tile[y * size + x], min(1.0, text[y * size + x])
            rgb = [round(B[c] * (1 - g) + F[c] * g) for c in range(3)]
            raw += bytes(rgb + [round(255 * min(1.0, t))])

    def chunk(k, d):
        return (
            struct.pack(">I", len(d))
            + k
            + d
            + struct.pack(">I", zlib.crc32(k + d) & 0xFFFFFFFF)
        )

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
        + chunk(b"IEND", b"")
    )


if __name__ == "__main__":
    args = sys.argv[1:]
    square = args[0] == "--square"
    if square:
        args = args[1:]
    svg = open(args[0]).read()
    if square:
        svg = re.sub(r'rx="[\d.]+"', 'rx="0"', svg)
    for size in map(int, args[2:]):
        with open(f"{args[1]}-{size}.png", "wb") as f:
            f.write(render(svg, size))
