#!/usr/bin/env python3
"""
HTML Exporter

Exporta contenido markdown a HTML estático limpio.
"""

import re
from pathlib import Path
from .base_exporter import BaseExporter


class HTMLExporter(BaseExporter):
    """Exporta markdown a HTML estático"""

    def export(self, include_css: bool = True, **options) -> Path:
        """
        Exporta contenido a HTML

        Args:
            include_css: Incluir CSS inline
        """
        html_content = self._markdown_to_html(self.body)
        full_html = self._wrap_html(html_content, include_css)

        filename = f"{self.get_slug()}.html"
        return self._save_file(filename, full_html, subdir="html")

    def _markdown_to_html(self, markdown: str) -> str:
        """Convierte markdown a HTML simple (sin librerías externas)"""
        html = markdown

        # Headings
        html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
        html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)

        # Bold
        html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)

        # Italic
        html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

        # Links
        html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)

        # Code
        html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)

        # Paragraphs
        paragraphs = [p.strip() for p in html.split('\n\n') if p.strip()]
        html = ''.join([
            p if any(p.startswith(tag) for tag in ['<h', '<ul', '<ol', '<li', '<blockquote'])
            else f'<p>{p}</p>'
            for p in paragraphs
        ])

        return html

    def _wrap_html(self, content: str, include_css: bool = True) -> str:
        """Envuelve contenido en HTML structure"""
        title = self.get_title()
        author = self.frontmatter.get('author', 'io-neruda')
        date = self.frontmatter.get('date', '')

        css = self._get_css() if include_css else ''

        meta_description = self.frontmatter.get('meta_description', self.extract_summary())

        return f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{meta_description}">
    <title>{title}</title>
    <style>
{css}
    </style>
</head>
<body>
    <article class="post">
        <header class="post-header">
            <h1>{title}</h1>
            <div class="post-meta">
                <span class="author">Por {author}</span>
                {f'<span class="date">{date}</span>' if date else ''}
            </div>
        </header>
        <div class="post-content">
{content}
        </div>
    </article>
</body>
</html>"""

    def _get_css(self) -> str:
        """CSS base para el artículo"""
        return """        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }

        article {
            max-width: 700px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .post-header {
            margin-bottom: 40px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }

        h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: #1a1a1a;
        }

        h2 {
            font-size: 2rem;
            margin: 30px 0 15px 0;
            color: #2a2a2a;
        }

        h3 {
            font-size: 1.5rem;
            margin: 25px 0 10px 0;
            color: #3a3a3a;
        }

        .post-meta {
            display: flex;
            gap: 20px;
            font-size: 0.9rem;
            color: #666;
        }

        .post-content p {
            margin-bottom: 15px;
            text-align: justify;
        }

        .post-content strong {
            font-weight: 600;
            color: #1a1a1a;
        }

        .post-content em {
            font-style: italic;
            color: #555;
        }

        .post-content a {
            color: #0066cc;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s;
        }

        .post-content a:hover {
            border-bottom-color: #0066cc;
        }

        .post-content code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }"""
