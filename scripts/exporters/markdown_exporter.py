#!/usr/bin/env python3
"""
Markdown Exporter

Exporta contenido markdown limpio/normalizado con diferentes frontmatters.
"""

from pathlib import Path
from typing import Literal
from .base_exporter import BaseExporter


class MarkdownExporter(BaseExporter):
    """Exporta markdown limpio con frontmatter personalizado"""

    def export(self, style: Literal['clean', 'seo', 'email', 'social'] = 'clean', **options) -> Path:
        """
        Exporta markdown con el frontmatter especificado

        Args:
            style: Estilo de frontmatter (clean, seo, email, social)
        """
        frontmatter_str = self._generate_frontmatter(style)
        content = f"{frontmatter_str}\n\n{self.body}"

        filename = f"{self.get_slug()}.md"
        return self._save_file(filename, content, subdir=f"markdown/{style}")

    def _generate_frontmatter(self, style: str) -> str:
        """Genera frontmatter según el estilo"""
        title = self.get_title()
        slug = self.get_slug()
        summary = self.extract_summary()

        if style == 'clean':
            return self._frontmatter_clean(title, slug)

        elif style == 'seo':
            return self._frontmatter_seo(title, slug, summary)

        elif style == 'email':
            return self._frontmatter_email(title, slug)

        elif style == 'social':
            return self._frontmatter_social(title, slug, summary)

        return f"# {title}"

    def _frontmatter_clean(self, title: str, slug: str) -> str:
        """Frontmatter minimalista"""
        return f"""---
title: {title}
slug: {slug}
---"""

    def _frontmatter_seo(self, title: str, slug: str, summary: str) -> str:
        """Frontmatter con metadatos SEO"""
        meta_description = self.frontmatter.get('meta_description', summary[:160])
        keywords = self.frontmatter.get('keywords', '')

        return f"""---
title: {title}
slug: {slug}
meta_description: {meta_description}
keywords: {keywords}
type: article
---"""

    def _frontmatter_email(self, title: str, slug: str) -> str:
        """Frontmatter para email campaigns"""
        from_name = self.frontmatter.get('author', 'io-neruda')

        return f"""---
subject: {title}
from_name: {from_name}
slug: {slug}
type: email
---"""

    def _frontmatter_social(self, title: str, slug: str, summary: str) -> str:
        """Frontmatter para redes sociales"""
        tags = self.frontmatter.get('tags', '').split(',')
        tags_str = ', '.join([f"#{tag.strip()}" for tag in tags if tag.strip()])

        return f"""---
title: {title}
slug: {slug}
summary: {summary}
tags: {tags_str}
type: social
---"""
