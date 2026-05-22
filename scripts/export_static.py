#!/usr/bin/env python3
"""Export the current Django-template website to static HTML for GitHub Pages.

This script is intentionally dependency-free: it implements only the small subset
of Django template syntax used by this project, so the original Django app can
remain unchanged while GitHub Pages serves the generated docs/ folder.
"""
from __future__ import annotations

import datetime as _dt
import html
import re
import shutil
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "templates"
STATIC_SRC = ROOT / "static"
OUT = ROOT / "docs"

# Keep these paths aligned with website/urls.py. We keep the existing public URLs
# unchanged, including ampersands, to avoid changing page addresses/content.
URLS = {
    "home": "/",
    "contatti": "/contatti/",
    "demo_list": "/demo/",
    "demo_romantico": "/demo/romantico/",
    "demo_choco": "/demo/choco/",
    "demo2": "/demo2/",
    "demo3": "/demo3/",
    "demo4": "/demo4/",
    "demo5": "/demo5/",
    "demo6": "/demo6/",
    "demo7": "/demo7/",
    "demo8": "/demo8/",
    "demominimal": "/demo/minimal/",
    "demoluxury": "/demo/luxury/",
    "brochureita": "/brochure_ita/",
    "brochureeng": "/brochure_eng/",
    "partnerkit": "/partnerkit/",
    "emmaejames": "/emma&james/",
    "charlotteoliver": "/charlotte&oliver/",
    "saraeandrea": "/sara&andrea/",
    "harryekate": "/harry&kate/",
}

DEMOS = [
    {
        "slug": "romantico",
        "title": "Demo Romantico",
        "subtitle": "Stile elegante, foto grandi, timeline della storia.",
    },
    {
        "slug": "minimal",
        "title": "Demo Minimal",
        "subtitle": "Pulito, moderno, perfetto per coppie essenziali.",
    },
    {
        "slug": "boho",
        "title": "Demo Boho Chic",
        "subtitle": "Palette calda, illustrazioni, vibe naturale.",
    },
    {
        "slug": "luxury",
        "title": "Demo Luxury",
        "subtitle": "Hero impact, dettagli premium, RSVP in evidenza.",
    },
    {
        "slug": "destination",
        "title": "Demo Destination Wedding",
        "subtitle": "Mappe, travel info, eventi su più giorni.",
    },
]

# Public pages to export: route path -> template name -> optional context.
# We do not export demo8 because website/urls.py references it but the template
# demo8.html is not present in the project.
PAGES: List[Tuple[str, str, Dict[str, Any]]] = [
    ("/", "home.html", {"demos": DEMOS}),
    ("/contatti/", "contatti.html", {}),
    ("/demo/", "demo_list.html", {"demos": DEMOS}),
    ("/demo/romantico/", "demo_romantico.html", {}),
    # Preserve the current Django behavior: /demo/choco/ is routed to demo_romantico.
    ("/demo/choco/", "demo_romantico.html", {}),
    ("/demo/minimal/", "demo_minimal.html", {"demo": DEMOS[1]}),
    ("/demo/boho/", "demo_boho.html", {"demo": DEMOS[2]}),
    ("/demo/luxury/", "demo_luxury.html", {"demo": DEMOS[3]}),
    ("/demo/destination/", "demo_destination.html", {"demo": DEMOS[4]}),
    ("/demo2/", "demo2.html", {}),
    ("/demo3/", "demo3.html", {}),
    ("/demo4/", "demo4.html", {}),
    ("/demo5/", "demo5.html", {}),
    ("/demo6/", "demo6.html", {}),
    ("/demo7/", "demo7.html", {}),
    ("/brochure_ita/", "brochure_ita.html", {}),
    ("/brochure_eng/", "brochure_eng.html", {}),
    ("/partnerkit/", "partnerkit.html", {}),
    ("/emma&james/", "emma&james.html", {}),
    ("/charlotte&oliver/", "charlotte&oliver.html", {}),
    ("/sara&andrea/", "sara&andrea.html", {}),
    ("/harry&kate/", "harry&kate.html", {}),
]

STATIC_PREFIX = "/static/"

# Valid 1x1 warm placeholder JPEG. It is used only for source templates that
# reference local image files not included in the repository.
PLACEHOLDER_JPEG = bytes.fromhex(
    "ffd8ffe000104a46494600010100000100010000ffdb0043000302020302020303030304030304050805050404050a070706080c0a0c0c0b0a0b0b0d0e12100d0e110e0b0b1016101113141515150c0f171816141812141514ffdb00430103040405040509050509140d0b0d141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414141414ffc00011080001000103012200021101031101ffc4001400010000000000000000000000000000000000000008ffc4001410010000000000000000000000000000000000000000ffda000c03010002110311003f00b2c001ffd9"
)



