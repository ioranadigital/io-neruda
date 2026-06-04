#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publish Router - io-neruda

Punto de entrada para exportar contenido a múltiples formatos.
Orquesta todos los exportadores.

Uso:
    python publish.py --file post.md --target all
    python publish.py --file post.md --target whatsapp --style teaser
    python publish.py --file post.md --target markdown html json
"""

import argparse
import sys
import io
from pathlib import Path
from typing import List

# Fix encoding for emojis on Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from exporters import (
    MarkdownExporter,
    WhatsAppExporter,
    HTMLExporter,
    JSONExporter,
    SocialExporter,
    EmailExporter,
)
from project_manager import ProjectManager


class PublishRouter:
    """Router principal que orquesta los exportadores"""

    EXPORTERS = {
        'markdown': MarkdownExporter,
        'whatsapp': WhatsAppExporter,
        'html': HTMLExporter,
        'json': JSONExporter,
        'social': SocialExporter,
        'email': EmailExporter,
    }

    def __init__(self, markdown_file: str, output_dir: str = "exports", project_name: str = None):
        """Inicializa el router

        Args:
            markdown_file: Ruta al archivo markdown
            output_dir: Directorio base para outputs
            project_name: Nombre del proyecto (opcional)
        """
        self.project_name = project_name
        self.markdown_file = Path(markdown_file)
        self.output_dir = Path(output_dir)

        # Si hay proyecto, ajustar rutas
        if project_name:
            self.output_dir = self.output_dir / project_name

        if not self.markdown_file.exists():
            print(f"❌ Error: Archivo {markdown_file} no encontrado")
            sys.exit(1)

        print(f"\n📄 Archivo fuente: {self.markdown_file.name}")
        if project_name:
            print(f"📦 Proyecto: {project_name}")
        print(f"📁 Directorio output: {self.output_dir}\n")

    def publish(self, targets: List[str], **options) -> None:
        """
        Publica a los targets especificados

        Args:
            targets: Lista de targets (markdown, whatsapp, html, json, social, email, all)
            **options: Opciones adicionales para cada exporter
        """
        # Si targets contiene 'all', expandir a todos
        if 'all' in targets:
            targets = list(self.EXPORTERS.keys())

        print(f"🚀 Publicando a {len(targets)} formato(s):\n")

        for target in targets:
            if target not in self.EXPORTERS:
                print(f"⚠️  Target desconocido: {target}")
                continue

            self._publish_to_target(target, **options)

        print(f"\n✅ Publicación completada!\n")

    def _publish_to_target(self, target: str, **options) -> None:
        """Publica a un target específico"""
        print(f"\n{'='*60}")
        print(f"📤 Exportando a: {target.upper()}")
        print(f"{'='*60}")

        exporter_class = self.EXPORTERS[target]

        try:
            if target == 'markdown':
                self._export_markdown(exporter_class, **options)
            elif target == 'whatsapp':
                self._export_whatsapp(exporter_class, **options)
            elif target == 'html':
                exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
                exporter.export(include_css=options.get('include_css', True))
            elif target == 'json':
                exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
                exporter.export(include_body=options.get('include_body', True))
            elif target == 'social':
                self._export_social(exporter_class, **options)
            elif target == 'email':
                self._export_email(exporter_class, **options)

        except Exception as e:
            print(f"❌ Error al exportar a {target}: {e}")

    def _export_markdown(self, exporter_class, **options) -> None:
        """Exporta a markdown con múltiples estilos"""
        styles = options.get('markdown_styles', ['clean', 'seo'])

        for style in styles:
            exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
            exporter.export(style=style)
            print(f"   ✅ Generado: {style}")

    def _export_whatsapp(self, exporter_class, **options) -> None:
        """Exporta a WhatsApp con múltiples estilos"""
        styles = options.get('whatsapp_styles', ['teaser', 'series'])
        url = options.get('url', '')

        for style in styles:
            exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
            exporter.export(style=style, url=url)
            print(f"   ✅ Generado: {style}")

    def _export_social(self, exporter_class, **options) -> None:
        """Exporta a redes sociales"""
        platforms = options.get('platforms', ['twitter', 'linkedin'])

        for platform in platforms:
            exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
            exporter.export(platform=platform)
            print(f"   ✅ Generado: {platform}")

    def _export_email(self, exporter_class, **options) -> None:
        """Exporta a email"""
        templates = options.get('templates', ['standard', 'minimal'])

        for template in templates:
            exporter = exporter_class(str(self.markdown_file), str(self.output_dir))
            exporter.export(template=template)
            print(f"   ✅ Generado: {template}")


def main():
    parser = argparse.ArgumentParser(
        description='io-neruda Publish Router - Exporta contenido a múltiples formatos',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EJEMPLOS:

  Exportar a todos los formatos:
    python publish.py --file blog-post.md --target all

  Exportar solo a WhatsApp (todos los estilos):
    python publish.py --file blog-post.md --target whatsapp

  Exportar a WhatsApp estilo teaser solamente:
    python publish.py --file blog-post.md --target whatsapp --whatsapp-style teaser

  Exportar a Markdown + HTML + WhatsApp:
    python publish.py --file blog-post.md --target markdown html whatsapp

  Exportar a email con templates specific:
    python publish.py --file blog-post.md --target email --email-templates standard fancy

  Con URL para CTAs:
    python publish.py --file blog-post.md --target all --url "https://example.com/blog/post"
        """
    )

    parser.add_argument(
        '--project', '-p',
        help='Nombre del proyecto (ej: surfvintage, ricardoherrera)'
    )

    parser.add_argument(
        '--file', '-f',
        required=True,
        help='Archivo markdown a exportar (ruta relativa al proyecto o absoluta)'
    )

    parser.add_argument(
        '--target', '-t',
        nargs='+',
        default=['all'],
        choices=['markdown', 'whatsapp', 'html', 'json', 'social', 'email', 'all'],
        help='Formatos a exportar (default: all)'
    )

    parser.add_argument(
        '--list-projects',
        action='store_true',
        help='Listar todos los proyectos disponibles'
    )

    parser.add_argument(
        '--output', '-o',
        default='exports',
        help='Directorio para outputs (default: exports)'
    )

    parser.add_argument(
        '--url',
        help='URL para incluir en CTAs'
    )

    # Opciones específicas por exporter
    parser.add_argument(
        '--whatsapp-styles',
        nargs='+',
        choices=['teaser', 'series', 'catalog', 'newsletter'],
        default=['teaser', 'series'],
        help='Estilos WhatsApp a generar'
    )

    parser.add_argument(
        '--markdown-styles',
        nargs='+',
        choices=['clean', 'seo', 'email', 'social'],
        default=['clean', 'seo'],
        help='Estilos Markdown a generar'
    )

    parser.add_argument(
        '--social-platforms',
        nargs='+',
        choices=['twitter', 'linkedin'],
        default=['twitter', 'linkedin'],
        help='Plataformas sociales'
    )

    parser.add_argument(
        '--email-templates',
        nargs='+',
        choices=['standard', 'minimal', 'fancy'],
        default=['standard', 'minimal'],
        help='Templates de email a generar'
    )

    args = parser.parse_args()

    # Si pide listar proyectos
    if args.list_projects:
        try:
            pm = ProjectManager()
            pm.list_projects_formatted()
            return
        except Exception as e:
            print(f"❌ Error: {e}")
            sys.exit(1)

    # Validar archivo markdown
    markdown_file = Path(args.file)

    # Si hay proyecto, buscar el archivo dentro del proyecto
    if args.project:
        try:
            pm = ProjectManager()

            if not pm.project_exists(args.project):
                print(f"❌ Error: Proyecto '{args.project}' no encontrado")
                print("Usa --list-projects para ver proyectos disponibles")
                sys.exit(1)

            paths = pm.get_project_paths(args.project)

            # Si el archivo es ruta relativa, buscar en 03-Ready-To-Publish
            if not markdown_file.is_absolute():
                markdown_file = paths['ready'] / args.file

            if not markdown_file.exists():
                print(f"❌ Error: Archivo no encontrado: {markdown_file}")
                sys.exit(1)

        except Exception as e:
            print(f"❌ Error al gestionar proyecto: {e}")
            sys.exit(1)

    else:
        # Sin proyecto, usar ruta absoluta/relativa normal
        if not markdown_file.is_absolute():
            markdown_file = Path.cwd() / markdown_file

        if not markdown_file.exists():
            print(f"❌ Error: Archivo {markdown_file} no encontrado")
            sys.exit(1)

    # Crear router
    router = PublishRouter(str(markdown_file), args.output, args.project)

    # Preparar opciones
    options = {
        'url': args.url or '',
        'markdown_styles': args.markdown_styles,
        'whatsapp_styles': args.whatsapp_styles,
        'platforms': args.social_platforms,
        'templates': args.email_templates,
    }

    # Publicar
    router.publish(args.target, **options)


if __name__ == '__main__':
    main()
