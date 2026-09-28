#!/usr/bin/env python3
"""Fold each page of the site into one element that can be pasted into GoHighLevel.

The site runs on GoHighLevel as five website pages on jeffreybrianbuilds.com,
one per page here. GHL serves no files of its own for a custom-code element, so
each page's stylesheets and its small original scripts are inlined, and
everything else (images, and the scripts added with the React-branch features)
loads from ASSETS, the Cloudflare Worker that serves this repo's main branch.
That host sends Access-Control-Allow-Origin for js/, css/ and img/ (see
_headers): module scripts and the barrel's WebGL textures need it to load on
another origin.

Run from the repo root after changing the site:

    python3 ghl/build-embed.py

Output goes to ghl/embed/: one .html per page to paste, and PAGES.md, the
checklist of GHL page paths, titles and descriptions. Do not hand-edit it.
"""
import html as html_mod
import os
import re

ASSETS = "https://jeffreybrianbuilds.jeffreybriancastro.workers.dev"
OUT_DIR = "ghl/embed"

# Page on disk -> (output name, path of its GHL page on the domain).
PAGES = [
    ("index.html", "home", "/"),
    ("work/automation-workflow.html", "automation-workflow", "/automation-workflow"),
    ("work/ghl-crm-setup.html", "ghl-crm-setup", "/ghl-crm-setup"),
    ("work/sales-funnel.html", "sales-funnel", "/sales-funnel"),
    ("work/website-build.html", "website-build", "/website-build"),
]
SLUG = {src: path for src, _, path in PAGES}

# Small, original scripts: inlined, as before.
INLINE = ("main", "sysmap", "gallery")


def ghl_links(html, src):
    """Point every link between pages at the GHL page that holds it."""
    here = os.path.dirname(src)

    def target(m):
        attr, href = m.group(1), m.group(2)
        path, _, frag = href.partition("#")
        page = os.path.normpath(os.path.join(here, path)) if path else src
        if page not in SLUG:
            return m.group(0)
        url = SLUG[page]
        if frag:
            # Same page: keep the bare anchor so the scroll stays in-page.
            url = f"#{frag}" if page == src else f"{url}#{frag}"
        return f'{attr}="{url}"'

    return re.sub(r'(href)="((?:\.\./)?(?:[a-z-]+/)?[a-z-]+\.html(?:#[^"]*)?)"', target, html)


