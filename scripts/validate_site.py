#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
REQUIRED_PAGES = {
    "index.html", "viagem.html", "onibus.html", "rodoviaria.html", "rota.html",
    "paradas.html", "parada-detalhes.html", "estabelecimentos.html",
    "estabelecimento-detalhes.html", "compartilhar.html",
    "acompanhamento.html", "emergencia.html", "clima.html", "roteiros.html",
}


class PageAudit(HTMLParser):
    def __init__(self, page: Path):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.ids = []
        self.references = []
        self.errors = []
        self.has_title = False
        self.has_viewport = False
        self.has_description = False
        self.inline_script = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag == "title":
            self.has_title = True
        if tag == "meta" and values.get("name") == "viewport":
            self.has_viewport = True
        if tag == "meta" and values.get("name") == "description":
            self.has_description = True
        if tag == "script" and not values.get("src"):
            self.inline_script = True
        if tag == "img" and not values.get("alt"):
            self.errors.append("imagem sem texto alternativo")
        for attribute in ("href", "src"):
            if values.get(attribute):
                self.references.append(values[attribute])

    def finish(self):
        for required, present in (
            ("title", self.has_title),
            ("meta viewport", self.has_viewport),
            ("meta description", self.has_description),
        ):
            if not present:
                self.errors.append(f"ausente: {required}")
        if self.inline_script:
            self.errors.append("JavaScript inline encontrado")
        duplicates = sorted({item for item in self.ids if self.ids.count(item) > 1})
        if duplicates:
            self.errors.append("IDs duplicados: " + ", ".join(duplicates))
        for reference in self.references:
            parsed = urlsplit(reference)
            if parsed.scheme or reference.startswith(("#", "mailto:", "tel:")):
                continue
            local_path = (self.page.parent / parsed.path).resolve()
            if parsed.path and not local_path.exists():
                self.errors.append(f"referência ausente: {reference}")


def main():
    failures = []
    available_pages = {path.name for path in ROOT.glob("*.html")}
    missing_pages = REQUIRED_PAGES - available_pages
    if missing_pages:
        failures.append("páginas ausentes: " + ", ".join(sorted(missing_pages)))

    for page in sorted(ROOT.glob("*.html")):
        audit = PageAudit(page)
        audit.feed(page.read_text(encoding="utf-8"))
        audit.finish()
        failures.extend(f"{page.name}: {error}" for error in audit.errors)

    if failures:
        print("VALIDATION FAILED")
        for failure in failures:
            print("-", failure)
        raise SystemExit(1)

    print(f"VALIDATION OK: {len(available_pages)} HTML pages and all local references passed.")


if __name__ == "__main__":
    main()
