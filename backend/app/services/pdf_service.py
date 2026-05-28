from pathlib import Path


def generate_pdf_from_html(html: str, output_path: str) -> str:
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    try:
        from weasyprint import HTML
    except Exception as exc:  # pragma: no cover
        raise RuntimeError(
            "WeasyPrint belum bisa dipakai di environment ini. "
            "Install dependency sistem yang dibutuhkan atau gunakan backend PDF fallback."
        ) from exc
    HTML(string=html).write_pdf(str(output))
    return str(output)
