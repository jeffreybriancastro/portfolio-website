#!/usr/bin/env python3
"""Recolour the template's stylesheet into Jeffrey's brand.

css/template.orig.css is the portfolio-template's compiled CSS (BrewedOps, MIT),
kept untouched. This writes css/template.css from it:

- every orange (the template's accent, its hovers, inks and warm tints) turns
  into the JB logo's blue, #0055FE, at the same lightness and saturation, so a
  pale orange wash becomes a pale blue wash and a deep orange ink a deep blue;
- the template's navy becomes the brand's deep navy, #011222.

Colours that only look warm by accident are left alone: #FEBC2E and #FF5F57 are
the yellow and red window dots on the screenshot frames.

    python3 scripts/brand-recolor.py
"""
import colorsys
import re

BLUE_HUE = colorsys.rgb_to_hls(0x00 / 255, 0x55 / 255, 0xFE / 255)[0]
KEEP = {"#FEBC2E", "#FF5F57", "#28C840"}
EXACT = {  # the template's named navies -> brand deep navy family
    "#0B1E3F": "#011222",
    "#060C1A": "#000A16",
    "#FF7A1A": "#0055FE",
}


def warm(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    return s > 0.35 and 0.02 < h < 0.14, (h, l, s)


def to_blue(r, g, b):
    ok, (h, l, s) = warm(r, g, b)
    if not ok:
        return None
    nr, ng, nb = colorsys.hls_to_rgb(BLUE_HUE, l, s)
    return round(nr * 255), round(ng * 255), round(nb * 255)


def hex_sub(m):
    h = m.group(0).upper()
    if h in EXACT:
        return EXACT[h]
    if h in KEEP:
        return m.group(0)
    new = to_blue(*(int(h[i:i + 2], 16) for i in (1, 3, 5)))
    return "#%02X%02X%02X" % new if new else m.group(0)


def rgb_sub(m):
    r, g, b = (int(x) for x in m.group(2, 3, 4))
    new = to_blue(r, g, b)
    if not new:
        return m.group(0)
    return f"{m.group(1)}({new[0]},{new[1]},{new[2]}"


css = open("css/template.orig.css", encoding="utf-8").read()
css = re.sub(r"#[0-9a-fA-F]{6}\b", hex_sub, css)
css = re.sub(r"(rgba?)\((\d+),\s*(\d+),\s*(\d+)", rgb_sub, css)
header = ("/* portfolio-template by BrewedOps (MIT), see LICENSE. Recoloured to the "
          "JB brand by scripts/brand-recolor.py from css/template.orig.css: do not "
          "edit by hand. */\n")
open("css/template.css", "w", encoding="utf-8").write(header + css)
left = [h for h in re.findall(r"#[0-9a-fA-F]{6}\b", css) if warm(*(int(h[i:i+2], 16) for i in (1, 3, 5)))[0] and h.upper() not in KEEP]
print("css/template.css written; warm colours left:", sorted(set(left)))
