#!/usr/bin/env python3
"""
Email Exporter

Exporta contenido a HTML optimizado para email.
"""

from pathlib import Path
from .base_exporter import BaseExporter


class EmailExporter(BaseExporter):
    """Exporta contenido para email campaigns"""

    def export(self, template: str = 'standard', **options) -> Path:
        """
        Exporta contenido para email

        Args:
            template: Plantilla de email (standard, minimal, fancy)
        """
        if template == 'standard':
            html = self._generate_standard_template()
        elif template == 'minimal':
            html = self._generate_minimal_template()
        elif template == 'fancy':
            html = self._generate_fancy_template()
        else:
            html = self._generate_standard_template()

        filename = f"{self.get_slug()}_email.html"
        return self._save_file(filename, html, subdir="email")

    def _generate_standard_template(self) -> str:
        """Plantilla estándar para email"""
        title = self.get_title()
        summary = self.extract_summary(max_words=50)
        author = self.frontmatter.get('author', 'io-neruda')

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f5f5f5">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
                       style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px; border-bottom: 2px solid #eee;">
                            <h1 style="margin: 0; font-size: 2rem; color: #1a1a1a;">
                                {title}
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #666; font-size: 0.9rem;">
                                Por <strong>{author}</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin-bottom: 20px; color: #555;">
                                {summary}
                            </p>

                            {self._markdown_to_email_html(self.body)}
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="{self.frontmatter.get('url', '#')}"
                                           style="background: #0066cc; color: white; padding: 12px 30px;
                                                   text-decoration: none; border-radius: 4px; display: inline-block;
                                                   font-weight: bold;">
                                            Leer artículo completo →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; background: #f9f9f9; border-top: 1px solid #eee;
                                   border-radius: 0 0 8px 8px; font-size: 0.85rem; color: #666; text-align: center;">
                            <p style="margin: 0;">
                                © 2026 io-neruda. Todos los derechos reservados.
                            </p>
                            <p style="margin: 5px 0 0 0;">
                                <a href="#" style="color: #0066cc; text-decoration: none;">Preferencias</a> |
                                <a href="#" style="color: #0066cc; text-decoration: none;">Desuscribirse</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    def _generate_minimal_template(self) -> str:
        """Plantilla minimalista"""
        title = self.get_title()
        author = self.frontmatter.get('author', 'io-neruda')

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{title}</title>
</head>
<body style="font-family: Arial; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>{title}</h2>
    <p style="color: #666; font-size: 0.9rem;">Por {author}</p>

    {self._markdown_to_email_html(self.body)}

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 0.85rem; color: #999;">
        io-neruda | Newsletter Automática
    </p>
</body>
</html>"""

    def _generate_fancy_template(self) -> str:
        """Plantilla con más diseño"""
        title = self.get_title()
        author = self.frontmatter.get('author', 'io-neruda')
        summary = self.extract_summary(max_words=40)

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f0f0f0;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 30px;">
                <table width="650" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
                       style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">

                    <!-- Hero Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 50px 40px;
                                   color: white; text-align: center;">
                            <h1 style="margin: 0; font-size: 2.2rem; font-weight: bold;">
                                {title}
                            </h1>
                            <p style="margin: 15px 0 0 0; font-size: 1.1rem; opacity: 0.9;">
                                {summary}
                            </p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            {self._markdown_to_email_html(self.body)}
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <a href="{self.frontmatter.get('url', '#')}"
                               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                      color: white; padding: 15px 40px; text-decoration: none;
                                      border-radius: 6px; display: inline-block; font-weight: bold;
                                      font-size: 1rem;">
                                Descubre más →
                            </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background: #f8f8f8; border-top: 1px solid #eee;
                                   text-align: center; font-size: 0.85rem; color: #666;">
                            <p style="margin: 0 0 8px 0;">
                                <strong>{author}</strong> | io-neruda Newsletter
                            </p>
                            <p style="margin: 0;">
                                <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px;">
                                    Preferencias
                                </a> |
                                <a href="#" style="color: #667eea; text-decoration: none; margin: 0 10px;">
                                    Desuscribirse
                                </a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""

    def _markdown_to_email_html(self, markdown: str) -> str:
        """Convierte markdown a HTML para email"""
        import re

        html = markdown
        html = re.sub(r'## (.+)', r'<h2 style="font-size: 1.5rem; margin: 20px 0 10px 0; color: #1a1a1a;">\1</h2>', html)
        html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
        html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)

        paragraphs = [p.strip() for p in html.split('\n\n') if p.strip()]
        html = ''.join([
            p if any(p.startswith(tag) for tag in ['<h', '<blockquote'])
            else f'<p style="margin-bottom: 15px;">{p}</p>'
            for p in paragraphs
        ])

        return html
