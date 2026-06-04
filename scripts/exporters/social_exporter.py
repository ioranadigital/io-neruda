#!/usr/bin/env python3
"""
Social Media Exporter

Exporta contenido para Twitter, LinkedIn, etc.
"""

import re
from pathlib import Path
from .base_exporter import BaseExporter


class SocialExporter(BaseExporter):
    """Exporta contenido para redes sociales"""

    def export(self, platform: str = 'twitter', **options) -> Path:
        """
        Exporta contenido para redes sociales

        Args:
            platform: Plataforma (twitter, linkedin)
        """
        if platform == 'twitter':
            return self._export_twitter_thread()
        elif platform == 'linkedin':
            return self._export_linkedin_post()

    def _export_twitter_thread(self) -> Path:
        """Genera thread de Twitter"""
        title = self.get_title()
        paragraphs = [p.strip() for p in self.body.split('\n\n') if p.strip()]

        tweets = []

        # Tweet 1: Hook
        tweet1 = f"🧵 {title}\n\nVamos a explorar esto {len(paragraphs)} puntos importantes 👇"
        tweets.append(tweet1)

        # Tweets intermedios
        for i, para in enumerate(paragraphs[:5], 1):
            # Limpiar markdown
            text = re.sub(r'[#*`\[\]]', '', para)
            # Limitar a 280 caracteres
            if len(text) > 280:
                text = text[:277] + "..."
            tweets.append(f"{i}. {text}")

        # Tweet final
        tweet_final = "Gracias por leer este thread 🙌"
        hashtags = self.frontmatter.get('tags', '').split(',')
        if hashtags:
            hashtag_str = ' '.join([f"#{tag.strip().replace(' ', '')}" for tag in hashtags if tag.strip()])
            tweet_final += f"\n\n{hashtag_str}"

        tweets.append(tweet_final)

        content = "\n\n---\n\n".join(tweets)

        filename = f"{self.get_slug()}_twitter_thread.txt"
        return self._save_file(filename, content, subdir="social/twitter")

    def _export_linkedin_post(self) -> Path:
        """Genera post de LinkedIn"""
        title = self.get_title()
        summary = self.extract_summary(max_words=100)
        paragraphs = [p.strip() for p in self.body.split('\n\n') if p.strip()]

        # Post LinkedIn más largo que Twitter
        post = f"""{title}

{summary}

"""

        # Puntos clave
        post += "Puntos clave:\n"
        for i, para in enumerate(paragraphs[:5], 1):
            text = re.sub(r'[#*`\[\]]', '', para)
            first_line = text.split('\n')[0][:80]
            post += f"• {first_line}\n"

        post += f"""
Este enfoque no solo es efectivo, sino que también genera resultados medibles.

¿Cuál es tu experiencia al respecto?

"""

        # Hashtags
        hashtags = self.frontmatter.get('tags', '').split(',')
        if hashtags:
            hashtag_str = ' '.join([f"#{tag.strip().replace(' ', '')}" for tag in hashtags if tag.strip()])
            post += hashtag_str

        filename = f"{self.get_slug()}_linkedin_post.txt"
        return self._save_file(filename, post, subdir="social/linkedin")
