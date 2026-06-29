#!/usr/bin/env python3
"""
io-neruda Pipeline Orchestrator

Orquesta el flujo completo: Insight → Plan → Publicación → Backlinks
Integrado con E:\lib\003-Pipeline-Contenidos
"""

import argparse
import json
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class PipelineConfig:
    """Configuración centralizada del pipeline"""

    def __init__(self, env_file: Optional[str] = None):
        self.root_path = Path("E:/lib/003-Pipeline-Contenidos")
        self.insights_path = self.root_path / "01-Buzon-Insights"
        self.plans_path = self.root_path / "02-Generador-Planes"
        self.publish_path = self.root_path / "03-Ready-To-Publish"
        self.assets_path = self.root_path / "assets"

        # Crear carpeta de assets si no existe
        self.assets_path.mkdir(parents=True, exist_ok=True)

        self.env_vars = self._load_env(env_file) if env_file else {}

    def _load_env(self, env_file: str) -> Dict[str, str]:
        """Carga variables de entorno"""
        vars_dict = {}
        try:
            with open(env_file, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        if '=' in line:
                            key, value = line.split('=', 1)
                            vars_dict[key.strip()] = value.strip()
            logger.info(f"✅ Cargada configuración desde {env_file}")
        except FileNotFoundError:
            logger.error(f"❌ Archivo {env_file} no encontrado")

        return vars_dict


class PipelineOrchestrator:
    """Orquesta el pipeline de contenidos"""

    def __init__(self, config: PipelineConfig):
        self.config = config

    def list_insights(self) -> List[Path]:
        """Lista insights disponibles"""
        if not self.config.insights_path.exists():
            logger.warning(f"⚠️  Carpeta de insights no existe: {self.config.insights_path}")
            return []

        insights = list(self.config.insights_path.glob("*.md"))
        logger.info(f"📋 Encontrados {len(insights)} insights")
        return insights

    def list_plans(self) -> List[Path]:
        """Lista planes disponibles"""
        if not self.config.plans_path.exists():
            logger.warning(f"⚠️  Carpeta de planes no existe: {self.config.plans_path}")
            return []

        plans = list(self.config.plans_path.glob("*.md"))
        logger.info(f"📋 Encontrados {len(plans)} planes")
        return plans

    def list_ready_to_publish(self) -> List[Path]:
        """Lista contenido listo para publicar"""
        if not self.config.publish_path.exists():
            logger.warning(f"⚠️  Carpeta de publicación no existe: {self.config.publish_path}")
            return []

        posts = list(self.config.publish_path.glob("*.md"))
        logger.info(f"📋 Encontrados {len(posts)} posts listos para publicar")
        return posts

    def status(self) -> Dict:
        """Estado actual del pipeline"""
        insights = self.list_insights()
        plans = self.list_plans()
        ready = self.list_ready_to_publish()

        status = {
            'timestamp': datetime.now().isoformat(),
            'pipeline': {
                'insights': {
                    'count': len(insights),
                    'files': [f.name for f in insights]
                },
                'plans': {
                    'count': len(plans),
                    'files': [f.name for f in plans]
                },
                'ready_to_publish': {
                    'count': len(ready),
                    'files': [f.name for f in ready]
                }
            },
            'paths': {
                'insights': str(self.config.insights_path),
                'plans': str(self.config.plans_path),
                'publish': str(self.config.publish_path),
                'assets': str(self.config.assets_path)
            }
        }

        return status

    def print_status(self):
        """Imprime estado del pipeline de forma visual"""
        status = self.status()

        print("\n" + "="*70)
        print("📊 ESTADO DEL PIPELINE io-neruda")
        print("="*70)

        print(f"\n🔵 INSIGHTS (Buzon): {status['pipeline']['insights']['count']}")
        for file in status['pipeline']['insights']['files']:
            print(f"   📄 {file}")

        print(f"\n🟡 PLANES (Generador): {status['pipeline']['plans']['count']}")
        for file in status['pipeline']['plans']['files']:
            print(f"   📋 {file}")

        print(f"\n🟢 LISTOS (Ready): {status['pipeline']['ready_to_publish']['count']}")
        for file in status['pipeline']['ready_to_publish']['files']:
            print(f"   ✅ {file}")

        print("\n" + "="*70)
        print(f"Última actualización: {status['timestamp']}")
        print("="*70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='io-neruda Pipeline - Orquestación de contenidos',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
    python pipeline.py status
    python pipeline.py list --type insights
    python pipeline.py list --type plans
    python pipeline.py list --type ready
    python pipeline.py status --env .env.resogar
        """
    )

    parser.add_argument('command', choices=['status', 'list'],
                       help='Comando a ejecutar')
    parser.add_argument('--type', choices=['insights', 'plans', 'ready'],
                       help='Tipo de contenido a listar')
    parser.add_argument('--env', help='Archivo .env con credenciales')

    args = parser.parse_args()

    # Cargar configuración
    config = PipelineConfig(env_file=args.env)
    orchestrator = PipelineOrchestrator(config)

    if args.command == 'status':
        orchestrator.print_status()

    elif args.command == 'list':
        if args.type == 'insights':
            insights = orchestrator.list_insights()
            for insight in insights:
                print(f"  📄 {insight.name}")
        elif args.type == 'plans':
            plans = orchestrator.list_plans()
            for plan in plans:
                print(f"  📋 {plan.name}")
        elif args.type == 'ready':
            ready = orchestrator.list_ready_to_publish()
            for post in ready:
                print(f"  ✅ {post.name}")


if __name__ == '__main__':
    main()
