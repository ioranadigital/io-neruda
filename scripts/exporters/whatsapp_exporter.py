#!/usr/bin/env python3
"""
WhatsApp Exporter

Genera textos optimizados para campañas WhatsApp.
Estilos: teaser, series, catalog, newsletter
"""

import re
from pathlib import Path
from typing import Literal, List
from .base_exporter import BaseExporter


class WhatsAppExporter(BaseExporter):
    """Exporta contenido optimizado para WhatsApp"""

    EMOJI_MAP = {
        'vintage': '🏄‍♂️',
        'fashion': '👗',
        'product': '🛍️',
        'link': '👉',
        'check': '✅',
        'arrow': '→',
        'heart': '💚',
        'fire': '🔥',
        'info': 'ℹ️',
        'price': '💰',
    }

    def export(self, style: Literal['teaser', 'series', 'catalog', 'newsletter'] = 'teaser',
               url: str = "", **options) -> Path:
        """
        Exporta contenido para WhatsApp

        Args:
            style: Estilo de contenido (teaser, series, catalog, newsletter)
            url: URL a incluir en CTA
        """
        self.url = url

        if style == 'teaser':
            return self._export_teaser()
        elif style == 'series':
            return self._export_series()
        elif style == 'catalog':
            return self._export_catalog()
        elif style == 'newsletter':
            return self._export_newsletter()

    def _export_teaser(self) -> Path:
        """Exporta hook corto + CTA (1 mensaje)"""
        title = self.get_title()
        summary = self.extract_summary(max_words=20)

        # Determinar emoji basado en contenido
        emoji = self._get_emoji_for_title(title)

        content = f"""{emoji} {title}

{summary} {self.EMOJI_MAP['fire']}

"""
        if self.url:
            content += f"{self.EMOJI_MAP['link']} Lee la guía completa:\n{self.url}\n"

        content += f"\n{self.EMOJI_MAP['heart']} ¿Preguntas? Escribe a nuestro equipo"

        filename = f"{self.get_slug()}_teaser.txt"
        return self._save_file(filename, content, subdir="whatsapp/teaser")

    def _export_series(self) -> Path:
        """Exporta serie de 3-5 mensajes"""
        title = self.get_title()
        emoji = self._get_emoji_for_title(title)

        # Dividir contenido por párrafos
        paragraphs = [p.strip() for p in self.body.split('\n\n') if p.strip()]

        messages = []

        # Mensaje 1: Hook
        msg1 = f"""{emoji} ¿Sabías que {title.lower()}?

Descubre los detalles en nuestro blog {self.EMOJI_MAP['fire']}"""
        messages.append(msg1)

        # Mensajes intermedios: puntos clave
        if len(paragraphs) > 1:
            msg2_points = paragraphs[1:min(4, len(paragraphs))]
            msg2 = f"""{self.EMOJI_MAP['check']} Puntos clave:

"""
            for point in msg2_points:
                # Tomar primera línea si es párrafo largo
                first_line = point.split('\n')[0][:50]
                msg2 += f"{self.EMOJI_MAP['check']} {first_line}\n"

            messages.append(msg2.strip())

        # Mensaje final: CTA + newsletter
        msg_final = f"""{self.EMOJI_MAP['heart']} Guía completa aquí:"""
        if self.url:
            msg_final += f"\n{self.url}"
        msg_final += f"\n\n¿Más contenido así? Únete a nuestra newsletter {self.EMOJI_MAP['arrow']}"

        messages.append(msg_final)

        # Guardar serie
        content = "\n\n".join([f"[MSG {i+1}]\n{msg}" for i, msg in enumerate(messages)])

        filename = f"{self.get_slug()}_series.txt"
        return self._save_file(filename, content, subdir="whatsapp/series")

    def _export_catalog(self) -> Path:
        """Exporta formato catálogo de productos"""
        title = self.get_title()
        emoji = self._get_emoji_for_title(title)

        # Buscar items con precio (formato: *Item Name* €XX)
        price_pattern = r'\*([^*]+)\*\s*€(\d+)'
        matches = re.findall(price_pattern, self.body)

        content = f"""{emoji} {title.upper()}

"""

        if matches:
            for product, price in matches:
                content += f"""*{product.strip()}*
€{price} | Disponible en nuestro catálogo
{self.EMOJI_MAP['link']} Ver más en nuestro sitio

"""
        else:
            # Si no hay precios, usar primeros párrafos
            summary = self.extract_summary(max_words=30)
            content += f"""{summary}

{self.EMOJI_MAP['link']} Explora nuestro catálogo completo:"""
            if self.url:
                content += f"\n{self.url}"

        content += f"\n\n{self.EMOJI_MAP['heart']} ¿Dudas? Contacta a nuestro equipo"

        filename = f"{self.get_slug()}_catalog.txt"
        return self._save_file(filename, content, subdir="whatsapp/catalog")

    def _export_newsletter(self) -> Path:
        """Exporta resumen estilo newsletter"""
        title = self.get_title()
        emoji = self._get_emoji_for_title(title)
        summary = self.extract_summary(max_words=25)

        content = f"""{emoji} NEWSLETTER: {title}

{summary}

{self.EMOJI_MAP['check']} Lo que aprenderás:
{self.EMOJI_MAP['check']} Tendencias actuales
{self.EMOJI_MAP['check']} Consejos prácticos
{self.EMOJI_MAP['check']} Recomendaciones exclusivas

"""

        if self.url:
            content += f"{self.EMOJI_MAP['link']} Leer artículo completo:\n{self.url}\n"

        content += f"""
{self.EMOJI_MAP['heart']} Nuevo contenido cada semana
{self.EMOJI_MAP['fire']} No te pierdas los próximos

"""

        filename = f"{self.get_slug()}_newsletter.txt"
        return self._save_file(filename, content, subdir="whatsapp/newsletter")

    def _get_emoji_for_title(self, title: str) -> str:
        """Selecciona emoji basado en palabras clave del título"""
        title_lower = title.lower()

        if any(word in title_lower for word in ['vintage', 'surf', 'moda', 'estilo']):
            return self.EMOJI_MAP['vintage']
        elif any(word in title_lower for word in ['producto', 'tienda', 'compra']):
            return self.EMOJI_MAP['product']
        elif any(word in title_lower for word in ['guía', 'cómo']):
            return '📚'
        elif any(word in title_lower for word in ['precio', 'costo', 'valor']):
            return self.EMOJI_MAP['price']

        return '📝'
