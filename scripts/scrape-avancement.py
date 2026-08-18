"""Scrape residenceallure.com/avancement — extract content + download media."""

from __future__ import annotations

import json
import re
import urllib.error
import urllib.parse
import urllib.request
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "avancement"
HTML_PATH = OUT / "_page.html"
SOURCE = "https://residenceallure.com/avancement/"

UA = "Mozilla/5.0 (compatible; AllureScraper/1.0)"


def fetch_html() -> str:
    OUT.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(SOURCE, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = resp.read()
    text = data.decode("utf-8", errors="ignore")
    HTML_PATH.write_text(text, encoding="utf-8")
    return text


def is_thumb(url: str) -> bool:
    return bool(re.search(r"-\d{2,4}x\d{2,4}\.(jpe?g|png|webp|gif)$", url, re.I))


def base_key(url: str) -> str:
    return re.sub(
        r"-\d{2,4}x\d{2,4}(?=\.(jpe?g|png|webp|gif)$)",
        "",
        url,
        flags=re.I,
    )


def extract_images(html: str) -> list[str]:
    raw = re.findall(
        r"https://residenceallure\.com/wp-content/uploads/[^\s\"'<>]+",
        html,
    )
    raw = [u.replace("&amp;", "&").split("?")[0] for u in raw]
    ext_ok = re.compile(r"\.(jpe?g|png|webp|gif|mp4|webm|mov)$", re.I)
    raw = [u for u in raw if ext_ok.search(u)]

    by_base: OrderedDict[str, str] = OrderedDict()
    for u in raw:
        k = base_key(u)
        if k not in by_base:
            by_base[k] = u
            continue
        cur = by_base[k]
        if is_thumb(cur) and not is_thumb(u):
            by_base[k] = u
        elif not is_thumb(u) and ("scaled" in u or len(u) >= len(cur)):
            if is_thumb(cur) or "scaled" in u:
                by_base[k] = u

    skip = re.compile(
        r"(logo|icon|favicon|avatar|woocommerce|elementor|slider-pro|auxin|cropped-blue|wietc|references-afrique)",
        re.I,
    )
    return [u for u in by_base.values() if not skip.search(u)]


def extract_youtube(html: str) -> list[dict[str, str]]:
    ids = set(re.findall(r"youtube\.com/watch\?v=([A-Za-z0-9_-]{6,})", html))
    ids |= set(re.findall(r"youtu\.be/([A-Za-z0-9_-]{6,})", html))
    ids |= set(re.findall(r"youtube\.com/embed/([A-Za-z0-9_-]{6,})", html))
    ids |= set(
        re.findall(
            r"youtube_url&quot;:&quot;https:\\/\\/www\.youtube\.com\\/watch\?v=([A-Za-z0-9_-]{6,})",
            html,
        )
    )
    return [
        {"id": vid, "url": f"https://www.youtube.com/watch?v={vid}"}
        for vid in sorted(ids)
    ]


def guess_folder(url: str) -> str:
    name = url.rsplit("/", 1)[-1].lower()
    if "terassement" in name or "sous-sol" in name:
        return "phase-1-2"
    if name.startswith("dji_"):
        return "phase-3"
    if re.search(r"/2025/01/", url):
        return "phase-4"
    if re.search(r"/2025/04/hd_", url, re.I) or "hd_" in name:
        return "phase-6"
    if re.search(r"/2025/04/", url):
        return "phase-5"
    if "whatsapp" in name or re.search(r"/2026/02/", url):
        return "evenements"
    if re.search(r"/2025/01/", url):
        return "phase-4"
    return "autres"


def safe_name(url: str) -> str:
    name = url.rsplit("/", 1)[-1]
    name = re.sub(r"[^\w.\-]+", "-", name)
    return name[:180]


def download(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return True
    # Encode non-ASCII path segments for HTTP
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(parts.path, safe="/")
    safe_url = urllib.parse.urlunsplit(
        (parts.scheme, parts.netloc, path, parts.query, parts.fragment)
    )
    req = urllib.request.Request(safe_url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            dest.write_bytes(resp.read())
        return True
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        print(f"FAIL {url.encode('ascii', 'replace').decode('ascii')} -> {exc}")
        return False


def main() -> None:
    html = HTML_PATH.read_text(encoding="utf-8", errors="ignore") if HTML_PATH.exists() else ""
    if len(html) < 1000:
        print("Fetching HTML…")
        html = fetch_html()
    else:
        print(f"Using cached HTML ({len(html)} bytes)")

    images = extract_images(html)
    youtube = extract_youtube(html)

    content = {
        "source": SOURCE,
        "title": "Avancement - Résidence Allure",
        "phases": [
            {"id": "phase-1", "title": "Phase 1 - Térrassement & Sous-sol"},
            {"id": "phase-2", "title": "Phase 2 - Rez-de-Chaussée"},
            {"id": "phase-3", "title": "Phase 3 - 1er & 2ème étage"},
            {"id": "phase-4", "title": "Phase 4 - 3ème & 4ème étage"},
            {"id": "phase-5", "title": "Phase 5 - 5ème & 7ème étage"},
            {
                "id": "phase-6",
                "title": "Phase 6 - 8ème & 11ème étage",
                "note": "Visite contrôle qualité / sécurité (Chine)",
            },
            {"id": "phase-7", "title": "Phase 7 - ACHEVEMENT DES GROS OEUVRES"},
        ],
        "sections": [
            {
                "id": "ceremonie",
                "title": "Cérémonie d'achèvement des gros œuvres",
                "text": (
                    "Retour en images sur le Cocktail d'Inauguration marquant "
                    "l'Achèvement des Gros Œuvres de l'immeuble Résidence Allure. "
                    "Un moment convivial et symbolique, partagé avec nos partenaires, "
                    "invités et acteurs du projet."
                ),
            },
            {
                "id": "forum-2025",
                "title": "Résidence Allure au Forum Invest in Senegal 2025",
                "text_en": (
                    "Refined living in the heart of Almadies. Ideally located near "
                    "Dakar's coastline, Résidence Allure embodies elegance, comfort "
                    "and long-term value."
                ),
                "text_fr": (
                    "À 500 m du littoral, dans l'un des quartiers les plus prisés de "
                    "Dakar, Résidence Allure offre un cadre de vie haut standing."
                ),
            },
        ],
        "youtube": youtube,
        "images": [],
        "image_count": 0,
        "note": (
            "Les vidéos de la page sont des embeds YouTube "
            "(pas de fichier mp4 hébergé sur le site)."
        ),
    }

    print(f"Found {len(images)} unique images, {len(youtube)} youtube video(s)")

    saved: list[dict[str, str]] = []
    ok = 0
    fail = 0
    for url in images:
        folder = guess_folder(url)
        dest = OUT / "media" / folder / safe_name(url)
        print(f"GET {folder}/{dest.name}".encode("ascii", "replace").decode("ascii"))
        if download(url, dest):
            ok += 1
            saved.append(
                {
                    "url": url,
                    "local": str(dest.relative_to(ROOT / "public")).replace("\\", "/"),
                    "folder": folder,
                }
            )
        else:
            fail += 1

    # Save youtube metadata (cannot download YT without extra tooling)
    yt_path = OUT / "media" / "videos" / "youtube.json"
    yt_path.parent.mkdir(parents=True, exist_ok=True)
    yt_path.write_text(json.dumps(youtube, ensure_ascii=False, indent=2), encoding="utf-8")

    content["images"] = saved
    content["image_count"] = len(saved)
    content["download_stats"] = {"ok": ok, "fail": fail}

    (OUT / "content.json").write_text(
        json.dumps(content, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (OUT / "_download-list.txt").write_text("\n".join(images), encoding="utf-8")

    print(f"DONE ok={ok} fail={fail}")
    print(f"Content -> {OUT / 'content.json'}")
    print(f"Media   -> {OUT / 'media'}")


if __name__ == "__main__":
    main()
