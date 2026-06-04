#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publish to WordPress - io-neruda Publishing Module
Publica contenido desde archivos markdown a WordPress
"""

import sys
import io
import os
import json
import requests
import argparse
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional
from dotenv import load_dotenv

# Fix para Windows Unicode
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class WordPressPublisher:
    def __init__(self, env_file: str = ".env.surfvintage"):
        """Inicializa publisher con credenciales de .env"""
        load_dotenv(env_file)

        self.wp_url = os.getenv('WORDPRESS_URL', 'http://localhost:8081')
        self.wp_user = os.getenv('WORDPRESS_USERNAME', 'admin')
        self.wp_password = os.getenv('WORDPRESS_PASSWORD', '')
        self.status = os.getenv('PUBLISH_STATUS', 'draft')

        self.api_url = f"{self.wp_url}/index.php?rest_route=/wp/v2"
        self.session = requests.Session()
        self.session.auth = (self.wp_user, self.wp_password)

        # Test conexión
        self._test_connection()

    def _test_connection(self):
        """Verifica conexión a WordPress"""
        try:
            response = self.session.get(f"{self.wp_url}/index.php?rest_route=/wp/v2/posts", params={"per_page": 1})
            if response.status_code == 200:
                print(f"✅ Conexión a WordPress establecida: {self.wp_url}")
            else:
                print(f"⚠️  Respuesta: {response.status_code}")
        except Exception as e:
            print(f"❌ Error conectando a WordPress: {e}")
            sys.exit(1)

    def parse_markdown(self, file_path: str) -> Dict:
        """Parsea archivo markdown y extrae metadata"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extraer título (primer H1)
        lines = content.split('\n')
        title = ""
        body_start = 0

        for i, line in enumerate(lines):
            if line.startswith('# '):
                title = line.replace('# ', '').strip()
                body_start = i + 1
                break

        body = '\n'.join(lines[body_start:]).strip()

        # Extraer meta description (si existe)
        meta_description = ""
        if '**Meta Description:**' in body:
            start = body.find('**Meta Description:**') + len('**Meta Description:**')
            end = body.find('\n', start)
            meta_description = body[start:end].strip()

        return {
            "title": title,
            "content": body,
            "meta_description": meta_description or title[:160]
        }

    def publish_post(self, file_path: str, publish: bool = False) -> bool:
        """Publica un post a WordPress"""
        try:
            # Parsear markdown
            post_data = self.parse_markdown(file_path)

            # Preparar payload
            payload = {
                "title": post_data["title"],
                "content": post_data["content"],
                "status": "publish" if publish else "draft",
                "excerpt": post_data["meta_description"],
                "comment_status": "open",
                "ping_status": "open"
            }

            print(f"\n📝 Publicando: {post_data['title']}")
            print(f"   Status: {payload['status']}")
            print(f"   URL origen: {file_path}")

            # Enviar a WordPress
            response = self.session.post(
                f"{self.wp_url}/index.php?rest_route=/wp/v2/posts",
                json=payload,
                headers={"Content-Type": "application/json"}
            )

            if response.status_code in [200, 201]:
                post_id = response.json()['id']
                edit_url = response.json()['link']

                print(f"\n✅ Publicado exitosamente!")
                print(f"   ID: {post_id}")
                print(f"   URL: {edit_url}")

                return True
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"   Respuesta: {response.text}")
                return False

        except Exception as e:
            print(f"❌ Error publicando: {e}")
            return False

    def get_posts(self, limit: int = 10) -> list:
        """Lista posts publicados"""
        try:
            response = self.session.get(
                f"{self.wp_url}/index.php?rest_route=/wp/v2/posts",
                params={"per_page": limit, "orderby": "date", "order": "desc"}
            )

            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error obteniendo posts: {response.status_code}")
                return []
        except Exception as e:
            print(f"Error: {e}")
            return []

def main():
    parser = argparse.ArgumentParser(
        description="Publica contenido markdown a WordPress"
    )

    parser.add_argument(
        '--file', '-f',
        required=True,
        help='Archivo markdown a publicar'
    )

    parser.add_argument(
        '--env', '-e',
        default='.env.surfvintage',
        help='Archivo .env con credenciales (default: .env.surfvintage)'
    )

    parser.add_argument(
        '--publish', '-p',
        action='store_true',
        help='Publicar inmediatamente (sin esto, guarda como borrador)'
    )

    parser.add_argument(
        '--list-posts',
        action='store_true',
        help='Listar últimos posts publicados'
    )

    args = parser.parse_args()

    # Inicializar publisher
    publisher = WordPressPublisher(args.env)

    if args.list_posts:
        print("\n📋 Últimos posts en WordPress:\n")
        posts = publisher.get_posts(limit=5)
        for post in posts:
            status_emoji = "✅" if post['status'] == 'publish' else "📝"
            print(f"{status_emoji} [{post['id']}] {post['title']['rendered']}")
            print(f"   Status: {post['status']}")
            print(f"   Fecha: {post['date']}")
            print()
    else:
        # Verificar que el archivo existe
        if not os.path.exists(args.file):
            print(f"❌ Archivo no encontrado: {args.file}")
            sys.exit(1)

        # Publicar
        success = publisher.publish_post(args.file, publish=args.publish)
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
