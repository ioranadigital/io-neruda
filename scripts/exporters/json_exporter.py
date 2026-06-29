#!/usr/bin/env python3
"""
JSON Exporter

Exporta contenido a JSON para APIs y sistemas headless.
"""

import json
from datetime import datetime
from pathlib import Path
from .base_exporter import BaseExporter


class JSONExporter(BaseExporter):
    """Exporta contenido a JSON estructurado"""

    def export(self, include_body: bool = True, **options) -> Path:
        """
        Exporta contenido a JSON

        Args:
            include_body: Incluir cuerpo del artículo
        """
        data = self._generate_json_structure(include_body)

        filename = f"{self.get_slug()}.json"
        filepath = self.output_dir / "json" / filename
        filepath.parent.mkdir(parents=True, exist_ok=True)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"✅ Guardado: {filepath}")
        return filepath

    def _generate_json_structure(self, include_body: bool = True) -> dict:
        """Genera estructura JSON completa"""
        title = self.get_title()
        slug = self.get_slug()
        summary = self.extract_summary()

        data = {
            "metadata": {
                "title": title,
                "slug": slug,
                "summary": summary,
                "author": self.frontmatter.get('author', 'io-neruda'),
                "date": self.frontmatter.get('date', datetime.now().isoformat()),
                "updated": datetime.now().isoformat(),
                "type": self.frontmatter.get('type', 'article'),
            },
            "seo": {
                "meta_description": self.frontmatter.get('meta_description', summary[:160]),
                "keywords": self.frontmatter.get('keywords', '').split(','),
                "og_image": self.frontmatter.get('og_image', ''),
            },
            "content": {
                "word_count": len(self.body.split()),
                "char_count": len(self.body),
            }
        }

        if include_body:
            data["content"]["body"] = self.body

        # Agregar campos adicionales del frontmatter
        for key, value in self.frontmatter.items():
            if key not in ['title', 'slug', 'author', 'date', 'type', 'meta_description', 'keywords', 'og_image']:
                if key not in data["metadata"]:
                    data["metadata"][key] = value

        return data
