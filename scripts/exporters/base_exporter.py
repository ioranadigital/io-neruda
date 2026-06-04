#!/usr/bin/env python3
"""
Base Exporter Class

Clase base para todos los exportadores de contenido.
Define la interfaz común y funciones compartidas.
"""

import os
import re
from pathlib import Path
from typing import Dict, Any, Optional, Tuple
from abc import ABC, abstractmethod


class BaseExporter(ABC):
    """Clase base para todos los exporters"""

    def __init__(self, markdown_path: str, output_dir: str = "exports"):
        """
        Inicializa el exporter

        Args:
            markdown_path: Ruta al archivo markdown fuente
            output_dir: Directorio base para outputs
        """
        self.markdown_path = Path(markdown_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Parsear el markdown
        self.frontmatter, self.body = self._parse_markdown()

    def _parse_markdown(self) -> Tuple[Dict[str, Any], str]:
        """Parsea markdown y extrae frontmatter YAML + cuerpo"""
        with open(self.markdown_path, 'r', encoding='utf-8') as f:
            content = f.read()

        frontmatter = {}
        body = content

        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    yaml_text = parts[1]
                    for line in yaml_text.strip().split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            frontmatter[key.strip()] = value.strip().strip('\'"')
                    body = parts[2].strip()
            except Exception as e:
                print(f"⚠️  Advertencia al parsear frontmatter: {e}")

        return frontmatter, body

    def get_title(self) -> str:
        """Obtiene el título del contenido"""
        # Buscar título en frontmatter o primer heading
        if 'title' in self.frontmatter:
            return self.frontmatter['title']

        # Buscar primer # heading
        match = re.search(r'^#\s+(.+)$', self.body, re.MULTILINE)
        if match:
            return match.group(1)

        return self.markdown_path.stem

    def get_slug(self) -> str:
        """Genera slug del título"""
        title = self.get_title()
        slug = re.sub(r'[^\w\s-]', '', title.lower())
        return re.sub(r'[-\s]+', '-', slug)

    def extract_summary(self, max_words: int = 50) -> str:
        """Extrae resumen del contenido"""
        # Quitar markdown syntax
        text = re.sub(r'[#*`\[\]]', '', self.body)
        words = text.split()[:max_words]
        return ' '.join(words).strip()

    def _save_file(self, filename: str, content: str, subdir: str = "") -> Path:
        """Guarda contenido en archivo"""
        if subdir:
            target_dir = self.output_dir / subdir
        else:
            target_dir = self.output_dir

        target_dir.mkdir(parents=True, exist_ok=True)
        filepath = target_dir / filename

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✅ Guardado: {filepath}")
        return filepath

    @abstractmethod
    def export(self, **options) -> Path:
        """Método abstracto que cada exporter debe implementar"""
        pass
