#!/usr/bin/env python3
"""
Tone Selector Script

Herramienta para seleccionar el tono apropiado basado en cliente y contexto.
Utiliza la matriz de tonos definida en config/tone_matrix.json

Uso:
    python tone_selector.py --client resogar.es --insight tema
"""

import json
import argparse
import sys
from pathlib import Path


def load_tone_matrix(tone_matrix_path: str) -> dict:
    """Carga la matriz de tonos desde JSON"""
    try:
        with open(tone_matrix_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: {tone_matrix_path} no encontrado")
        sys.exit(1)


def get_client_tones(matrix: dict, client: str) -> tuple:
    """Obtiene tonos recomendados para un cliente"""
    client_defaults = matrix.get('client_defaults', {})
    if client in client_defaults:
        defaults = client_defaults[client]
        return defaults['primary'], defaults['secondary']
    return None, None


def list_all_tones(matrix: dict) -> None:
    """Lista todos los tonos disponibles"""
    print("\n📋 TONOS DISPONIBLES EN io-neruda\n")

    tones_data = matrix.get('tones', {})

    for category, subcategories in tones_data.items():
        print(f"\n{'='*60}")
        print(f"🎯 CATEGORÍA: {category.upper().replace('-', ' ')}")
        print(f"{'='*60}")

        for tone_key, tone_info in subcategories.items():
            name = tone_info.get('name', tone_key)
            desc = tone_info.get('description', '')
            examples = tone_info.get('examples', [])
            recommended = tone_info.get('recommended_clients', [])

            print(f"\n  📝 {name}")
            print(f"     {desc}")

            if examples:
                print(f"     Ejemplo: {examples[0]}")

            if recommended:
                print(f"     Recomendado para: {', '.join(recommended)}")


def recommend_tone(matrix: dict, client: str, context: str = "") -> dict:
    """Recomienda un tono basado en cliente y contexto"""
    primary, secondary = get_client_tones(matrix, client)

    if not primary:
        print(f"❌ Cliente '{client}' no encontrado en configuración")
        return {}

    tones_data = matrix.get('tones', {})

    # Buscar tono primario
    primary_tone = None
    for category, subcategories in tones_data.items():
        if primary in subcategories:
            primary_tone = {
                'key': primary,
                'category': category,
                'data': subcategories[primary]
            }
            break

    # Buscar tono secundario
    secondary_tone = None
    for category, subcategories in tones_data.items():
        if secondary in subcategories:
            secondary_tone = {
                'key': secondary,
                'category': category,
                'data': subcategories[secondary]
            }
            break

    return {
        'client': client,
        'primary': primary_tone,
        'secondary': secondary_tone,
        'context': context
    }


def main():
    parser = argparse.ArgumentParser(
        description='Seleccionar tonos para contenido io-neruda',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
    python tone_selector.py --list
    python tone_selector.py --client resogar.es
    python tone_selector.py --client esgarden.es --context "lanzamiento nuevo"
        """
    )

    parser.add_argument('--list', action='store_true', help='Listar todos los tonos')
    parser.add_argument('--client', help='Cliente para obtener recomendación')
    parser.add_argument('--context', help='Contexto adicional (opcional)')
    parser.add_argument('--config', default='config/tone_matrix.json',
                       help='Ruta a tone_matrix.json')

    args = parser.parse_args()

    # Cargar matriz de tonos
    script_dir = Path(__file__).parent.parent
    config_path = script_dir / args.config

    tone_matrix = load_tone_matrix(str(config_path))

    if args.list:
        list_all_tones(tone_matrix)
    elif args.client:
        recommendation = recommend_tone(tone_matrix, args.client, args.context or "")

        if recommendation:
            print(f"\n🎯 RECOMENDACIÓN DE TONO PARA: {recommendation['client']}")
            print(f"{'='*60}\n")

            primary = recommendation['primary']
            if primary:
                print(f"✅ TONO PRIMARIO: {primary['data']['name']}")
                print(f"   Descripción: {primary['data']['description']}")
                print(f"   Categoría: {primary['category']}")

            secondary = recommendation['secondary']
            if secondary:
                print(f"\n📌 TONO SECUNDARIO: {secondary['data']['name']}")
                print(f"   Descripción: {secondary['data']['description']}")
                print(f"   Categoría: {secondary['category']}")

            if recommendation['context']:
                print(f"\n📄 Contexto: {recommendation['context']}")

            print("\n" + "="*60)
            print("Usar estos tonos al generar contenido con io-neruda")

    else:
        parser.print_help()


if __name__ == '__main__':
    main()