def static_url(path: str) -> str:
    return STATIC_PREFIX + path.lstrip("/")


def get_value(expr: str, context: Dict[str, Any]) -> Any:
    expr = expr.strip()
    if (expr.startswith("'") and expr.endswith("'")) or (expr.startswith('"') and expr.endswith('"')):
        return expr[1:-1]
    current: Any = context
    for part in expr.split("."):
        part = part.strip()
        if isinstance(current, dict):
            current = current.get(part, "")
        else:
            current = getattr(current, part, "")
    return current


def resolve_url(name: str, args: Iterable[str], context: Dict[str, Any]) -> str:
    if name == "demo_detail":
        args = list(args)
        slug = get_value(args[0], context) if args else ""
        return f"/demo/{slug}/"
    return URLS.get(name, "#")


def extract_blocks(text: str) -> Dict[str, str]:
    blocks: Dict[str, str] = {}
    pattern = re.compile(r"{%\s*block\s+(\w+)\s*%}(.*?){%\s*endblock\s*%}", re.S)
    for match in pattern.finditer(text):
        blocks[match.group(1)] = match.group(2)
    return blocks


def load_template(template_name: str) -> str:
    path = TEMPLATES / template_name
    if not path.exists():
        raise FileNotFoundError(f"Template not found: {template_name}")
    return path.read_text(encoding="utf-8")


def render_template(template_name: str, context: Dict[str, Any] | None = None) -> str:
    context = dict(context or {})
    text = load_template(template_name)

    extends = re.search(r"{%\s*extends\s+[\"']([^\"']+)[\"']\s*%}", text)
    if extends:
        child_blocks = extract_blocks(text)
        base_text = load_template(extends.group(1))

        def replace_base_block(match: re.Match[str]) -> str:
            name = match.group(1)
            default = match.group(2)
            return child_blocks.get(name, default)

        text = re.sub(
            r"{%\s*block\s+(\w+)\s*%}(.*?){%\s*endblock\s*%}",
            replace_base_block,
            base_text,
            flags=re.S,
        )

    return render_string(text, context)


def render_string(text: str, context: Dict[str, Any]) -> str:
    # Includes, recursively rendered with the same context.
    include_re = re.compile(r"{%\s*include\s+[\"']([^\"']+)[\"']\s*%}")
    while include_re.search(text):
        text = include_re.sub(lambda m: render_template(m.group(1), context), text)

    # Simple for-loops used in demo_list.html.
    loop_re = re.compile(r"{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%}(.*?){%\s*endfor\s*%}", re.S)

    def render_loop(match: re.Match[str]) -> str:
        var_name, list_name, body = match.group(1), match.group(2), match.group(3)
        items = context.get(list_name, [])
        rendered = []
        for item in items:
            nested = dict(context)
            nested[var_name] = item
            rendered.append(render_string(body, nested))
        return "".join(rendered)

    while loop_re.search(text):
        text = loop_re.sub(render_loop, text)

    # Static assignment tags: {% static 'img/x.png' as X %}
    assign_re = re.compile(r"{%\s*static\s+[\"']([^\"']+)[\"']\s+as\s+(\w+)\s*%}")

    def assign_static(match: re.Match[str]) -> str:
        context[match.group(2)] = static_url(match.group(1))
        return ""

    text = assign_re.sub(assign_static, text)

    # Inline static tags: {% static 'img/x.png' %}
    text = re.sub(
        r"{%\s*static\s+[\"']([^\"']+)[\"']\s*%}",
        lambda m: static_url(m.group(1)),
        text,
    )

    # URL tags, including {% url 'demo_detail' d.slug %}.
    url_re = re.compile(r"{%\s*url\s+[\"']([^\"']+)[\"']([^%]*)%}")

    def replace_url(match: re.Match[str]) -> str:
        name = match.group(1)
        arg_text = match.group(2).strip()
        args = [a for a in arg_text.split() if a]
        return resolve_url(name, args, context)

    text = url_re.sub(replace_url, text)

    # Date tag used in base.html.
    text = re.sub(r"{%\s*now\s+[\"']Y[\"']\s*%}", str(_dt.date.today().year), text)

    # Tags that have no output in the static version.
    text = re.sub(r"{%\s*load\s+static\s*%}\s*", "", text)

    # Remaining variables.
    var_re = re.compile(r"{{\s*([^}]+?)\s*}}")

    def replace_var(match: re.Match[str]) -> str:
        value = get_value(match.group(1), context)
        return html.escape(str(value), quote=False)

    text = var_re.sub(replace_var, text)

    return text