def build(src, name, path):
    prefix = "../" * src.count("/")
    html = open(src, encoding="utf-8").read()
    head = html.split("<head>", 1)[1].split("</head>", 1)[0]
    title = re.search(r"<title>(.*?)</title>", head, re.S).group(1).strip()
    desc_m = re.search(r'<meta name="description" content="([^"]*)"', head)
    desc = desc_m.group(1) if desc_m else ""

    # Every stylesheet the page links, in the page's order, inlined.
    css_files = [f for f in re.findall(
        rf'<link rel="stylesheet" href="{re.escape(prefix)}(css/[^"?]+)(?:\?[^"]*)?"', head)]
    assert css_files and css_files[0] == "css/styles.css", (src, css_files)
    css = "\n\n".join(open(f, encoding="utf-8").read() for f in css_files)
    assert ":root {" in css

    def scripts(block):
        return re.findall(rf'<script [^>]*src="{re.escape(prefix)}js/[^"]+"[^>]*></script>', block)

    def script_name(tag):
        return re.search(r'src="(?:\.\./)*js/([^"?]+)\.js', tag).group(1)

    def external(block):
        out = []
        for tag in scripts(block):
            if script_name(tag) in INLINE:
                continue
            tag = re.sub(rf'src="{re.escape(prefix)}js/', f'src="{ASSETS}/js/', tag)
            # The tab bar builds its links from data-root: keep them on the domain.
            if "/js/tabbar.js" in tag:
                tag = re.sub(r'\s*data-root="[^"]*"', "", tag)
                tag = tag.replace("></script>", ' data-root="/"></script>')
            out.append(tag)
        return "\n".join(out)

    head_js = external(head)
    body = html.split("<body>", 1)[1].rsplit("</body>", 1)[0]
    inline_js = [open(f"js/{script_name(t)}.js", encoding="utf-8").read()
                 for t in scripts(body) if script_name(t) in INLINE]
    body_js = external(body)
    body = re.sub(
        r'\n?<!-- [^\n]*?-->\n?<script src="https://go\.jeffreybrianbuilds\.com[^>]*></script>',
        "", body)
    body = re.sub(r'\n?<script [^>]*src="(?:\.\./)*js/[^"]+"[^>]*></script>', "", body)
    assert not re.search(r"<script [^>]*src=", body), f"{src}: a <script src> survived"

    # GHL has nowhere to put an img/ folder.
    body, n_img = re.subn(rf'(src|href)="{re.escape(prefix)}(img/[^"]+)"', rf'\1="{ASSETS}/\2"', body)
    assert not re.search(r'(src|href)="(\.\./)*img/', body), src

    body = ghl_links(body, src)
    leftover = re.findall(r'href="((?:\.\./)?[^":#]+\.html[^"]*)"', body)
    assert not leftover, f"{src}: unconverted page links {leftover}"

    inline_tags = "\n".join(f"<script>\n{js}\n</script>" for js in inline_js)
    fragment = f"""<!-- ============================================================
     {title}
     GoHighLevel page path: {path}

     PASTE INTO A BLANK PAGE: one Custom Code element, nothing else on it.
     No GHL header, footer or other sections. This carries its own reset and
     paints the whole page.

     Images and the feature scripts load from {ASSETS}
     (the Cloudflare Worker serving this repo's main branch). Delete that
     Worker and they break.

     Generated by ghl/build-embed.py. Edit the site, run it again, re-paste.
     ============================================================ -->

{head_js}

<style>
@import url("https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap");

/* GHL puts page content in a padded, max-width column. The site draws its own
   full-height shell, so it steps out of that column. */
.jbc-site {{
  width: 100vw;
  margin-left: calc(50% - 50vw);
  max-width: none;
}}

{css}
</style>

<div class="jbc-site">
{body.strip()}
</div>

{inline_tags}
{body_js}
<script>
/* GoHighLevel loads this itself when a page holds a native form or calendar
   element. These are raw iframes so it will not, but if the page does have one,
   loading it twice binds every resize handler twice. */
(function () {{
  if (!document.querySelector('iframe[src*="go.jeffreybrianbuilds.com"]')) return;
  var already = Array.prototype.some.call(document.scripts, function (s) {{
    return /form_embed\\.js/.test(s.src || "");
  }});
  if (already) return;
  var s = document.createElement("script");
  s.src = "https://go.jeffreybrianbuilds.com/js/form_embed.js";
  document.body.appendChild(s);
}})();
</script>
"""
    out = f"{OUT_DIR}/{name}.html"
    open(out, "w", encoding="utf-8").write(fragment)
    print(f"{out}: {len(fragment.encode()) // 1024} KB, {n_img} image URLs -> {path}")
    return name, path, title, desc


os.makedirs(OUT_DIR, exist_ok=True)
rows = [build(*p) for p in PAGES]

guide = ["# GoHighLevel pages for jeffreybrianbuilds.com", "",
         "Generated by ghl/build-embed.py. One GHL website page per row. For each:",
         "blank page, one Custom Code element, paste the file's whole contents.", "",
         "| Paste this file | GHL page path | SEO title | SEO description |",
         "|---|---|---|---|"]
for name, path, title, desc in rows:
    cell = lambda t: html_mod.unescape(t).replace("|", "\\|")
    guide.append(f"| `ghl/embed/{name}.html` | `{path}` | {cell(title)} | {cell(desc)} |")
open(f"{OUT_DIR}/PAGES.md", "w", encoding="utf-8").write("\n".join(guide) + "\n")
print(f"{OUT_DIR}/PAGES.md")
