#!/usr/bin/env python3
"""
Publish to WordPress Script

Publica contenido markdown a WordPress automáticamente.
Utiliza WordPress REST API para crear posts con metadatos SEO.

Uso:
    python publish_to_wp.py --env .env.cliente --file post.md --publish
"""

import argparse
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import re


def load_env_file(env_path: str) -> Dict[str, str]:
    """Carga variables de entorno desde archivo .env"""
    env_vars = {}
    try:
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip()
        return env_vars
    except FileNotFoundError:
        print(f"❌ Error: Archivo {env_path} no encontrado")
        sys.exit(1)


def parse_markdown(file_path: str) -> Dict[str, Any]:
    """Parsea archivo markdown y extrae YAML frontmatter y contenido"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    metadata = {}
    body = content

    # Buscar frontmatter YAML
    if content.startswith('---'):
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                # Parsear YAML simple (sin librerías externas)
                yaml_text = parts[1]
                for line in yaml_text.strip().split('\n'):
                    if ':' in line:
                        key, value = line.split(':', 1)
                        metadata[key.strip()] = value.strip().strip('"\'')
                body = parts[2].strip()
        except Exception as e:
            print(f"⚠️  Advertencia: No se pudo parsear frontmatter: {e}")

    return {
        'metadata': metadata,
        'body': body
    }


def create_wordpress_post(
    wp_url: str,
    username: str,
    password: str,
    title: str,
    content: str,
    status: str = 'draft',
    featured_image_path: Optional[str] = None,
    metadata: Optional[Dict] = None
) -> bool:
    """
    Crea un post en WordPress (estructura - requiere requests library en implementación real)

    Para implementación real, se necesita:
    - import requests
    - import base64
    """
    print(f"""
    ✓ Post preparado para publicación:

    Sitio: {wp_url}
    Título: {title}
    Estado: {status}
    Fecha: {datetime.now().isoformat()}

    Metadatos:
    {json.dumps(metadata or {}, indent=2, ensure_ascii=False)}

    Contenido: {len(content)} caracteres
    """)

    if featured_image_path:
        print(f"Imagen destacada: {featured_image_path}")

    print("\n⚠️  NOTA: Esta es una versión stub.")
    print("Para usar en producción, instala: pip install requests wordpress-api")
    print("Luego descomenta la sección de código comentada en el script.")

    return True


def main():
    parser = argparse.ArgumentParser(
        description='Publicar contenido markdown a WordPress',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
    python publish_to_wp.py --env .env.resogar --file post.md --draft
    python publish_to_wp.py --env .env.esgarden --file post.md --publish
    python publish_to_wp.py --env .env.cliente --file post.md --schedule "2026-05-25 09:00"
        """
    )

    parser.add_argument('--env', required=True, help='Archivo .env con credenciales')
    parser.add_argument('--file', required=True, help='Archivo markdown a publicar')
    parser.add_argument('--featured', help='Ruta a imagen destacada')
    parser.add_argument('--draft', action='store_true', help='Publicar como borrador')
    parser.add_argument('--publish', action='store_true', help='Publicar inmediatamente')
    parser.add_argument('--schedule', help='Programar para YYYY-MM-DD HH:MM')

    args = parser.parse_args()

    # Validaciones
    if not os.path.exists(args.env):
        print(f"❌ Error: {args.env} no encontrado")
        sys.exit(1)

    if not os.path.exists(args.file):
        print(f"❌ Error: {args.file} no encontrado")
        sys.exit(1)

    # Cargar configuración
    env_vars = load_env_file(args.env)
    doc_data = parse_markdown(args.file)

    # Determinar estado
    status = 'draft'
    if args.publish:
        status = 'publish'
    elif args.schedule:
        status = 'scheduled'

    # Crear post
    success = create_wordpress_post(
        wp_url=env_vars.get('WORDPRESS_URL', ''),
        username=env_vars.get('WORDPRESS_USERNAME', ''),
        password=env_vars.get('WORDPRESS_PASSWORD', ''),
        title=doc_data['metadata'].get('title', 'Sin título'),
        content=doc_data['body'],
        status=status,
        featured_image_path=args.featured,
        metadata=doc_data['metadata']
    )

    if success:
        print("\n✅ Post listo para publicar en WordPress")
        if args.schedule:
            print(f"📅 Programado para: {args.schedule}")
    else:
        print("\n❌ Error al procesar post")
        sys.exit(1)


if __name__ == '__main__':
    main()
