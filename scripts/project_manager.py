#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Project Manager - io-neruda

Gestor centralizado de proyectos para pipeline multipropósito.
Coordina configuraciones, rutas y metadatos por proyecto.
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any


class ProjectManager:
    """Gestiona proyectos en el pipeline de contenidos"""

    def __init__(self, pipeline_root: str = "E:/lib/003-Pipeline-Contenidos"):
        """Inicializa el manager con la ruta del pipeline"""
        self.pipeline_root = Path(pipeline_root)

        if not self.pipeline_root.exists():
            raise FileNotFoundError(f"Pipeline root no existe: {pipeline_root}")

    def list_projects(self) -> List[str]:
        """Lista todos los proyectos disponibles"""
        projects = []
        for item in self.pipeline_root.iterdir():
            if item.is_dir() and (item / "00-Config").exists():
                projects.append(item.name)
        return sorted(projects)

    def get_project_config(self, project_name: str) -> Dict[str, Any]:
        """Obtiene la configuración completa del proyecto"""
        config_path = self.pipeline_root / project_name / "00-Config" / "config.json"

        if not config_path.exists():
            raise FileNotFoundError(f"Config no encontrado para {project_name}")

        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def get_project_paths(self, project_name: str) -> Dict[str, Path]:
        """Obtiene todas las rutas relevantes del proyecto"""
        base = self.pipeline_root / project_name

        return {
            'root': base,
            'config': base / "00-Config",
            'insights': base / "01-Buzon-Insights",
            'plans': base / "02-Generador-Planes",
            'ready': base / "03-Ready-To-Publish",
            'assets': base / "assets",
            'assets_headers': base / "assets" / "headers",
            'assets_images': base / "assets" / "images",
        }

    def get_env_file(self, project_name: str) -> Optional[Path]:
        """Obtiene la ruta del archivo .env del proyecto"""
        env_file = self.pipeline_root / project_name / "00-Config" / f".env.{project_name}"

        if env_file.exists():
            return env_file

        return None

    def project_exists(self, project_name: str) -> bool:
        """Verifica si un proyecto existe"""
        project_path = self.pipeline_root / project_name
        return project_path.exists() and (project_path / "00-Config").exists()

    def get_project_info(self, project_name: str) -> Dict[str, Any]:
        """Obtiene información completa del proyecto"""
        if not self.project_exists(project_name):
            raise ValueError(f"Proyecto no encontrado: {project_name}")

        config = self.get_project_config(project_name)
        paths = self.get_project_paths(project_name)

        # Contar archivos en cada carpeta
        insights_count = len(list(paths['insights'].glob("*.md")))
        plans_count = len(list(paths['plans'].glob("*.md")))
        ready_count = len(list(paths['ready'].glob("*.md")))

        return {
            'name': project_name,
            'display_name': config.get('name', project_name),
            'type': config.get('type', 'unknown'),
            'status': config.get('status', 'unknown'),
            'wordpress_url': config.get('wordpress_url', ''),
            'tone': config.get('tone', {}),
            'paths': {k: str(v) for k, v in paths.items()},
            'stats': {
                'insights': insights_count,
                'plans': plans_count,
                'ready_to_publish': ready_count,
            },
            'exporters': config.get('exporters', {}).get('enabled', []),
            'created': config.get('created', ''),
            'updated': config.get('updated', ''),
        }

    def validate_project(self, project_name: str) -> Dict[str, Any]:
        """Valida la integridad de un proyecto"""
        if not self.project_exists(project_name):
            return {'valid': False, 'errors': [f'Proyecto no existe: {project_name}']}

        errors = []
        paths = self.get_project_paths(project_name)

        # Verificar carpetas requeridas
        required_dirs = ['config', 'insights', 'plans', 'ready', 'assets']
        for dir_key in required_dirs:
            if not paths[dir_key].exists():
                errors.append(f'Carpeta faltante: {paths[dir_key]}')

        # Verificar archivos de config
        config_file = paths['config'] / "config.json"
        if not config_file.exists():
            errors.append(f'config.json faltante')

        try:
            self.get_project_config(project_name)
        except json.JSONDecodeError as e:
            errors.append(f'config.json inválido: {e}')

        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'project': project_name
        }

    def print_project_info(self, project_name: str) -> None:
        """Imprime información formateada del proyecto"""
        try:
            info = self.get_project_info(project_name)

            print(f"\n{'='*70}")
            print(f"📦 PROYECTO: {info['display_name']}")
            print(f"{'='*70}\n")

            print(f"  Nombre interno: {info['name']}")
            print(f"  Tipo: {info['type']}")
            print(f"  Estado: {info['status']}")
            print(f"  WordPress: {info['wordpress_url'] or 'N/A'}")

            print(f"\n📊 Contenido:")
            print(f"  • Insights: {info['stats']['insights']}")
            print(f"  • Planes: {info['stats']['plans']}")
            print(f"  • Listos para publicar: {info['stats']['ready_to_publish']}")

            print(f"\n🎯 Tono:")
            if info['tone']:
                print(f"  • Primario: {info['tone'].get('primary', 'N/A')}")
                print(f"  • Secundario: {info['tone'].get('secondary', 'N/A')}")

            print(f"\n📤 Exporters habilitados:")
            if info['exporters']:
                for exporter in info['exporters']:
                    print(f"  • {exporter}")

            print(f"\n📅 Metadatos:")
            print(f"  • Creado: {info['created']}")
            print(f"  • Actualizado: {info['updated']}")

            print(f"\n{'='*70}\n")

        except Exception as e:
            print(f"❌ Error: {e}")

    def list_projects_formatted(self) -> None:
        """Lista todos los proyectos de forma formateada"""
        projects = self.list_projects()

        if not projects:
            print("\n⚠️  No hay proyectos disponibles\n")
            return

        print(f"\n{'='*70}")
        print("📦 PROYECTOS DISPONIBLES")
        print(f"{'='*70}\n")

        for i, project in enumerate(projects, 1):
            try:
                info = self.get_project_info(project)
                status_emoji = "✅" if info['status'] == 'active' else "⏸️"

                print(f"{i}. {status_emoji} {info['display_name']}")
                print(f"   Tipo: {info['type']}")
                print(f"   Contenido: {info['stats']['insights']} insights, "
                      f"{info['stats']['plans']} planes, "
                      f"{info['stats']['ready_to_publish']} listos")
                print()

            except Exception as e:
                print(f"{i}. ❌ {project} (error: {e})\n")

        print(f"{'='*70}\n")


