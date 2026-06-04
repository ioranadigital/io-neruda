#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Publish to WordPress via XML-RPC - io-neruda Publishing Module
Alternativa al REST API para evitar problemas con nonces
"""

import sys
import io
import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional
from dotenv import load_dotenv
import xmlrpc.client

# Fix para Windows Unicode
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

class WordPressXMLRPCPublisher:
    def __init__(self, env_file: str = ".env.surfvintage"):
        """Inicializa publisher con credenciales de .env"""
        load_dotenv(env_file)

        self.wp_url = os.getenv('WORDPRESS_URL', 'http://localhost:8081')
        self.wp_user = os.getenv('WORDPRESS_USERNAME', 'admin')
        self.wp_password = os.getenv('WORDPRESS_PASSWORD', '')
        self.status = os.getenv('PUBLISH_STATUS', 'draft')

        # XML-RPC endpoint
        self.xmlrpc_url = f"{self.wp_url}/xmlrpc.php"
        self.server = xmlrpc.client.ServerProxy(self.xmlrpc_url)

        # Test conexión
        self._test_connection()

    def _test_connection(self):
        """Verifica conexión a WordPress"""
        try:
            # WordPress.getOptions es un método seguro para verificar conectividad
            result = self.server.wp.getOptions(['blog_title'], self.wp_user, self.wp_password)
            if result:
                print(f"✅ Conexión a WordPress vía XML-RPC establecida: {self.wp_url}")
            else:
                print(f"⚠️  Respuesta inusual")
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

        # Convertir markdown simple a HTML para XML-RPC
        html_content = self._markdown_to_html(body)

        return {
            "title": title,
            "content": html_content,
            "meta_description": meta_description or title[:160]
        }

    def _markdown_to_html(self, markdown: str) -> str:
        """Convierte markdown básico a HTML"""
        html = markdown

        # Convertir headers
        html = re.sub(r'^### (.*?)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
        html = re.sub(r'^## (.*?)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)

        # Convertir bold
        html = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', html)

        # Convertir listas
        html = re.sub(r'^- (.*?)$', r'<li>\1</li>', html, flags=re.MULTILINE)

        # Convertir links
        html = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2">\1</a>', html)

        # Convertir saltos de línea en párrafos
        paragraphs = []
        for para in html.split('\n\n'):
            para = para.strip()
            if para and not para.startswith('<'):
                para = f'<p>{para}</p>'
            paragraphs.append(para)

        html = '\n'.join(paragraphs)

        return html

    def publish_post(self, file_path: str, publish: bool = False) -> bool:
        """Publica un post a WordPress via XML-RPC"""
        try:
            # Parsear markdown
            post_data = self.parse_markdown(file_path)

            # Preparar datos del post
            post = {
                'title': post_data["title"],
                'description': post_data["content"],
                'post_type': 'post',
                'post_status': 'publish' if publish else 'draft',
                'mt_excerpt': post_data["meta_description"],
                'comment_status': 'open',
                'ping_status': 'open'
            }

            print(f"\n📝 Publicando: {post_data['title']}")
            print(f"   Status: {post['post_status']}")
            print(f"   URL origen: {file_path}")

            # Publicar via XML-RPC
            post_id = self.server.metaWeblog.newPost(
                '1',  # blog_id (siempre 1 en WordPress)
                self.wp_user,
                self.wp_password,
                post,
                publish
            )

            if post_id:
                post_link = f"{self.wp_url}/?p={post_id}"
                if not publish:
                    post_link = f"{self.wp_url}/wp-admin/post.php?post={post_id}&action=edit"

                print(f"\n✅ Publicado exitosamente!")
                print(f"   ID: {post_id}")
                print(f"   URL: {post_link}")

                return True
            else:
                print(f"❌ Error: No se obtuvo ID de post")
                return False

        except Exception as e:
            print(f"❌ Error publicando: {e}")
            return False

    def get_recent_posts(self, limit: int = 10) -> list:
        """Lista posts publicados recientemente"""
        try:
            posts = self.server.metaWeblog.getRecentPosts(
                '1',  # blog_id
                self.wp_user,
                self.wp_password,
                limit
            )
            return posts
        except Exception as e:
            print(f"Error obteniendo posts: {e}")
            return []

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Publica contenido markdown a WordPress vía XML-RPC"
    )

    parser.add_argument(
        '--file', '-f',
        required=False,
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
    publisher = WordPressXMLRPCPublisher(args.env)

    if args.list_posts:
        print("\n📋 Últimos posts en WordPress:\n")
        posts = publisher.get_recent_posts(limit=5)
        for post in posts:
            status_emoji = "✅" if post.get('post_status') == 'publish' else "📝"
            print(f"{status_emoji} [{post['postid']}] {post['title']}")
            print(f"   Status: {post.get('post_status', 'unknown')}")
            print(f"   Fecha: {post.get('dateCreated', 'N/A')}")
            print()
    elif args.file:
        # Verificar que el archivo existe
        if not os.path.exists(args.file):
            print(f"❌ Archivo no encontrado: {args.file}")
            sys.exit(1)

        # Publicar
        success = publisher.publish_post(args.file, publish=args.publish)
        sys.exit(0 if success else 1)
    else:
        parser.print_help()
        sys.exit(0)

if __name__ == "__main__":
    main()