def route_to_file(route: str) -> Path:
    if route == "/":
        return OUT / "index.html"
    return OUT / route.strip("/") / "index.html"


def copy_static_assets() -> None:
    if STATIC_SRC.exists():
        shutil.copytree(STATIC_SRC, OUT / "static", dirs_exist_ok=True)

    # Keep the exact static paths used by contatti.html without changing the template.
    alias_dir = OUT / "static" / "media" / "image"
    alias_dir.mkdir(parents=True, exist_ok=True)
    for name in ["alessio.png", "matteo.png"]:
        src = STATIC_SRC / "img" / name
        if src.exists():
            shutil.copy2(src, alias_dir / name)

    # Some older/raw demo pages use local images/ paths. The routed pages are kept
    # unchanged; these lightweight assets prevent broken local references where the
    # original repository did not include the expected files.
    placeholder = TEMPLATES / "demo1" / "images" / "hero-placeholder.svg"
    if placeholder.exists():
        for route, template, _ in PAGES:
            if template in {"charlotte&oliver.html"}:
                target_dir = route_to_file(route).parent / "images"
                target_dir.mkdir(parents=True, exist_ok=True)
                for filename in ["hero-placeholder.svg", "photo-placeholder.svg"]:
                    shutil.copy2(placeholder, target_dir / filename)

    jpeg_placeholders = {
        "emma&james": ["hero.jpg", "couple.jpg", *[f"gallery-{i}.jpg" for i in range(1, 7)]],
        "harry&kate": ["gallery-1.jpg"],
    }
    for folder, names in jpeg_placeholders.items():
        target_dir = OUT / folder / "images"
        target_dir.mkdir(parents=True, exist_ok=True)
        for name in names:
            target = target_dir / name
            if not target.exists():
                target.write_bytes(PLACEHOLDER_JPEG)


def write_support_files() -> None:
    (OUT / ".nojekyll").write_text("", encoding="utf-8")
    # Current production URLs use www.weddingcoding.it. Change this file if you want
    # to publish the apex domain instead, e.g. weddingcoding.it.
    (OUT / "CNAME").write_text("www.weddingcoding.it\n", encoding="utf-8")
    # Simple 404 that links back home, without altering any real page.
    (OUT / "404.html").write_text(
        """<!doctype html>\n<html lang=\"it\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Pagina non trovata</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#FBF9F6;color:#4A4542}.box{text-align:center;padding:32px}a{color:#8f6e5f}</style></head><body><main class=\"box\"><h1>Pagina non trovata</h1><p>La pagina richiesta non è disponibile.</p><p><a href=\"/\">Torna alla home</a></p></main></body></html>\n""",
        encoding="utf-8",
    )


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)

    copy_static_assets()

    exported: List[str] = []
    for route, template, context in PAGES:
        html_text = render_template(template, context)
        out_file = route_to_file(route)
        out_file.parent.mkdir(parents=True, exist_ok=True)
        out_file.write_text(html_text, encoding="utf-8")
        exported.append(f"{route} -> {template}")

    write_support_files()

    notes = [
        "# GitHub Pages static export",
        "",
        "Questa cartella è generata da `python scripts/export_static.py`.",
        "I template originali Django non sono stati modificati: `docs/` è solo l'output statico da pubblicare con GitHub Pages.",
        "",
        "## Pagine esportate",
        "",
    ]
    notes.extend(f"- `{item}`" for item in exported)
    notes.extend(
        [
            "",
            "## Note operative",
            "",
            "- `demo8/` non è stata esportata perché il routing Django la dichiara, ma `templates/demo8.html` non esiste nel progetto.",
            "- `/demo/choco/` è stata esportata come nel comportamento Django attuale: nel routing punta a `demo_romantico.html`.",
            "- `CNAME` è impostato su `www.weddingcoding.it`; modificalo se vuoi usare il dominio apex `weddingcoding.it`.",
            "- Alcune pagine demo contenevano riferimenti a immagini locali non incluse nello ZIP; per evitare icone rotte sono stati aggiunti placeholder nella sola cartella `docs/` senza modificare i template originali.",
        ]
    )
    (ROOT / "GITHUB_PAGES_MIGRATION.md").write_text("\n".join(notes) + "\n", encoding="utf-8")
    print("Export completed:")
    for item in exported:
        print(" -", item)


if __name__ == "__main__":
    main()
