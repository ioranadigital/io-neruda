'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Cpu, Globe, Save, Upload, GitBranch, FlaskConical,
  ChevronDown, ChevronRight, TrendingUp,
  CheckCircle2, AlertCircle, Layers, Network, UserCircle2, RefreshCw,
} from 'lucide-react';
import { useGenerator } from '@/src/context/GeneratorContext';
import { showToast } from '@/src/components/shared/Toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type SiloIntention = 'TRANSACCIONAL' | 'INFORMATIVA' | 'COMPARATIVA' | 'COMERCIAL';
type ProcessState  = 'idle' | 'loading' | 'done';

interface SiloURLNode {
  id: string;
  slug: string;
  title: string;
  intention: SiloIntention;
  level: 'pilar' | 'satelite';
  keywords: string[];
  vol_estimado: number;
}

interface SiloCluster {
  id: string;
  name: string;
  head_term: string;
  pilar: SiloURLNode;
  satelites: SiloURLNode[];
  source: 'clustering' | 'competitor';
  competitorDomain?: string;
}

// ── Intention → Client Schema mapping ────────────────────────────────────────

// The five keywords_hierarchical fields this module writes to
type InjectionField =
  | 'level1_niche_sector'
  | 'level3_educational_howto'
  | 'level4_comparative_vs'
  | 'level4_lists_roundups'
  | 'level5_longtail_transactional';

// Determines the exact schema field based on intention + title heuristic.
// TRANSACCIONAL splits into: Listas/Recopilatorios (N4) for catalog/roundup pages,
// Long-Tail Transaccional (N5) for pure buy/price pages.
function intentionToSchemaField(intention: SiloIntention, title: string): InjectionField {
  switch (intention) {
    case 'INFORMATIVA':   return 'level3_educational_howto';
    case 'COMPARATIVA':   return 'level4_comparative_vs';
    case 'TRANSACCIONAL':
      return /catálogo|todas las|todos los|mejores|top\s?\d|modelos/i.test(title)
        ? 'level4_lists_roundups'
        : 'level5_longtail_transactional';
    default:              return 'level1_niche_sector';
  }
}