def main():
    """CLI para el project manager"""
    import argparse

    parser = argparse.ArgumentParser(
        description='io-neruda Project Manager',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
EJEMPLOS:

  Listar todos los proyectos:
    python project_manager.py --list

  Ver información de un proyecto:
    python project_manager.py --info surfvintage

  Validar integridad de un proyecto:
    python project_manager.py --validate surfvintage

  Ver todos los detalles:
    python project_manager.py --list --verbose
        """
    )

    parser.add_argument(
        '--list',
        action='store_true',
        help='Listar todos los proyectos'
    )

    parser.add_argument(
        '--info',
        type=str,
        help='Mostrar información detallada de un proyecto'
    )

    parser.add_argument(
        '--validate',
        type=str,
        help='Validar integridad de un proyecto'
    )

    parser.add_argument(
        '--pipeline-root',
        default='E:/lib/003-Pipeline-Contenidos',
        help='Ruta al pipeline de contenidos'
    )

    args = parser.parse_args()

    try:
        pm = ProjectManager(args.pipeline_root)

        if args.list:
            pm.list_projects_formatted()

        elif args.info:
            pm.print_project_info(args.info)

        elif args.validate:
            result = pm.validate_project(args.validate)
            print(f"\n{'='*70}")
            print(f"🔍 VALIDACIÓN: {args.validate}")
            print(f"{'='*70}\n")

            if result['valid']:
                print("✅ Proyecto válido y listo para usar\n")
            else:
                print("❌ Errores encontrados:\n")
                for error in result['errors']:
                    print(f"   • {error}\n")

            print(f"{'='*70}\n")

        else:
            parser.print_help()

    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
