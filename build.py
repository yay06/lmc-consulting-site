#!/usr/bin/env python3
"""
Assemble les pages du site LMC Consulting.

  src/pages/*.html  +  src/layout.html, header.html, footer.html   ->   site/*.html

Usage :  python3 build.py
Le dossier site/ est le site final, prêt à être mis en ligne.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
SRC = ROOT / "src"
OUT = ROOT / "site"

ICONS = {
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "phone": '<path d="M5 4h3.5l1.6 4.2-2.2 1.4a11 11 0 0 0 6.5 6.5l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    "pin": '<path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    "external": '<path d="M8 16L16 8M9.5 8H16v6.5"/>',
    "search": '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "close": '<path d="M6 6l12 12M18 6L6 18"/>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    "sprout": '<path d="M12 21v-8"/><path d="M12 13c0-4.4 3-7.5 8-7.5 0 4.4-3 7.5-8 7.5z"/><path d="M12 15.5c0-3.3-2.4-5.8-7-5.8 0 3.3 2.4 5.8 7 5.8z"/>',
    "chart": '<path d="M4 20h16"/><rect x="5.5" y="11" width="3.2" height="6" rx="1"/><rect x="10.4" y="7" width="3.2" height="10" rx="1"/><rect x="15.3" y="4" width="3.2" height="13" rx="1"/>',
    "users": '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5"/><path d="M15.5 4.9a3.1 3.1 0 0 1 0 6.1"/><path d="M17.8 14.9c1.7.7 2.9 2.4 3.2 5.1"/>',
    "receipt": '<path d="M6 3h12v18l-2.4-1.5L13.2 21l-2.4-1.5L8.4 21 6 19.5z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    "shield": '<path d="M12 3l7 3v5.5c0 4.4-3 8.2-7 9.5-4-1.3-7-5.1-7-9.5V6z"/><path d="M9 12l2.2 2.2L15.5 10"/>',
    "swap": '<path d="M7 7h12l-3.5-3.5"/><path d="M17 17H5l3.5 3.5"/>',
    "chat": '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    "bolt": '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    "book": '<path d="M4 4.5h6a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H4z"/><path d="M20 4.5h-6a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h6z"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10v6.5M7.5 7.3v.2M11.5 16.5V10m0 3c0-1.7 1-3 2.6-3s2.4 1.2 2.4 3v3.5"/>',
    "link": '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
}
NAV_KEYS = ["cabinet", "missions", "actualites", "ressources", "contact"]
META_RE = re.compile(r"\A<!--meta\n(.*?)\n-->\n", re.S)
ICON_RE = re.compile(r"\{\{icon:([a-z]+)\}\}")


def icon(match):
    name = match.group(1)
    return f'<svg class="i" viewBox="0 0 24 24" aria-hidden="true">{ICONS[name]}</svg>'


def main():
    layout = (SRC / "layout.html").read_text(encoding="utf-8")
    header = (SRC / "header.html").read_text(encoding="utf-8")
    footer = (SRC / "footer.html").read_text(encoding="utf-8")

    for page in sorted((SRC / "pages").glob("*.html")):
        raw = page.read_text(encoding="utf-8")
        m = META_RE.match(raw)
        if not m:
            raise SystemExit(f"{page.name} : bloc <!--meta ... --> manquant")
        meta = {}
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = raw[m.end():]

        h = header
        for key in NAV_KEYS:
            h = h.replace("{{current:%s}}" % key, ' aria-current="page"' if key == meta.get("active") else "")

        scripts = "".join(
            f'\n  <script src="assets/js/{s.strip()}" defer></script>'
            for s in meta.get("scripts", "").split(",") if s.strip()
        )
        canonical = "" if page.name == "index.html" else page.name
        html = (layout
                .replace("{{title}}", meta["title"])
                .replace("{{description}}", meta["description"])
                .replace("{{canonical}}", canonical)
                .replace("{{bodyclass}}", meta.get("bodyclass", ""))
                .replace("{{header}}", h)
                .replace("{{footer}}", footer)
                .replace("{{body}}", body)
                .replace("{{scripts}}", scripts))
        html = ICON_RE.sub(icon, html)
        (OUT / page.name).write_text(html, encoding="utf-8")
        print("✓", page.name)


if __name__ == "__main__":
    main()