// Human-readable label shown in the tree ("→ N3 How-to", etc.)
function intentionToSchemaLabel(intention: SiloIntention, title: string): string {
  switch (intention) {
    case 'COMERCIAL':    return '→ N1 Head Terms';
    case 'INFORMATIVA':  return '→ N3 How-to';
    case 'COMPARATIVA':  return '→ N4 Comparativas';
    case 'TRANSACCIONAL':
      return /catálogo|todas las|todos los|mejores|top\s?\d|modelos/i.test(title)
        ? '→ N4 Listas'
        : '→ N5 Transaccional';
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const INTENTION_STYLES: Record<SiloIntention, { bg: string; color: string }> = {
  TRANSACCIONAL: { bg: '#dbeafe', color: '#1d4ed8' },
  INFORMATIVA:   { bg: '#ede9fe', color: '#6d28d9' },
  COMPARATIVA:   { bg: '#fef3c7', color: '#92400e' },
  COMERCIAL:     { bg: '#dcfce7', color: '#15803d' },
};

// ── Pure helpers ──────────────────────────────────────────────────────────────

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[áà]/g, 'a').replace(/[éè]/g, 'e')
    .replace(/[íì]/g, 'i').replace(/[óò]/g, 'o')
    .replace(/[úùü]/g, 'u').replace(/ñ/g, 'n')
    .replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function fallback(kws: string[], ...defaults: string[]): string[] {
  return kws.length > 0 ? kws : defaults;
}

// ── Mock generators ───────────────────────────────────────────────────────────

function buildClusterMock(rawText: string): SiloCluster {
  const lines    = rawText.split(/[\n,]+/).map(l => l.trim()).filter(Boolean);
  const headTerm = (lines[0] ?? 'maquinaria de jardín').toLowerCase();
  const slug     = slugify(headTerm);

  const transKws = lines.filter(k => /comprar|precio|oferta|mejor|donde/i.test(k)).slice(0, 3);
  const infoKws1 = lines.filter(k => /cómo|como|qué|que|guía|guia|manual/i.test(k)).slice(0, 3);
  const infoKws2 = lines.filter(k => /mantenimiento|cuidado|limpieza|reparar/i.test(k)).slice(0, 3);
  const compKws  = lines.filter(k => /vs|versus|comparar|diferencia/i.test(k)).slice(0, 3);

  return {
    id: `cluster-${Date.now()}`,
    name: `Silo: ${cap(headTerm)}`,
    head_term: headTerm,
    source: 'clustering',
    pilar: {
      id: 'p-0',
      slug: `/${slug}/`,
      title: `${cap(headTerm)}: Guía Completa de Compra 2026`,
      intention: 'COMERCIAL',
      level: 'pilar',
      keywords: lines.slice(0, 5).length > 0
        ? lines.slice(0, 5)
        : [`${headTerm} profesional`, `mejores ${headTerm}`, headTerm],
      vol_estimado: 2_400,
    },
    satelites: [
      {
        id: 's-1',
        slug: `/${slug}/comprar/`,
        title: `Comprar ${cap(headTerm)}: Mejores Modelos y Precios`,
        intention: 'TRANSACCIONAL',
        level: 'satelite',
        keywords: fallback(transKws, `comprar ${headTerm}`, `precio ${headTerm}`, `${headTerm} oferta`),
        vol_estimado: 1_100,
      },
      {
        id: 's-2',
        slug: `/${slug}/como-elegir/`,
        title: `Cómo Elegir ${cap(headTerm)}: Todo lo que Debes Saber`,
        intention: 'INFORMATIVA',
        level: 'satelite',
        keywords: fallback(infoKws1, `cómo elegir ${headTerm}`, `guía ${headTerm}`, `qué ${headTerm} comprar`),
        vol_estimado: 720,
      },
      {
        id: 's-3',
        slug: `/${slug}/comparativa/`,
        title: `Comparativa ${cap(headTerm)}: Los 5 Mejores en 2026`,
        intention: 'COMPARATIVA',
        level: 'satelite',
        keywords: fallback(compKws, `${headTerm} vs`, `comparar ${headTerm}`, `mejor ${headTerm} 2026`),
        vol_estimado: 480,
      },
      {
        id: 's-4',
        slug: `/${slug}/mantenimiento/`,
        title: `Mantenimiento de ${cap(headTerm)}: Guía Definitiva`,
        intention: 'INFORMATIVA',
        level: 'satelite',
        keywords: fallback(infoKws2, `mantenimiento ${headTerm}`, `cuidar ${headTerm}`, `limpieza ${headTerm}`),
        vol_estimado: 340,
      },
    ],
  };
}

// ── Competitor sitemap mock — domain-aware ────────────────────────────────────

interface RawSat {
  path: string;
  title: string;
  intention: SiloIntention;
  kws: string[];
  vol: number;
}

interface RawSiloTemplate {
  name: string;
  head_term: string;
  path: string;
  pilarTitle: string;
  pilarKws: string[];
  pilarVol: number;
  sats: RawSat[];
}

const INDUSTRY_TEMPLATES: Record<string, RawSiloTemplate[]> = {

  'home-improvement': [
    {
      name: 'Silo: Bricolaje y Herramientas', head_term: 'bricolaje herramientas',
      path: '/bricolaje/', pilarTitle: 'Bricolaje y Herramientas — Categoría Principal',
      pilarKws: ['herramientas bricolaje', 'herramientas eléctricas', 'bricolaje casa'], pilarVol: 9_200,
      sats: [
        { path: 'herramientas-electricas/', title: 'Herramientas Eléctricas: Catálogo y Precios', intention: 'TRANSACCIONAL', kws: ['comprar taladro', 'sierra circular precio', 'amoladora oferta'], vol: 3_800 },
        { path: 'herramientas-manuales/', title: 'Herramientas Manuales: Todas las Marcas', intention: 'TRANSACCIONAL', kws: ['martillo carpintero', 'destornillador juego', 'llaves allen set'], vol: 2_100 },
        { path: 'guia-bricolaje-principiantes/', title: 'Guía Bricolaje para Principiantes 2026', intention: 'INFORMATIVA', kws: ['cómo empezar bricolaje', 'herramientas básicas bricolaje', 'guía bricolaje casa'], vol: 1_600 },
        { path: 'como-colocar-suelo-laminado/', title: 'Cómo Colocar Suelo Laminado Paso a Paso', intention: 'INFORMATIVA', kws: ['colocar suelo laminado', 'instalar tarima flotante', 'suelo laminado tutorial'], vol: 890 },
      ],
    },
    {
      name: 'Silo: Jardín y Exterior', head_term: 'jardín exterior',
      path: '/jardin/', pilarTitle: 'Jardín y Exterior — Categoría Principal',
      pilarKws: ['maquinaria jardín', 'herramientas jardín', 'decoración jardín'], pilarVol: 8_100,
      sats: [
        { path: 'cortacespedes/', title: 'Cortacéspedes: Todas las Marcas y Modelos', intention: 'TRANSACCIONAL', kws: ['comprar cortacésped', 'cortacésped eléctrico precio', 'cortacésped batería oferta'], vol: 2_900 },
        { path: 'riego-automatico/', title: 'Sistemas de Riego Automático', intention: 'TRANSACCIONAL', kws: ['riego automático jardín', 'programador riego', 'aspersores precio'], vol: 1_400 },
        { path: 'como-plantar-cesped/', title: 'Cómo Plantar Césped: Guía Completa', intention: 'INFORMATIVA', kws: ['cómo plantar césped', 'siembra césped paso a paso', 'semillas césped'], vol: 870 },
        { path: 'cortacesped-gasolina-vs-electrico/', title: 'Cortacésped Gasolina vs Eléctrico', intention: 'COMPARATIVA', kws: ['cortacésped gasolina eléctrico diferencias', 'mejor cortacésped 2026'], vol: 560 },
      ],
    },
    {
      name: 'Silo: Baños y Fontanería', head_term: 'baños fontanería',
      path: '/banos/', pilarTitle: 'Baños y Fontanería — Categoría Principal',
      pilarKws: ['reformar baño', 'mamparas ducha', 'sanitarios baño'], pilarVol: 7_400,
      sats: [
        { path: 'mamparas-ducha/', title: 'Mamparas de Ducha: Catálogo Completo', intention: 'TRANSACCIONAL', kws: ['mampara ducha precio', 'mampara ducha abatible', 'comprar mampara baño'], vol: 2_600 },
        { path: 'inodoros/', title: 'Inodoros: Suspendidos, con Cisterna y Compactos', intention: 'TRANSACCIONAL', kws: ['inodoro suspendido precio', 'comprar inodoro', 'sanitarios baño oferta'], vol: 1_200 },
        { path: 'como-reformar-bano/', title: 'Cómo Reformar el Baño: Guía Paso a Paso', intention: 'INFORMATIVA', kws: ['reformar baño pasos', 'reforma baño presupuesto', 'ideas reformar baño pequeño'], vol: 1_900 },
        { path: 'griferias/', title: 'Grifería: Comparativa de Marcas 2026', intention: 'COMPARATIVA', kws: ['grifería baño comparativa', 'mejores grifos baño', 'grifo monomando vs termostático'], vol: 580 },
      ],
    },
    {
      name: 'Silo: Cocinas', head_term: 'cocinas',
      path: '/cocinas/', pilarTitle: 'Cocinas — Categoría Principal',
      pilarKws: ['muebles cocina', 'cocinas modernas', 'reformar cocina'], pilarVol: 6_800,
      sats: [
        { path: 'muebles-cocina/', title: 'Muebles de Cocina: Todos los Estilos', intention: 'TRANSACCIONAL', kws: ['muebles cocina precio', 'armarios cocina', 'módulos cocina comprar'], vol: 2_200 },
        { path: 'encimeras/', title: 'Encimeras de Cocina: Granito, Silestone y Más', intention: 'TRANSACCIONAL', kws: ['encimera cocina precio', 'encimera granito', 'silestone precio'], vol: 1_800 },
        { path: 'disenar-cocina-online/', title: 'Diseñar Cocina Online Gratis', intention: 'INFORMATIVA', kws: ['diseñar cocina gratis', 'planificador cocina online', 'cómo diseñar mi cocina'], vol: 1_100 },
        { path: 'cocina-abierta-vs-cerrada/', title: 'Cocina Abierta vs Cerrada: ¿Cuál Elegir?', intention: 'COMPARATIVA', kws: ['cocina abierta vs cerrada', 'ventajas cocina abierta', 'cocina integrada salón'], vol: 640 },
      ],
    },
    {
      name: 'Silo: Suelos y Pavimentos', head_term: 'suelos pavimentos',
      path: '/suelos-y-pavimentos/', pilarTitle: 'Suelos y Pavimentos — Categoría Principal',
      pilarKws: ['suelo laminado', 'parquet', 'baldosas suelo'], pilarVol: 5_900,
      sats: [
        { path: 'suelo-laminado/', title: 'Suelo Laminado: Precios y Modelos', intention: 'TRANSACCIONAL', kws: ['suelo laminado precio', 'comprar suelo laminado', 'tarima flotante barata'], vol: 2_800 },
        { path: 'parquet/', title: 'Parquet Natural y Sintético: Catálogo', intention: 'TRANSACCIONAL', kws: ['parquet precio m2', 'comprar parquet', 'parquet roble precio'], vol: 1_600 },
        { path: 'como-colocar-tarima/', title: 'Cómo Colocar Tarima Flotante: Tutorial', intention: 'INFORMATIVA', kws: ['colocar tarima flotante pasos', 'instalar suelo laminado guía'], vol: 980 },
        { path: 'suelo-laminado-vs-parquet/', title: 'Suelo Laminado vs Parquet: ¿Cuál es Mejor?', intention: 'COMPARATIVA', kws: ['suelo laminado o parquet', 'diferencias suelo laminado parquet'], vol: 520 },
      ],
    },
    {
      name: 'Silo: Pintura y Decoración', head_term: 'pintura decoración',
      path: '/pintura/', pilarTitle: 'Pintura y Decoración — Categoría Principal',
      pilarKws: ['pintura interior', 'pintura plástica', 'pintura paredes'], pilarVol: 4_200,
      sats: [
        { path: 'pinturas-interiores/', title: 'Pinturas Interiores: Las Mejores Marcas', intention: 'TRANSACCIONAL', kws: ['pintura interior paredes precio', 'pintura blanca mate', 'comprar pintura casa'], vol: 1_800 },
        { path: 'papel-pintado/', title: 'Papel Pintado: Tendencias 2026', intention: 'TRANSACCIONAL', kws: ['papel pintado precio', 'papel pintado tendencias', 'vinilo decorativo pared'], vol: 920 },
        { path: 'tecnicas-pintura-paredes/', title: 'Técnicas de Pintura para Paredes', intention: 'INFORMATIVA', kws: ['cómo pintar paredes', 'técnicas pintura esponjado', 'pintar casa uno mismo'], vol: 740 },
      ],
    },
    {
      name: 'Silo: Iluminación', head_term: 'iluminación led',
      path: '/iluminacion/', pilarTitle: 'Iluminación — Categoría Principal',
      pilarKws: ['lámparas LED', 'iluminación interior', 'focos led'], pilarVol: 3_800,
      sats: [
        { path: 'lamparas-led/', title: 'Lámparas LED: Catálogo y Precios', intention: 'TRANSACCIONAL', kws: ['lámpara led precio', 'bombilla led', 'iluminación led comprar'], vol: 1_600 },
        { path: 'focos-empotrables/', title: 'Focos Empotrables: Modelos y Precios', intention: 'TRANSACCIONAL', kws: ['foco empotrable led precio', 'downlight led', 'spot empotrable techo'], vol: 1_100 },
        { path: 'como-elegir-iluminacion-led/', title: 'Cómo Elegir la Iluminación LED: Guía Completa', intention: 'INFORMATIVA', kws: ['cómo elegir iluminación led', 'temperatura color led', 'luz cálida fría diferencia'], vol: 620 },
      ],
    },
    {
      name: 'Silo: Piscinas y Spa', head_term: 'piscinas spa',
      path: '/piscinas/', pilarTitle: 'Piscinas y Spa — Categoría Principal',
      pilarKws: ['piscinas desmontables', 'piscinas enterradas', 'jacuzzi exterior'], pilarVol: 5_100,
      sats: [
        { path: 'piscinas-desmontables/', title: 'Piscinas Desmontables: Precios 2026', intention: 'TRANSACCIONAL', kws: ['piscina desmontable precio', 'piscina inflable', 'piscina sobre suelo comprar'], vol: 2_200 },
        { path: 'piscinas-enterradas/', title: 'Piscinas Enterradas: Modelos y Presupuestos', intention: 'TRANSACCIONAL', kws: ['piscina enterrada precio', 'piscina obra presupuesto', 'instalar piscina jardín'], vol: 1_400 },
        { path: 'mantenimiento-piscina/', title: 'Mantenimiento de Piscina: Guía Completa', intention: 'INFORMATIVA', kws: ['mantenimiento piscina verano', 'cómo limpiar piscina', 'pH piscina'], vol: 880 },
        { path: 'piscina-desmontable-vs-enterrada/', title: 'Piscina Desmontable vs Enterrada', intention: 'COMPARATIVA', kws: ['piscina desmontable o enterrada', 'piscina sobre suelo vs obra'], vol: 560 },
      ],
    },
    {
      name: 'Silo: Calefacción y Climatización', head_term: 'calefacción climatización',
      path: '/calefaccion-climatizacion/', pilarTitle: 'Calefacción y Climatización — Categoría Principal',
      pilarKws: ['calefacción casa', 'aire acondicionado', 'bomba de calor'], pilarVol: 3_600,
      sats: [
        { path: 'radiadores/', title: 'Radiadores: Eléctricos, de Agua y de Aceite', intention: 'TRANSACCIONAL', kws: ['radiador eléctrico precio', 'calefactor bajo consumo', 'radiador aceite'], vol: 1_400 },
        { path: 'aire-acondicionado/', title: 'Aire Acondicionado: Los Mejores Modelos', intention: 'TRANSACCIONAL', kws: ['aire acondicionado precio', 'split inverter', 'climatizador evaporativo'], vol: 1_200 },
        { path: 'como-elegir-calefaccion/', title: 'Cómo Elegir el Sistema de Calefacción', intention: 'INFORMATIVA', kws: ['tipos calefacción casa', 'calefacción más barata', 'calefacción eléctrica vs gas'], vol: 680 },
        { path: 'bomba-calor-vs-aerotermia/', title: 'Bomba de Calor vs Aerotermia: Diferencias', intention: 'COMPARATIVA', kws: ['bomba calor aerotermia diferencias', 'aerotermia precio instalación'], vol: 420 },
      ],
    },
    {
      name: 'Silo: Reformas y Construcción', head_term: 'reformas construcción',
      path: '/reformas/', pilarTitle: 'Reformas y Construcción — Categoría Principal',
      pilarKws: ['reformar casa', 'reforma integral piso', 'presupuesto obra'], pilarVol: 4_900,
      sats: [
        { path: 'materiales-construccion/', title: 'Materiales de Construcción: Catálogo', intention: 'TRANSACCIONAL', kws: ['cemento precio', 'ladrillos comprar', 'hormigón materiales'], vol: 1_200 },
        { path: 'como-reformar-piso/', title: 'Cómo Reformar un Piso: Guía Completa', intention: 'INFORMATIVA', kws: ['reformar piso pasos', 'reforma integral pasos', 'cómo planificar reforma'], vol: 2_100 },
        { path: 'presupuesto-reforma-cocina/', title: 'Presupuesto para Reforma de Cocina', intention: 'INFORMATIVA', kws: ['reforma cocina precio', 'cuánto cuesta reformar cocina', 'presupuesto reforma baño'], vol: 1_400 },
      ],
    },
  ],

  'electronics': [
    { name: 'Silo: Smartphones', head_term: 'smartphones móviles',
      path: '/smartphones/', pilarTitle: 'Smartphones — Categoría Principal',
      pilarKws: ['mejores móviles 2026', 'smartphone android', 'iphone precio'], pilarVol: 18_400,
      sats: [
        { path: 'iphone/', title: 'iPhone: Todos los Modelos y Precios', intention: 'TRANSACCIONAL', kws: ['iphone 16 precio', 'comprar iphone', 'iphone oferta'], vol: 9_200 },
        { path: 'samsung-galaxy/', title: 'Samsung Galaxy: Catálogo Completo', intention: 'TRANSACCIONAL', kws: ['samsung galaxy precio', 'samsung s24 comprar', 'galaxy oferta'], vol: 7_100 },
        { path: 'como-elegir-movil/', title: 'Cómo Elegir el Móvil Perfecto en 2026', intention: 'INFORMATIVA', kws: ['cómo elegir smartphone', 'guía compra móvil', 'qué móvil comprar'], vol: 2_400 },
        { path: 'iphone-vs-samsung/', title: 'iPhone vs Samsung: Comparativa Definitiva', intention: 'COMPARATIVA', kws: ['iphone vs samsung', 'apple vs android', 'mejor móvil 2026'], vol: 4_800 },
      ] },
    { name: 'Silo: Ordenadores y Portátiles', head_term: 'ordenadores portátiles',
      path: '/ordenadores/', pilarTitle: 'Ordenadores y Portátiles — Categoría Principal',
      pilarKws: ['portátiles baratos', 'ordenadores sobremesa', 'mejores laptops 2026'], pilarVol: 12_800,
      sats: [
        { path: 'portatiles/', title: 'Portátiles: Las Mejores Opciones 2026', intention: 'TRANSACCIONAL', kws: ['portátil barato', 'comprar portátil', 'laptop gaming precio'], vol: 5_400 },
        { path: 'gaming/', title: 'Ordenadores Gaming: Alto Rendimiento', intention: 'TRANSACCIONAL', kws: ['ordenador gaming precio', 'pc gaming componentes', 'laptop gaming'], vol: 3_200 },
        { path: 'macbook/', title: 'MacBook: Todos los Modelos', intention: 'TRANSACCIONAL', kws: ['macbook price', 'macbook air m3', 'comprar macbook'], vol: 2_900 },
        { path: 'como-elegir-portatil/', title: 'Cómo Elegir Portátil: Guía 2026', intention: 'INFORMATIVA', kws: ['cómo elegir portátil', 'specs portátil', 'qué portátil necesito'], vol: 1_800 },
      ] },
    { name: 'Silo: Televisores', head_term: 'televisores TV',
      path: '/televisores/', pilarTitle: 'Televisores — Categoría Principal',
      pilarKws: ['televisores 4K', 'smart tv', 'mejores TV 2026'], pilarVol: 9_600,
      sats: [
        { path: 'oled/', title: 'TV OLED: Los Mejores Modelos y Precios', intention: 'TRANSACCIONAL', kws: ['tv oled precio', 'mejor oled 2026', 'comprar oled'], vol: 3_400 },
        { path: 'qled/', title: 'TV QLED: Catálogo y Comparativa', intention: 'TRANSACCIONAL', kws: ['qled precio', 'samsung qled', 'tv qled comprar'], vol: 2_200 },
        { path: 'como-elegir-television/', title: 'Cómo Elegir Tu Televisor: Guía Completa', intention: 'INFORMATIVA', kws: ['cómo elegir tv', 'tamaño tv habitación', 'resolución tv guía'], vol: 1_600 },
        { path: 'oled-vs-qled/', title: 'OLED vs QLED: ¿Cuál es Mejor?', intention: 'COMPARATIVA', kws: ['oled vs qled diferencias', 'mejor tecnología tv', 'oled qled comparativa'], vol: 2_800 },
      ] },
    { name: 'Silo: Audio y Sonido', head_term: 'auriculares altavoces',
      path: '/audio/', pilarTitle: 'Audio y Sonido — Categoría Principal',
      pilarKws: ['auriculares inalámbricos', 'altavoces bluetooth', 'barras de sonido'], pilarVol: 6_200,
      sats: [
        { path: 'auriculares/', title: 'Auriculares: Noise Cancelling y Wireless', intention: 'TRANSACCIONAL', kws: ['auriculares noise cancelling', 'airpods precio', 'auriculares bluetooth comprar'], vol: 3_100 },
        { path: 'altavoces-bluetooth/', title: 'Altavoces Bluetooth: Portátiles y de Escritorio', intention: 'TRANSACCIONAL', kws: ['altavoz bluetooth precio', 'bose price', 'altavoz portátil comprar'], vol: 1_900 },
        { path: 'auriculares-vs-earbuds/', title: 'Auriculares vs Earbuds: ¿Cuál Elegir?', intention: 'COMPARATIVA', kws: ['auriculares vs earbuds', 'over ear vs in ear', 'mejor formato audio'], vol: 1_200 },
      ] },
    { name: 'Silo: Gaming', head_term: 'videojuegos consolas',
      path: '/gaming/', pilarTitle: 'Gaming y Videojuegos — Categoría Principal',
      pilarKws: ['consolas gaming', 'PS5 precio', 'Nintendo Switch'], pilarVol: 11_400,
      sats: [
        { path: 'consolas/', title: 'Consolas: PS5, Xbox y Switch', intention: 'TRANSACCIONAL', kws: ['ps5 precio', 'xbox series x comprar', 'nintendo switch precio'], vol: 5_800 },
        { path: 'mandos-gaming/', title: 'Mandos y Accesorios Gaming', intention: 'TRANSACCIONAL', kws: ['mando ps5', 'mando xbox precio', 'volante gaming'], vol: 2_100 },
        { path: 'ps5-vs-xbox/', title: 'PS5 vs Xbox Series X: Comparativa 2026', intention: 'COMPARATIVA', kws: ['ps5 vs xbox', 'consola 2026 mejor', 'playstation vs xbox'], vol: 3_400 },
      ] },
    { name: 'Silo: Electrodomésticos', head_term: 'electrodomésticos hogar',
      path: '/electrodomesticos/', pilarTitle: 'Electrodomésticos — Categoría Principal',
      pilarKws: ['lavadora precio', 'frigorífico', 'horno integrable'], pilarVol: 8_900,
      sats: [
        { path: 'lavadoras/', title: 'Lavadoras: Las Mejores Marcas y Precios', intention: 'TRANSACCIONAL', kws: ['lavadora barata', 'comprar lavadora', 'lavadora bosch precio'], vol: 3_600 },
        { path: 'frigorificos/', title: 'Frigoríficos: No Frost, Americanos y Combi', intention: 'TRANSACCIONAL', kws: ['frigorífico no frost', 'frigorífico americano precio', 'comprar nevera'], vol: 2_800 },
        { path: 'como-elegir-lavadora/', title: 'Cómo Elegir Lavadora: Guía Completa', intention: 'INFORMATIVA', kws: ['cómo elegir lavadora', 'centrifugado lavadora rpm', 'kg lavadora elegir'], vol: 1_400 },
        { path: 'lavadora-vs-lavasecadora/', title: 'Lavadora vs Lavasecadora: ¿Qué Conviene?', intention: 'COMPARATIVA', kws: ['lavadora o lavasecadora', 'lavasecadora ventajas', 'lavadora secadora diferencias'], vol: 980 },
      ] },
    { name: 'Silo: Tablets e iPads', head_term: 'tablets ipad',
      path: '/tablets/', pilarTitle: 'Tablets — Categoría Principal',
      pilarKws: ['ipad precio', 'tablet android', 'mejores tablets 2026'], pilarVol: 5_200,
      sats: [
        { path: 'ipad/', title: 'iPad: Todos los Modelos 2026', intention: 'TRANSACCIONAL', kws: ['ipad precio', 'ipad air', 'comprar ipad'], vol: 2_600 },
        { path: 'android/', title: 'Tablets Android: Catálogo Completo', intention: 'TRANSACCIONAL', kws: ['tablet android barata', 'samsung tab precio', 'amazon fire'], vol: 1_800 },
        { path: 'tablet-vs-portatil/', title: 'Tablet vs Portátil: ¿Cuál Necesitas?', intention: 'COMPARATIVA', kws: ['tablet o portátil', 'ipad vs macbook', 'tablet portatil diferencias'], vol: 1_100 },
      ] },
    { name: 'Silo: Fotografía y Cámaras', head_term: 'cámaras fotografía',
      path: '/camaras-foto/', pilarTitle: 'Fotografía y Cámaras — Categoría Principal',
      pilarKws: ['cámara reflex precio', 'mirrorless', 'mejores cámaras 2026'], pilarVol: 4_100,
      sats: [
        { path: 'mirrorless/', title: 'Cámaras Mirrorless: Los Mejores Modelos', intention: 'TRANSACCIONAL', kws: ['cámara mirrorless precio', 'sony alpha', 'fujifilm precio'], vol: 1_800 },
        { path: 'reflex/', title: 'Cámaras Réflex: Canon, Nikon y Sony', intention: 'TRANSACCIONAL', kws: ['cámara reflex precio', 'canon eos', 'nikon d comprar'], vol: 1_400 },
        { path: 'reflex-vs-mirrorless/', title: 'Réflex vs Mirrorless: ¿Cuál Elegir?', intention: 'COMPARATIVA', kws: ['reflex vs mirrorless diferencias', 'qué cámara comprar', 'sistema cámaras 2026'], vol: 920 },
      ] },
  ],

  'fashion': [
    { name: 'Silo: Ropa Mujer', head_term: 'ropa mujer',
      path: '/mujer/', pilarTitle: 'Moda Mujer — Categoría Principal',
      pilarKws: ['ropa mujer nueva temporada', 'moda mujer 2026', 'vestidos mujer'], pilarVol: 14_200,
      sats: [
        { path: 'vestidos/', title: 'Vestidos de Mujer: Todas las Tendencias', intention: 'TRANSACCIONAL', kws: ['vestidos mujer precio', 'vestido verano comprar', 'vestido elegante'], vol: 5_600 },
        { path: 'pantalones/', title: 'Pantalones de Mujer: Vaqueros y Más', intention: 'TRANSACCIONAL', kws: ['pantalón mujer precio', 'vaquero mujer tiro alto', 'pantalón palazzo'], vol: 3_200 },
        { path: 'tendencias-primavera/', title: 'Tendencias Primavera-Verano 2026', intention: 'INFORMATIVA', kws: ['moda primavera 2026', 'tendencias ropa 2026', 'colores primavera 2026'], vol: 4_100 },
      ] },
    { name: 'Silo: Ropa Hombre', head_term: 'ropa hombre',
      path: '/hombre/', pilarTitle: 'Moda Hombre — Categoría Principal',
      pilarKws: ['ropa hombre casual', 'moda masculina', 'camisas hombre'], pilarVol: 8_600,
      sats: [
        { path: 'camisas/', title: 'Camisas de Hombre: Casuales y Formales', intention: 'TRANSACCIONAL', kws: ['camisa hombre precio', 'camisa oxford', 'camisa lino hombre'], vol: 2_900 },
        { path: 'vaqueros-hombre/', title: 'Vaqueros de Hombre: Todos los Cortes', intention: 'TRANSACCIONAL', kws: ['vaquero hombre', 'jeans hombre slim', 'pantalón tejano precio'], vol: 2_100 },
        { path: 'como-combinar-ropa-hombre/', title: 'Cómo Combinar Ropa de Hombre', intention: 'INFORMATIVA', kws: ['combinar ropa hombre', 'estilo casual hombre', 'outfits hombre 2026'], vol: 1_800 },
      ] },
    { name: 'Silo: Calzado', head_term: 'zapatos calzado',
      path: '/calzado/', pilarTitle: 'Calzado — Categoría Principal',
      pilarKws: ['zapatillas mujer', 'zapatos hombre', 'calzado deportivo'], pilarVol: 9_400,
      sats: [
        { path: 'zapatillas-deportivas/', title: 'Zapatillas Deportivas: Running y Casual', intention: 'TRANSACCIONAL', kws: ['zapatillas running precio', 'zapatillas nike comprar', 'adidas mujer precio'], vol: 4_200 },
        { path: 'botines/', title: 'Botines: Los Mejores Modelos 2026', intention: 'TRANSACCIONAL', kws: ['botines mujer', 'botines otoño', 'botines precio'], vol: 2_800 },
        { path: 'como-elegir-zapatillas-running/', title: 'Cómo Elegir Zapatillas de Running', intention: 'INFORMATIVA', kws: ['cómo elegir zapatilla running', 'pronación zapatilla', 'zapatilla trail vs carretera'], vol: 1_400 },
      ] },
    { name: 'Silo: Accesorios', head_term: 'bolsos accesorios moda',
      path: '/accesorios/', pilarTitle: 'Bolsos y Accesorios — Categoría Principal',
      pilarKws: ['bolso mujer', 'cinturones', 'complementos moda'], pilarVol: 6_100,
      sats: [
        { path: 'bolsos/', title: 'Bolsos de Mujer: Totes, Clutch y Mochilas', intention: 'TRANSACCIONAL', kws: ['bolso mujer precio', 'bolso tote', 'bolso cuero precio'], vol: 3_200 },
        { path: 'cinturones/', title: 'Cinturones: Hombre y Mujer', intention: 'TRANSACCIONAL', kws: ['cinturón cuero precio', 'cinturón moda hombre', 'complementos 2026'], vol: 1_400 },
      ] },
  ],

  'sports': [
    { name: 'Silo: Running y Atletismo', head_term: 'running atletismo',
      path: '/running/', pilarTitle: 'Running y Atletismo — Categoría Principal',
      pilarKws: ['zapatillas running', 'ropa atletismo', 'equipación running'], pilarVol: 11_200,
      sats: [
        { path: 'zapatillas-running/', title: 'Zapatillas de Running: Las Mejores 2026', intention: 'TRANSACCIONAL', kws: ['mejores zapatillas running', 'zapatilla maratón', 'nike pegasus precio'], vol: 5_400 },
        { path: 'pulsometros-gps/', title: 'Pulsómetros GPS: Comparativa de Relojes', intention: 'TRANSACCIONAL', kws: ['reloj gps running', 'garmin precio', 'pulsometro correr'], vol: 2_800 },
        { path: 'plan-entrenamiento-5km/', title: 'Plan de Entrenamiento: Del Sofá a los 5km', intention: 'INFORMATIVA', kws: ['plan entrenamiento principiantes', 'cómo empezar a correr', 'tabla correr 5km'], vol: 2_100 },
        { path: 'minimalista-vs-amortiguacion/', title: 'Zapatilla Minimalista vs con Amortiguación', intention: 'COMPARATIVA', kws: ['zapatilla minimalista vs amortiguada', 'drop zapatilla running', 'mejor zapatilla 2026'], vol: 1_400 },
      ] },
    { name: 'Silo: Ciclismo', head_term: 'ciclismo bicicletas',
      path: '/ciclismo/', pilarTitle: 'Ciclismo — Categoría Principal',
      pilarKws: ['bicicletas carretera', 'bicicleta montaña', 'bici eléctrica'], pilarVol: 8_800,
      sats: [
        { path: 'bici-montana/', title: 'Bicicletas de Montaña: MTB Hard y Full', intention: 'TRANSACCIONAL', kws: ['bicicleta montaña precio', 'mtb hardtail', 'bici enduro comprar'], vol: 3_600 },
        { path: 'bici-electrica/', title: 'Bicicletas Eléctricas: Catálogo 2026', intention: 'TRANSACCIONAL', kws: ['bici eléctrica precio', 'ebike comprar', 'patinete eléctrico vs bici'], vol: 2_900 },
        { path: 'bici-carretera-vs-montana/', title: 'Bicicleta Carretera vs Montaña', intention: 'COMPARATIVA', kws: ['bici carretera vs mtb', 'qué bici comprar', 'ciclismo tipo bicicleta'], vol: 1_800 },
      ] },
    { name: 'Silo: Fitness y Gimnasio', head_term: 'fitness gimnasio musculación',
      path: '/fitness/', pilarTitle: 'Fitness y Musculación — Categoría Principal',
      pilarKws: ['material fitness hogar', 'pesas musculación', 'entrenamiento casa'], pilarVol: 7_200,
      sats: [
        { path: 'pesas-mancuernas/', title: 'Pesas y Mancuernas: Juegos Completos', intention: 'TRANSACCIONAL', kws: ['mancuernas precio', 'juego pesas casa', 'pesas ajustables comprar'], vol: 2_600 },
        { path: 'colchonetas-yoga/', title: 'Colchonetas de Yoga y Pilates', intention: 'TRANSACCIONAL', kws: ['colchoneta yoga precio', 'esterilla pilates', 'mat yoga comprar'], vol: 1_800 },
        { path: 'rutina-casa-sin-material/', title: 'Rutina de Ejercicios en Casa sin Material', intention: 'INFORMATIVA', kws: ['rutina casa sin material', 'entrenamiento cuerpo libre', 'ejercicios hiit casa'], vol: 2_900 },
      ] },
    { name: 'Silo: Natación', head_term: 'natación piscina',
      path: '/natacion/', pilarTitle: 'Natación — Categoría Principal',
      pilarKws: ['bañadores competición', 'gafas natación', 'equipación piscina'], pilarVol: 4_100,
      sats: [
        { path: 'bañadores/', title: 'Bañadores de Competición y Ocio', intention: 'TRANSACCIONAL', kws: ['bañador natación precio', 'bañador speedo', 'bañador arena comprar'], vol: 1_800 },
        { path: 'gafas-natacion/', title: 'Gafas de Natación: Las Mejores 2026', intention: 'TRANSACCIONAL', kws: ['gafas natación precio', 'gafas piscina', 'gafas natación espejo'], vol: 1_400 },
        { path: 'aprender-nadar-adultos/', title: 'Cómo Aprender a Nadar de Adulto', intention: 'INFORMATIVA', kws: ['aprender nadar adulto', 'técnica crol principiantes', 'clases natación adultos'], vol: 980 },
      ] },
  ],

  'furniture': [
    { name: 'Silo: Dormitorios', head_term: 'muebles dormitorio',
      path: '/dormitorios/', pilarTitle: 'Muebles de Dormitorio — Categoría Principal',
      pilarKws: ['camas', 'armarios', 'dormitorio completo'], pilarVol: 7_800,
      sats: [
        { path: 'camas/', title: 'Camas: Matrimonio, Individual y Nido', intention: 'TRANSACCIONAL', kws: ['cama matrimonio precio', 'comprar cama', 'estructura cama 150'], vol: 3_200 },
        { path: 'armarios/', title: 'Armarios: Correderos, Abatibles y Vestidores', intention: 'TRANSACCIONAL', kws: ['armario corredera precio', 'armario empotrado', 'vestidor modular'], vol: 2_400 },
        { path: 'decorar-dormitorio/', title: 'Ideas para Decorar el Dormitorio', intention: 'INFORMATIVA', kws: ['decorar dormitorio ideas', 'dormitorio minimalista', 'cabecero decorativo'], vol: 1_800 },
      ] },
    { name: 'Silo: Salón y Comedor', head_term: 'muebles salón comedor',
      path: '/salon/', pilarTitle: 'Salón y Comedor — Categoría Principal',
      pilarKws: ['sofás', 'mesas comedor', 'mueble tv'], pilarVol: 9_200,
      sats: [
        { path: 'sofas/', title: 'Sofás: Rinconera, Chaiselongue y 3 Plazas', intention: 'TRANSACCIONAL', kws: ['sofá rinconera precio', 'sofa chaiselongue', 'comprar sofa'], vol: 4_100 },
        { path: 'mesas-comedor/', title: 'Mesas de Comedor: Fijas y Extensibles', intention: 'TRANSACCIONAL', kws: ['mesa comedor precio', 'mesa extensible', 'mesa roble comedor'], vol: 2_600 },
        { path: 'estilo-nordico-vs-industrial/', title: 'Estilo Nórdico vs Industrial: Tendencias 2026', intention: 'COMPARATIVA', kws: ['decoración nórdica vs industrial', 'estilo escandinavo', 'decoración 2026 tendencias'], vol: 1_400 },
      ] },
    { name: 'Silo: Cocina y Organización', head_term: 'muebles cocina organización',
      path: '/cocina/', pilarTitle: 'Cocina y Organización — Categoría Principal',
      pilarKws: ['muebles cocina', 'almacenaje cocina', 'organizadores'], pilarVol: 5_400,
      sats: [
        { path: 'muebles-auxiliares/', title: 'Muebles Auxiliares: Aparadores y Estanterías', intention: 'TRANSACCIONAL', kws: ['aparador cocina', 'estantería modular', 'mueble auxiliar precio'], vol: 2_100 },
        { path: 'organizar-cocina/', title: 'Cómo Organizar la Cocina: Ideas y Trucos', intention: 'INFORMATIVA', kws: ['organizar cocina pequeña', 'ideas organización cocina', 'despensa ordenada'], vol: 1_900 },
      ] },
  ],

  'supermarket': [
    { name: 'Silo: Alimentación y Despensa', head_term: 'alimentación despensa',
      path: '/alimentacion/', pilarTitle: 'Alimentación — Categoría Principal',
      pilarKws: ['productos alimentación', 'despensa online', 'compra supermercado'], pilarVol: 22_000,
      sats: [
        { path: 'pasta-arroz/', title: 'Pasta, Arroz y Legumbres', intention: 'TRANSACCIONAL', kws: ['arroz precio', 'pasta comprar', 'legumbres online'], vol: 8_400 },
        { path: 'aceite-vinagre/', title: 'Aceites y Vinagres: Oliva y Girasol', intention: 'TRANSACCIONAL', kws: ['aceite oliva virgen extra', 'aceite precio', 'vinagre de manzana'], vol: 4_200 },
        { path: 'alimentacion-saludable-guia/', title: 'Guía de Alimentación Saludable', intention: 'INFORMATIVA', kws: ['dieta saludable guía', 'alimentación equilibrada', 'qué comer semana'], vol: 3_600 },
      ] },
    { name: 'Silo: Bebidas', head_term: 'bebidas refrescos',
      path: '/bebidas/', pilarTitle: 'Bebidas — Categoría Principal',
      pilarKws: ['agua mineral', 'refrescos', 'zumos naturales'], pilarVol: 8_800,
      sats: [
        { path: 'agua-mineral/', title: 'Agua Mineral: Pack y Formatos', intention: 'TRANSACCIONAL', kws: ['agua mineral 8 litros', 'agua sin gas precio', 'agua con gas comprar'], vol: 3_800 },
        { path: 'refrescos/', title: 'Refrescos: Todas las Marcas', intention: 'TRANSACCIONAL', kws: ['refresco comprar', 'coca cola precio', 'refrescos pack oferta'], vol: 2_900 },
      ] },
    { name: 'Silo: Droguería y Limpieza', head_term: 'droguería limpieza hogar',
      path: '/drogueria/', pilarTitle: 'Droguería — Categoría Principal',
      pilarKws: ['detergente lavadora', 'limpiahogar', 'limpieza hogar'], pilarVol: 6_400,
      sats: [
        { path: 'detergentes/', title: 'Detergentes: Lavadora, Loza y Multiusos', intention: 'TRANSACCIONAL', kws: ['detergente lavadora precio', 'detergente capsulas', 'comprar limpiador'], vol: 2_800 },
        { path: 'limpiezas-especiales/', title: 'Productos de Limpieza Especial: Baño y Cocina', intention: 'TRANSACCIONAL', kws: ['limpiabaños', 'quitagrasas cocina', 'limpiador multiusos'], vol: 1_900 },
        { path: 'como-limpiar-casa-rapido/', title: 'Cómo Limpiar la Casa en 30 Minutos', intention: 'INFORMATIVA', kws: ['limpiar casa rápido', 'rutina limpieza semanal', 'organizar limpieza hogar'], vol: 1_400 },
      ] },
  ],

  'automotive': [
    { name: 'Silo: Neumáticos', head_term: 'neumáticos ruedas',
      path: '/neumaticos/', pilarTitle: 'Neumáticos — Categoría Principal',
      pilarKws: ['neumáticos precio', 'ruedas coche', 'cambio neumáticos'], pilarVol: 9_600,
      sats: [
        { path: 'verano/', title: 'Neumáticos de Verano: Las Mejores Marcas', intention: 'TRANSACCIONAL', kws: ['neumático verano precio', 'michelin primacy', 'continental precio'], vol: 4_200 },
        { path: 'invierno/', title: 'Neumáticos de Invierno: Rendimiento en Frío', intention: 'TRANSACCIONAL', kws: ['neumático invierno', 'blizzak precio', 'neumático nieve'], vol: 2_600 },
        { path: 'cuando-cambiar-neumaticos/', title: 'Cuándo Cambiar los Neumáticos: Señales', intention: 'INFORMATIVA', kws: ['cuándo cambiar neumáticos', 'desgaste neumático', 'vida útil rueda'], vol: 1_800 },
        { path: 'verano-vs-invierno/', title: 'Neumático Verano vs Invierno vs All Season', intention: 'COMPARATIVA', kws: ['neumático verano vs invierno', 'four seasons neumático', 'all season vs verano'], vol: 1_400 },
      ] },
    { name: 'Silo: Aceites y Lubricantes', head_term: 'aceites motor lubricantes',
      path: '/aceites/', pilarTitle: 'Aceites y Lubricantes — Categoría Principal',
      pilarKws: ['aceite motor', 'cambio aceite coche', 'lubricante automóvil'], pilarVol: 5_200,
      sats: [
        { path: 'aceite-motor/', title: 'Aceites de Motor: 5W30, 5W40 y Más', intention: 'TRANSACCIONAL', kws: ['aceite 5w30 precio', 'aceite motor comprar', '5w40 full synthetic'], vol: 2_400 },
        { path: 'cuando-cambiar-aceite/', title: 'Cuándo Cambiar el Aceite del Coche', intention: 'INFORMATIVA', kws: ['cada cuánto cambiar aceite', 'km cambio aceite', 'aceite bajo nivel'], vol: 1_900 },
      ] },
    { name: 'Silo: Accesorios y Gadgets', head_term: 'accesorios coche gadgets',
      path: '/accesorios/', pilarTitle: 'Accesorios y Gadgets — Categoría Principal',
      pilarKws: ['cámara trasera coche', 'GPS navegador', 'funda coche'], pilarVol: 4_800,
      sats: [
        { path: 'camaras-traseras/', title: 'Cámaras Traseras y Dashcam: Los Mejores', intention: 'TRANSACCIONAL', kws: ['cámara trasera coche precio', 'dashcam comprar', 'cámara aparcamiento'], vol: 1_900 },
        { path: 'cargadores-movil/', title: 'Cargadores de Móvil para Coche', intention: 'TRANSACCIONAL', kws: ['cargador coche usb c', 'cargador rápido coche', 'soporte móvil coche'], vol: 1_600 },
        { path: 'como-limpiar-coche-interior/', title: 'Cómo Limpiar el Interior del Coche', intention: 'INFORMATIVA', kws: ['limpiar interior coche', 'limpieza tapicería coche', 'cómo limpiar salpicadero'], vol: 1_200 },
      ] },
  ],

  'garden': [
    { name: 'Silo: Herramientas de Jardín', head_term: 'herramientas jardín',
      path: '/herramientas-jardin/', pilarTitle: 'Herramientas de Jardín — Categoría Principal',
      pilarKws: ['herramientas jardín', 'maquinaria jardín', 'equipos jardinería'], pilarVol: 6_800,
      sats: [
        { path: 'cortacespedes/', title: 'Cortacéspedes: Todas las Marcas y Tipos', intention: 'TRANSACCIONAL', kws: ['comprar cortacésped', 'cortacésped eléctrico precio', 'cortacésped batería'], vol: 2_900 },
        { path: 'podadoras/', title: 'Podadoras y Tijeras de Jardín', intention: 'TRANSACCIONAL', kws: ['podadora eléctrica precio', 'tijeras poda', 'podadora batería comprar'], vol: 1_600 },
        { path: 'guia-herramientas-jardin/', title: 'Guía de Herramientas Esenciales para el Jardín', intention: 'INFORMATIVA', kws: ['herramientas básicas jardín', 'qué necesito para jardín', 'kit jardinero principiante'], vol: 980 },
        { path: 'cortacesped-gasolina-vs-electrico/', title: 'Cortacésped Gasolina vs Eléctrico', intention: 'COMPARATIVA', kws: ['cortacésped gasolina eléctrico', 'mejor cortacésped tipo'], vol: 560 },
      ] },
    { name: 'Silo: Plantas y Semillas', head_term: 'plantas semillas jardín',
      path: '/plantas/', pilarTitle: 'Plantas y Semillas — Categoría Principal',
      pilarKws: ['plantas exterior', 'semillas hortalizas', 'bulbos flores'], pilarVol: 4_200,
      sats: [
        { path: 'plantas-exterior/', title: 'Plantas de Exterior: Resistentes y Ornamentales', intention: 'TRANSACCIONAL', kws: ['plantas exterior precio', 'plantas terraza', 'comprar plantas online'], vol: 2_100 },
        { path: 'semillas-hortalizas/', title: 'Semillas de Hortalizas: Tomate, Lechuga y Más', intention: 'TRANSACCIONAL', kws: ['semillas tomate', 'semillas hortalizas precio', 'huerto urbano semillas'], vol: 1_400 },
        { path: 'como-cuidar-plantas-exterior/', title: 'Cómo Cuidar las Plantas de Exterior', intention: 'INFORMATIVA', kws: ['cuidar plantas terraza', 'riego plantas exterior', 'abono plantas jardín'], vol: 980 },
      ] },
    { name: 'Silo: Riego y Sistemas', head_term: 'riego jardín sistemas',
      path: '/riego/', pilarTitle: 'Riego y Sistemas — Categoría Principal',
      pilarKws: ['riego automático', 'goteo jardín', 'programador riego'], pilarVol: 3_600,
      sats: [
        { path: 'riego-automatico/', title: 'Sistemas de Riego Automático', intention: 'TRANSACCIONAL', kws: ['riego automático precio', 'kit riego goteo', 'programador riego comprar'], vol: 1_800 },
        { path: 'como-instalar-riego-goteo/', title: 'Cómo Instalar Riego por Goteo', intention: 'INFORMATIVA', kws: ['instalar riego goteo', 'cómo hacer riego automático', 'tubo goteo jardín'], vol: 1_200 },
      ] },
    { name: 'Silo: Piscinas y Jacuzzis', head_term: 'piscinas jardín',
      path: '/piscinas/', pilarTitle: 'Piscinas y Jacuzzis — Categoría Principal',
      pilarKws: ['piscinas desmontables', 'piscinas elevadas', 'jacuzzi exterior'], pilarVol: 5_800,
      sats: [
        { path: 'piscinas-desmontables/', title: 'Piscinas Desmontables: Mejores Modelos', intention: 'TRANSACCIONAL', kws: ['piscina desmontable precio', 'piscina inflable', 'piscina tubular comprar'], vol: 2_600 },
        { path: 'mantenimiento-piscina/', title: 'Mantenimiento de Piscina: Guía Completa', intention: 'INFORMATIVA', kws: ['mantenimiento piscina verano', 'cloro piscina', 'limpieza piscina fondo'], vol: 1_600 },
        { path: 'piscina-sobre-suelo-vs-enterrada/', title: 'Piscina Sobre Suelo vs Enterrada', intention: 'COMPARATIVA', kws: ['piscina desmontable vs enterrada', 'ventajas piscina obra'], vol: 980 },
      ] },
    { name: 'Silo: Barbacoas y Outdoor Cooking', head_term: 'barbacoas outdoor cocina exterior',
      path: '/barbacoas/', pilarTitle: 'Barbacoas y Cocina Exterior — Categoría Principal',
      pilarKws: ['barbacoa jardín', 'parrilla exterior', 'cocina exterior'], pilarVol: 3_200,
      sats: [
        { path: 'barbacoas-gas/', title: 'Barbacoas de Gas: Los Mejores Modelos 2026', intention: 'TRANSACCIONAL', kws: ['barbacoa gas precio', 'comprar barbacoa gas', 'grill gas precio'], vol: 1_600 },
        { path: 'barbacoas-carbon/', title: 'Barbacoas de Carbón: Tradicionales y Weber', intention: 'TRANSACCIONAL', kws: ['barbacoa carbón', 'weber precio', 'kettle grill comprar'], vol: 1_100 },
        { path: 'guia-compra-barbacoa/', title: 'Cómo Elegir tu Barbacoa: Guía 2026', intention: 'INFORMATIVA', kws: ['qué barbacoa elegir', 'tipos barbacoa diferencias', 'barbacoa tamaño'], vol: 620 },
      ] },
    { name: 'Silo: Muebles de Jardín', head_term: 'muebles jardín exterior',
      path: '/muebles-jardin/', pilarTitle: 'Muebles de Jardín y Exterior — Categoría Principal',
      pilarKws: ['conjunto jardín', 'hamacas exterior', 'mesa jardín'], pilarVol: 4_600,
      sats: [
        { path: 'conjuntos-comedor-exterior/', title: 'Conjuntos de Comedor Exterior', intention: 'TRANSACCIONAL', kws: ['mesa jardín precio', 'conjunto exterior aluminio', 'comedor exterior comprar'], vol: 2_200 },
        { path: 'hamacas-tumbonas/', title: 'Hamacas y Tumbonas: Catálogo 2026', intention: 'TRANSACCIONAL', kws: ['tumbona precio', 'hamaca jardín', 'silla plegable exterior'], vol: 1_600 },
        { path: 'muebles-jardin-resistentes-lluvia/', title: 'Muebles de Jardín Resistentes a la Lluvia', intention: 'INFORMATIVA', kws: ['muebles jardín impermeables', 'material muebles exterior', 'teca vs aluminio jardín'], vol: 820 },
      ] },
  ],

};

// Detect industry from domain keyword patterns
function detectIndustry(domain: string): string {
  const d = domain.toLowerCase();
  if (/leroy|bricomart|brico.?depot|bricodepot|bricoman|castorama|bauhaus|lerler/.test(d)) return 'home-improvement';
  if (/decathlon|sport|running|fitness|intersport/.test(d)) return 'sports';
  if (/mediamarkt|fnac|pccomponentes|pcbox|worten|darty|euronics|electro/.test(d)) return 'electronics';
  if (/zara|mango|hm\.com|pullbear|bershka|stradivarius|fashion|inditex/.test(d)) return 'fashion';
  if (/ikea|conforama|kibuc|banak|mueble|furniture|habitat/.test(d)) return 'furniture';
  if (/mercadona|carrefour|eroski|alcampo|lidl|aldi|dia\.es|supermer/.test(d)) return 'supermarket';
  if (/autopart|neumatico|recambio|taller|midas|norauto|coche|motor/.test(d)) return 'automotive';
  if (/jardin|garden|vivero|esgarden|verdecora|flower|semilla|planta/.test(d)) return 'garden';
  return 'generic';
}

function buildCompetitorMock(url: string): SiloCluster[] {
  const domain   = url.replace(/https?:\/\//i, '').split('/')[0] ?? 'competidor.com';
  const base     = `https://${domain}`;
  const industry = detectIndustry(domain);

  const templates =
    industry in INDUSTRY_TEMPLATES
      ? INDUSTRY_TEMPLATES[industry]
      : INDUSTRY_TEMPLATES['garden']; // fallback for unknown domains

  return templates.map((t, idx) => ({
    id: `comp-${idx}`,
    name: t.name,
    head_term: t.head_term,
    source: 'competitor' as const,
    competitorDomain: domain,
    pilar: {
      id: `c${idx}-p`,
      slug: `${base}${t.path}`,
      title: t.pilarTitle,
      intention: 'COMERCIAL' as SiloIntention,
      level: 'pilar' as const,
      keywords: t.pilarKws,
      vol_estimado: t.pilarVol,
    },
    satelites: t.sats.map((s, si) => ({
      id: `c${idx}-s${si}`,
      slug: `${base}${t.path}${s.path}`,
      title: s.title,
      intention: s.intention,
      level: 'satelite' as const,
      keywords: s.kws,
      vol_estimado: s.vol,
    })),
  }));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function IntentionBadge({ intention }: { intention: SiloIntention }) {
  const s = INTENTION_STYLES[intention];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {intention}
    </span>
  );
}

function VolPill({ vol }: { vol: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px]" style={{ color: '#94a3b8' }}>
      <TrendingUp size={10} />
      {vol.toLocaleString('es')}
    </span>
  );
}

function SiloTree({ cluster }: { cluster: SiloCluster }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: '#e2e8f0' }}>
      {/* Cluster header / toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <Network size={15} style={{ color: '#4aa87a', flexShrink: 0 }} />
        <span className="flex-1 text-sm font-semibold" style={{ color: '#0f172a' }}>{cluster.name}</span>
        {cluster.source === 'competitor' && cluster.competitorDomain && (
          <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
            {cluster.competitorDomain}
          </span>
        )}
        <span
          className="text-[10px] px-1.5 py-0.5 rounded"
          style={cluster.source === 'clustering'
            ? { backgroundColor: '#d4ece0', color: '#166534' }
            : { backgroundColor: '#e0e7ff', color: '#3730a3' }}
        >
          {cluster.source === 'clustering' ? 'Clustering' : 'Competencia'}
        </span>
        {collapsed
          ? <ChevronRight size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
          : <ChevronDown  size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
        }
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 pt-2 space-y-2">
          {/* Pilar — green pastel with left accent border */}
          <div
            className="flex items-start gap-3 rounded-lg p-3 border-l-4"
            style={{
              backgroundColor: '#e8f5ee',
              borderLeftColor: '#4aa87a',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
            }}
          >
            <GitBranch size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#4aa87a' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#4aa87a' }}>
                  Pilar Web · Categoría
                </span>
                <IntentionBadge intention={cluster.pilar.intention} />
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#d4ece0', color: '#166534' }}>
                  {intentionToSchemaLabel(cluster.pilar.intention, cluster.pilar.title)}
                </span>
                <VolPill vol={cluster.pilar.vol_estimado} />
              </div>
              <p className="text-sm font-semibold mt-0.5" style={{ color: '#0f172a' }}>
                {cluster.pilar.title}
              </p>
              <p className="text-xs font-mono mt-0.5 truncate" style={{ color: '#4aa87a' }}>
                {cluster.pilar.slug}
              </p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {cluster.pilar.keywords.slice(0, 5).map(kw => (
                  <span key={kw} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#d4ece0', color: '#1a5c35' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Satellite URLs — indented with thin grey connector */}
          <div className="ml-6 border-l-2 pl-4 space-y-2" style={{ borderColor: '#ebebeb' }}>
            {cluster.satelites.map((sat, idx) => (
              <div
                key={sat.id}
                className="relative flex items-start gap-3 rounded-lg p-3 border bg-white"
                style={{ borderColor: '#e2e8f0' }}
              >
                {/* Connector dot on the vertical line */}
                <div
                  className="absolute -left-[19px] top-[14px] w-2.5 h-2.5 rounded-full border-2 bg-white"
                  style={{ borderColor: '#ebebeb' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-semibold" style={{ color: '#94a3b8' }}>
                      Satélite Web · Prof. +{idx + 1}
                    </span>
                    <IntentionBadge intention={sat.intention} />
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                      {intentionToSchemaLabel(sat.intention, sat.title)}
                    </span>
                    <VolPill vol={sat.vol_estimado} />
                  </div>
                  <p className="text-sm font-medium mt-0.5" style={{ color: '#1e293b' }}>
                    {sat.title}
                  </p>
                  <p className="text-xs font-mono mt-0.5 truncate" style={{ color: '#64748b' }}>
                    {sat.slug}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {sat.keywords.slice(0, 3).map(kw => (
                      <span key={kw} className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────────────────

export default function SiloBuilderView() {
  const { clients, selectedClient, selectClient, updateClient } = useGenerator();
  const csvInputRef = useRef<HTMLInputElement>(null);

  const [kwText,          setKwText]          = useState('');
  const [clusterState,    setClusterState]    = useState<ProcessState>('idle');
  const [clusterMsg,      setClusterMsg]      = useState('');
  const [competitorUrl,   setCompetitorUrl]   = useState('');
  const [competitorState, setCompetitorState] = useState<ProcessState>('idle');
  const [activeSilos,     setActiveSilos]     = useState<SiloCluster[]>([]);
  const [injected,        setInjected]        = useState(false);

  // CSV / TXT upload → append to textarea
  const handleCsvUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? '';
      setKwText(prev => prev ? `${prev}\n${text}` : text);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, []);

  // Case 1: semantic clustering
  const handleRunClustering = useCallback(() => {
    if (!kwText.trim()) return;
    setClusterState('loading');
    setClusterMsg('Clustering en proceso... analizando vectores de intención');
    setActiveSilos([]);
    setCompetitorState('idle');
    setInjected(false);

    setTimeout(() => {
      setActiveSilos([buildClusterMock(kwText)]);
      setClusterState('done');
      setClusterMsg('');
    }, 1_800);
  }, [kwText]);

  // Case 2: competitor sitemap scan
  const handleScanCompetitor = useCallback(() => {
    if (!competitorUrl.trim()) return;
    setCompetitorState('loading');
    setActiveSilos([]);
    setClusterState('idle');
    setInjected(false);

    setTimeout(() => {
      setActiveSilos(buildCompetitorMock(competitorUrl));
      setCompetitorState('done');
    }, 2_200);
  }, [competitorUrl]);

  // Inject silo keywords into the correct schema levels by intention
  const handleInject = useCallback(() => {
    if (!selectedClient || activeSilos.length === 0) return;

    // Accumulators for the 5 schema fields we write
    const acc: Record<InjectionField, string[]> = {
      level1_niche_sector:           [],
      level3_educational_howto:      [],
      level4_comparative_vs:         [],
      level4_lists_roundups:         [],
      level5_longtail_transactional: [],
    };

    for (const silo of activeSilos) {
      // Pilar (COMERCIAL) → Nivel 1 Head Terms de Sector
      acc.level1_niche_sector.push(silo.head_term, ...silo.pilar.keywords);

      // Satellites → route by intention using the shared translator
      for (const sat of silo.satelites) {
        const field = intentionToSchemaField(sat.intention, sat.title);
        acc[field].push(...sat.keywords);
      }
    }

    // Merge each field with existing client data (dedup via Set)
    const kh = selectedClient.keywords_hierarchical ?? {};
    const merge = (existing: string[] | undefined, incoming: string[]): string[] =>
      Array.from(new Set([...(existing ?? []), ...incoming]));

    updateClient({
      ...selectedClient,
      keywords_hierarchical: {
        ...kh,
        level1_niche_sector:           merge(kh.level1_niche_sector,           acc.level1_niche_sector),
        level3_educational_howto:      merge(kh.level3_educational_howto,      acc.level3_educational_howto),
        level4_comparative_vs:         merge(kh.level4_comparative_vs,         acc.level4_comparative_vs),
        level4_lists_roundups:         merge(kh.level4_lists_roundups,         acc.level4_lists_roundups),
        level5_longtail_transactional: merge(kh.level5_longtail_transactional, acc.level5_longtail_transactional),
      },
    });

    // sessionStorage bridge for Planner interlinking
    sessionStorage.setItem('neruda-silo-links', JSON.stringify(
      activeSilos.flatMap(s => [s.pilar.slug, ...s.satelites.map(sat => sat.slug)])
    ));

    setInjected(true);

    // Toast breakdown: show counts per schema level
    const parts = [
      acc.level1_niche_sector.length           && `N1: ${acc.level1_niche_sector.length} head terms`,
      acc.level3_educational_howto.length      && `N3: ${acc.level3_educational_howto.length} how-to`,
      acc.level4_comparative_vs.length         && `N4: ${acc.level4_comparative_vs.length} comparativas`,
      acc.level4_lists_roundups.length         && `N4: ${acc.level4_lists_roundups.length} listas`,
      acc.level5_longtail_transactional.length && `N5: ${acc.level5_longtail_transactional.length} transaccional`,
    ].filter(Boolean).join(' · ');

    showToast.success(`Inyectado en ${selectedClient.name} · ${parts}`);
  }, [selectedClient, activeSilos, updateClient]);

  const kwCount = kwText.split(/[\n,]+/).filter(l => l.trim()).length;
  const isIdle  = clusterState !== 'loading' && competitorState !== 'loading';

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f4fbf7' }}>
      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">

        {/* ── Header ── */}
        <div className="bg-white rounded-2xl border px-5 py-4 flex items-center justify-between gap-4 flex-wrap" style={{ borderColor: '#e2e8f0' }}>
          {/* Title block */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e8f5ee' }}>
              <Network size={17} style={{ color: '#4aa87a' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold leading-none" style={{ color: '#0f172a' }}>
                  Creador de Silos Semánticos
                </h1>
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0"
                  style={{ backgroundColor: '#fef3c7', borderColor: '#fbbf24', color: '#92400e' }}
                >
                  <FlaskConical size={9} />
                  MODO TEST
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                Clustering semántico · Ingeniería inversa de competencia
              </p>
            </div>
          </div>

          {/* ── Client selector ── */}
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl border flex-shrink-0"
            style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', minWidth: 260 }}
          >
            <UserCircle2 size={16} style={{ color: selectedClient ? '#4aa87a' : '#94a3b8', flexShrink: 0 }} />

            {selectedClient ? (
              /* Client active — show name + change button */
              <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: '#0f172a' }}>
                    {selectedClient.name}
                  </p>
                  <p className="text-[10px] truncate" style={{ color: '#64748b' }}>
                    {selectedClient.business_type ?? 'Cliente activo'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => selectClient(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium flex-shrink-0 transition-colors hover:bg-slate-100"
                  style={{ borderColor: '#e2e8f0', color: '#64748b' }}
                >
                  <RefreshCw size={10} />
                  Cambiar
                </button>
              </div>
            ) : clients.length > 0 ? (
              /* No client — show dropdown */
              <select
                defaultValue=""
                onChange={e => {
                  const found = clients.find(c => c.id === e.target.value);
                  selectClient(found ?? null);
                }}
                className="flex-1 bg-transparent text-sm focus:outline-none cursor-pointer"
                style={{ color: '#0f172a' }}
              >
                <option value="" disabled>Seleccionar cliente...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.business_type ? ` — ${c.business_type}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              /* No clients at all */
              <span className="text-xs" style={{ color: '#94a3b8' }}>
                Sin clientes · Crea uno en la sección Clientes
              </span>
            )}
          </div>
        </div>

        {/* ── Two operative cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Card 1 · Clustering */}
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#e8f5ee' }}
              >
                <Cpu size={17} style={{ color: '#4aa87a' }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#0f172a' }}>
                  Caso 1: Constructor por Keywords
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                  Clustering semántico por intención · hasta 200 keywords
                </p>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={kwText}
                onChange={e => setKwText(e.target.value)}
                placeholder={
                  'cortacésped profesional\nmaquinaria jardín precio\ncómo elegir cortacésped\nmejor podadora batería 2026\ncortacésped gasolina vs eléctrico\nmantenimiento cortacésped pasos\ncomprar podadora online oferta\n...'
                }
                rows={10}
                className="w-full resize-none rounded-xl border px-3.5 py-3 text-sm font-mono focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e2e8f0',
                  color: '#0f172a',
                  backgroundColor: '#fafafa',
                  lineHeight: '1.75',
                }}
              />
              <div
                className="absolute bottom-3 right-3 text-[10px] px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}
              >
                {kwCount} / 200 kws
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-colors hover:bg-slate-50"
                style={{ borderColor: '#e2e8f0', color: '#64748b' }}
              >
                <Upload size={12} />
                Subir CSV
              </button>
              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleCsvUpload}
              />
              <button
                type="button"
                onClick={handleRunClustering}
                disabled={!kwText.trim() || clusterState === 'loading'}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4aa87a' }}
                onMouseEnter={e => {
                  if (kwText.trim() && clusterState !== 'loading')
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d9068';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4aa87a';
                }}
              >
                <Cpu size={15} />
                {clusterState === 'loading' ? 'Procesando...' : 'Ejecutar Clustering Semántico'}
              </button>
            </div>

            {clusterState === 'loading' && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: '#ede9fe', color: '#6d28d9' }}
              >
                <Cpu size={14} className="animate-pulse" />
                {clusterMsg}
              </div>
            )}
            {clusterState === 'done' && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
              >
                <CheckCircle2 size={14} />
                Clustering completado · {activeSilos[0]?.satelites.length ?? 0} URLs satélite generadas
              </div>
            )}
          </div>

          {/* Card 2 · Competitor sitemap */}
          <div className="bg-white rounded-2xl border p-5 flex flex-col gap-4" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#fef3c7' }}
              >
                <Globe size={17} style={{ color: '#92400e' }} />
              </div>
              <div>
                <h2 className="font-bold text-base" style={{ color: '#0f172a' }}>
                  Caso 2: Espía de Arquitectura (Sitemaps)
                </h2>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                  Ingeniería inversa de competencia · Aislamiento de intenciones
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: '#374151' }}>
                URL del sitemap de la competencia
              </label>
              <input
                type="url"
                value={competitorUrl}
                onChange={e => setCompetitorUrl(e.target.value)}
                placeholder="https://competidor.com/sitemap.xml"
                className="w-full rounded-xl border px-3.5 py-3 text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#e2e8f0', color: '#0f172a', backgroundColor: '#fafafa' }}
                onKeyDown={e => { if (e.key === 'Enter') handleScanCompetitor(); }}
              />
              <p className="text-[11px]" style={{ color: '#94a3b8' }}>
                Acepta: sitemap.xml · sitemap_index.xml · sitemap-*.xml
              </p>
            </div>

            <div
              className="rounded-xl border p-3 space-y-1.5"
              style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
            >
              <p className="text-[11px] font-bold" style={{ color: '#92400e' }}>
                Detecta automáticamente:
              </p>
              {[
                'Silos comerciales vs. informativos',
                'Profundidad de URL (N2 · N3 · N4)',
                'Intención de búsqueda por patrón de slug',
                'Volumen de cobertura por temática',
              ].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-[11px]" style={{ color: '#78350f' }}>
                  <ChevronRight size={10} />
                  {item}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleScanCompetitor}
              disabled={!competitorUrl.trim() || competitorState === 'loading'}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#b45309' }}
              onMouseEnter={e => {
                if (competitorUrl.trim() && competitorState !== 'loading')
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#92400e';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b45309';
              }}
            >
              <Globe size={15} />
              {competitorState === 'loading' ? 'Escaneando sitemap...' : 'Escanear Silos Competencia'}
            </button>

            {competitorState === 'loading' && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
              >
                <Globe size={14} className="animate-spin" />
                Parseando sitemap · Detectando estructura de silos...
              </div>
            )}
            {competitorState === 'done' && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ backgroundColor: '#dcfce7', color: '#15803d' }}
              >
                <CheckCircle2 size={14} />
                {activeSilos.length} silos detectados en{' '}
                {competitorUrl.replace(/https?:\/\//i, '').split('/')[0]}
              </div>
            )}
          </div>
        </div>

        {/* ── Results: silo tree ── */}
        {activeSilos.length > 0 && (
          <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: '#e2e8f0' }}>
            {/* Results header + injection button */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Layers size={16} style={{ color: '#4aa87a' }} />
                <h2 className="font-bold text-base" style={{ color: '#0f172a' }}>
                  Árbol Visual de Silos
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: '#e8f5ee', color: '#4aa87a' }}
                >
                  {activeSilos.length} {activeSilos.length === 1 ? 'silo' : 'silos'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleInject}
                disabled={!selectedClient || injected}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={injected
                  ? { backgroundColor: '#dcfce7', borderColor: '#86efac', color: '#15803d' }
                  : { backgroundColor: '#0f172a', borderColor: '#0f172a', color: '#ffffff' }
                }
                title={!selectedClient ? 'Ve a Clientes y selecciona uno para activar la inyección' : undefined}
              >
                {injected ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {injected ? 'Inyectado en ficha' : 'Inyectar Silo a Ficha de Cliente'}
              </button>
            </div>

            {!selectedClient && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs border"
                style={{ backgroundColor: '#fff7ed', borderColor: '#fed7aa', color: '#9a3412' }}
              >
                <AlertCircle size={12} />
                Selecciona un cliente en la cabecera para activar la inyección
              </div>
            )}

            {/* Trees */}
            <div className="space-y-3">
              {activeSilos.map(silo => (
                <SiloTree key={silo.id} cluster={silo} />
              ))}
            </div>

            {/* JSON preview (collapsible) */}
            <details className="group">
              <summary
                className="cursor-pointer select-none flex items-center gap-2 text-xs font-semibold py-1 list-none"
                style={{ color: '#64748b' }}
              >
                <ChevronRight size={12} className="group-open:rotate-90 transition-transform inline" />
                Ver estructura JSON completa del silo
              </summary>
              <pre
                className="mt-2 rounded-xl p-3 text-[11px] overflow-auto max-h-72 font-mono"
                style={{ backgroundColor: '#0f172a', color: '#a3e635' }}
              >
                {JSON.stringify(activeSilos.length === 1 ? activeSilos[0] : activeSilos, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* ── Empty state ── */}
        {activeSilos.length === 0 && isIdle && (
          <div className="text-center py-16">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#e8f5ee' }}
            >
              <Network size={24} style={{ color: '#4aa87a' }} />
            </div>
            <p className="text-base font-semibold" style={{ color: '#0f172a' }}>
              El árbol de silos aparecerá aquí
            </p>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>
              Introduce keywords o una URL de sitemap y ejecuta el análisis
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
