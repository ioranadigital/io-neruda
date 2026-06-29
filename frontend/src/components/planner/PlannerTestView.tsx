'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGenerator } from '@/src/context/GeneratorContext';
import { PlannerItem, FormDataInjection, ContentType } from '@/src/types/planner';
import {
  Zap, ChevronDown, ChevronUp, CalendarDays, Target, Link,
  MessageSquare, Tag, Globe, TrendingUp, Sparkles, Upload,
  CheckCircle, Plus, X, Clock, AlertCircle,
} from 'lucide-react';
import ClientSelectorChip from '@/src/components/shared/ClientSelectorChip';

// ── Constants ────────────────────────────────────────────────────────────────

/** Simulated "today" so first-week July deadlines trigger urgency badges */
const SIM_TODAY = new Date(2026, 5, 28); // June 28, 2026

const WINDOW_START = new Date(2026, 6, 1);   // July 1, 2026
const WINDOW_END   = new Date(2026, 8, 30);  // Sep 30, 2026
const WINDOW_MIN   = '2026-07-01';
const WINDOW_MAX   = '2026-09-30';

// ── Mock client config ────────────────────────────────────────────────────────

const MOCK_CLIENT = {
  name: 'Esgarden',
  posts_por_semana: 2,
  dias_publicacion: ['martes', 'jueves'],
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

type ContentTemplate = Omit<PlannerItem, 'id' | 'deadline_date' | 'origen'>;
type PlannerTab = 'automatizacion' | 'manual' | 'csv';
type MonthFilter = 0 | 7 | 8 | 9;

interface ManualFormData {
  keyword: string;
  silo: string;
  angulo: string;
  deadline_date: string;
}

const EMPTY_FORM: ManualFormData = { keyword: '', silo: '', angulo: '', deadline_date: '' };

// ── Content pool ──────────────────────────────────────────────────────────────

const CONTENT_POOL: ContentTemplate[] = [
  // ── Seasonal — priority slots ─────────────────────────────────────────────
  {
    Estacionalidad: 'Abril a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Productos & Tienda', Subtema: 'Cortacéspedes',
    URL_Slug: 'blog/mejor-cortacesped-verano',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 2: Guía de Compra Transaccional',
    Contexto_Local_Regional: 'Guadalajara',
    Angulo_Enfoque_Sugerido: 'Comparar rendimiento y consumo en jardines medianos bajo el sol de verano',
    Keyword_Principal: 'mejor cortacésped verano Guadalajara',
    Vol_Busquedas: 320, Marcas_Autoridad: 'Husqvarna, Bosch, Makita',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'SÍ (Guía de mantenimiento)',
    CTA_Primario: 'Ver cortacéspedes en tienda', CTA_Secundario: 'Descargar guía completa',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Abril a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Jardinería', Subtema: 'Riego',
    URL_Slug: 'blog/sistemas-riego-automatico-jardin',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 1: Estructura Comparativa Premium (Vs)',
    Contexto_Local_Regional: 'Sevilla',
    Angulo_Enfoque_Sugerido: 'Ahorro de agua con sistemas inteligentes frente a riego manual en zonas de calor',
    Keyword_Principal: 'sistema riego automático jardín Sevilla',
    Vol_Busquedas: 480, Marcas_Autoridad: 'Rain Bird, Hunter, Gardena',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'SÍ (Calculadora de consumo)',
    CTA_Primario: 'Ver sistemas de riego', CTA_Secundario: 'Solicitar asesoramiento',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Abril a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Plantas & Semillas', Subtema: 'Fertilizantes',
    URL_Slug: 'blog/fertilizantes-verano-cuando-como',
    Padre_Interlinking: 'plantas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Guía: Fertilización de verano',
    Contexto_Local_Regional: 'Madrid',
    Angulo_Enfoque_Sugerido: 'Qué fertilizante usar en julio-agosto para maximizar floración sin quemar raíces',
    Keyword_Principal: 'fertilizante verano plantas jardín',
    Vol_Busquedas: 210, Marcas_Autoridad: 'Compo, Flower, Batlle',
    Intencion_Funnel: 'INFORMACIONAL',
    Email_OptIn: 'SÍ (Calendario de fertilización)',
    CTA_Primario: 'Ver fertilizantes de verano', CTA_Secundario: 'Unirse a newsletter',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Abril a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Jardinería', Subtema: 'Mantenimiento',
    URL_Slug: 'blog/mantenimiento-jardin-calor-extremo',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Tips: Jardín en verano',
    Contexto_Local_Regional: 'Valencia',
    Angulo_Enfoque_Sugerido: 'Rutinas de mantenimiento para jardín mediterráneo durante ola de calor',
    Keyword_Principal: 'mantenimiento jardín verano calor',
    Vol_Busquedas: 160, Marcas_Autoridad: 'Gardena, Fiskars, Tramontina',
    Intencion_Funnel: 'INFORMACIONAL',
    Email_OptIn: 'SÍ (Checklist de verano)',
    CTA_Primario: 'Ver herramientas de mantenimiento', CTA_Secundario: 'Descargar checklist',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Abril a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Productos & Tienda', Subtema: 'Piscinas',
    URL_Slug: 'tienda/accesorios-piscina-jardin',
    Padre_Interlinking: 'tienda/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 2: Guía de Compra Transaccional',
    Contexto_Local_Regional: 'Málaga',
    Angulo_Enfoque_Sugerido: 'Accesorios imprescindibles para mantener piscina de jardín en temporada alta',
    Keyword_Principal: 'accesorios piscina jardín Málaga',
    Vol_Busquedas: 290, Marcas_Autoridad: 'Intex, Bestway, Hayward',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'SÍ (Guía de mantenimiento piscina)',
    CTA_Primario: 'Ver accesorios de piscina', CTA_Secundario: 'Pedir presupuesto',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Junio a Agosto',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Plantas & Semillas', Subtema: 'Árboles frutales',
    URL_Slug: 'blog/arboles-frutales-temporada-verano',
    Padre_Interlinking: 'plantas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Tendencias: Huerto urbano en verano',
    Contexto_Local_Regional: 'Alicante',
    Angulo_Enfoque_Sugerido: 'Los 8 árboles frutales que más producen en verano y cómo maximizar su cosecha',
    Keyword_Principal: 'árboles frutales verano Alicante',
    Vol_Busquedas: 175, Marcas_Autoridad: 'Viveros Floraex, Viveros El Plantío',
    Intencion_Funnel: 'EDUCACIONAL',
    Email_OptIn: 'SÍ (Guía de poda frutal)',
    CTA_Primario: 'Ver árboles frutales', CTA_Secundario: 'Solicitar catálogo',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Julio a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Plantas & Semillas', Subtema: 'Semillas',
    URL_Slug: 'blog/semillas-siembra-agosto-otono',
    Padre_Interlinking: 'plantas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Guía Estacional: Siembra de otoño',
    Contexto_Local_Regional: 'Barcelona',
    Angulo_Enfoque_Sugerido: 'Qué sembrar en agosto para tener cosecha otoñal: calendarios por zona climática',
    Keyword_Principal: 'semillas siembra agosto Barcelona',
    Vol_Busquedas: 140, Marcas_Autoridad: 'Batlle, Seminis, Syngenta',
    Intencion_Funnel: 'EDUCACIONAL',
    Email_OptIn: 'SÍ (Calendario de siembra)',
    CTA_Primario: 'Ver catálogo de semillas', CTA_Secundario: 'Descargar calendario',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Julio a Septiembre',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Jardinería', Subtema: 'Preparación otoño',
    URL_Slug: 'blog/preparar-jardin-para-otono',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Guía de Temporada: Preparación otoñal',
    Contexto_Local_Regional: 'Zaragoza',
    Angulo_Enfoque_Sugerido: 'Pasos clave en septiembre para que el jardín supere el invierno sin daños',
    Keyword_Principal: 'preparar jardín para el otoño',
    Vol_Busquedas: 200, Marcas_Autoridad: 'Husqvarna, Stihl, Gardena',
    Intencion_Funnel: 'INFORMACIONAL',
    Email_OptIn: 'SÍ (Guía de preparación otoñal)',
    CTA_Primario: 'Ver herramientas de poda', CTA_Secundario: 'Unirse a newsletter',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  // ── Evergreen — fill remaining slots ──────────────────────────────────────
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Productos & Tienda', Subtema: 'Motosierras',
    URL_Slug: 'blog/como-elegir-mejor-motosierra',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 1: Estructura Comparativa Premium (Vs)',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Potencia vs peso: cómo elegir motosierra para uso doméstico o profesional',
    Keyword_Principal: 'cómo elegir motosierra jardín',
    Vol_Busquedas: 530, Marcas_Autoridad: 'Stihl, Husqvarna, Oregon',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'NO',
    CTA_Primario: 'Ver catálogo de motosierras', CTA_Secundario: 'Comparar modelos',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Guías Básicas', Subtema: 'Herramientas básicas',
    URL_Slug: 'blog/herramientas-basicas-jardineria',
    Padre_Interlinking: 'guias/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Guía básica de jardinería',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'El kit mínimo de 10 herramientas que necesita todo jardinero principiante',
    Keyword_Principal: 'herramientas básicas jardinería principiantes',
    Vol_Busquedas: 870, Marcas_Autoridad: 'Fiskars, Gardena, Niwaki',
    Intencion_Funnel: 'INFORMACIONAL',
    Email_OptIn: 'SÍ (Checklist de herramientas)',
    CTA_Primario: 'Ver kit de iniciación', CTA_Secundario: 'Descargar checklist gratuita',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Comparativas', Subtema: 'Cortasetos',
    URL_Slug: 'comparativas/cortasetos-electrico-vs-gasolina',
    Padre_Interlinking: 'comparativas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 1: Estructura Comparativa Premium (Vs)',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Cortasetos eléctrico vs gasolina: cuál conviene según el tamaño del seto',
    Keyword_Principal: 'cortasetos eléctrico vs gasolina',
    Vol_Busquedas: 410, Marcas_Autoridad: 'Stihl, Bosch, Makita, Husqvarna',
    Intencion_Funnel: 'EDUCACIONAL',
    Email_OptIn: 'NO',
    CTA_Primario: 'Ver cortasetos disponibles', CTA_Secundario: 'Consultar con un experto',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Guías Básicas', Subtema: 'Compost',
    URL_Slug: 'blog/como-hacer-compost-en-casa',
    Padre_Interlinking: 'guias/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Tutorial paso a paso: compostaje doméstico',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Guía completa para hacer compost de calidad con restos de cocina y jardín',
    Keyword_Principal: 'cómo hacer compost en casa fácil',
    Vol_Busquedas: 690, Marcas_Autoridad: 'Garantia, Graf, Juwel',
    Intencion_Funnel: 'EDUCACIONAL',
    Email_OptIn: 'SÍ (Guía de compostaje)',
    CTA_Primario: 'Ver compostadores', CTA_Secundario: 'Descargar guía PDF',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Comparativas', Subtema: 'Iluminación solar',
    URL_Slug: 'comparativas/iluminacion-solar-jardin',
    Padre_Interlinking: 'comparativas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 1: Estructura Comparativa Premium (Vs)',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Iluminación solar para jardín: comparativa de las 10 mejores marcas en 2026',
    Keyword_Principal: 'mejor iluminación solar jardín 2026',
    Vol_Busquedas: 360, Marcas_Autoridad: 'Philips Hue, Innr, Ring Solar',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'NO',
    CTA_Primario: 'Ver iluminación solar', CTA_Secundario: 'Ver oferta del mes',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Productos & Tienda', Subtema: 'Poda profesional',
    URL_Slug: 'blog/herramientas-poda-profesional',
    Padre_Interlinking: 'blog/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Plantilla 2: Guía de Compra Transaccional',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Las 7 herramientas de poda que usan los jardineros profesionales',
    Keyword_Principal: 'herramientas poda profesional jardín',
    Vol_Busquedas: 225, Marcas_Autoridad: 'Felco, Fiskars, ARS, Corona',
    Intencion_Funnel: 'TRANSACCIONAL',
    Email_OptIn: 'NO',
    CTA_Primario: 'Ver herramientas de poda', CTA_Secundario: 'Ver pack profesional',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Guías Básicas', Subtema: 'Abonos',
    URL_Slug: 'blog/mejores-abonos-plantas-guia',
    Padre_Interlinking: 'guias/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Guía: Abonado y nutrición vegetal',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Los mejores abonos para cada tipo de planta: orgánicos, minerales y líquidos',
    Keyword_Principal: 'mejores abonos para plantas jardín',
    Vol_Busquedas: 440, Marcas_Autoridad: 'Compo, Flower, BioBizz, Plagron',
    Intencion_Funnel: 'INFORMACIONAL',
    Email_OptIn: 'SÍ (Calendario de abonado)',
    CTA_Primario: 'Ver abonos disponibles', CTA_Secundario: 'Descargar calendario',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
  {
    Estacionalidad: 'Evergreen',
    Mes: '', Fecha_Publicacion: '',
    Silo: 'Comparativas', Subtema: 'Maceteros',
    URL_Slug: 'blog/maceteros-grandes-terraza-tendencias',
    Padre_Interlinking: 'comparativas/',
    Formato_Distribucion: 'Blog Post',
    Plantilla_ID: 'Tendencias: Decoración exterior 2026',
    Contexto_Local_Regional: 'Nacional',
    Angulo_Enfoque_Sugerido: 'Maceteros grandes para terraza: materiales y estilos que marcan tendencia en 2026',
    Keyword_Principal: 'maceteros grandes terraza tendencias 2026',
    Vol_Busquedas: 185, Marcas_Autoridad: 'Elho, Ikea Outdoor, Vondom',
    Intencion_Funnel: 'TENDENCIAS',
    Email_OptIn: 'NO',
    CTA_Primario: 'Ver colección de maceteros', CTA_Secundario: 'Solicitar lookbook',
    Estado_Publicado: false, Estado_Planner: 'PLANIFICADO',
  },
];

// ── Algorithm utilities ───────────────────────────────────────────────────────

const DAY_NAME_TO_IDX: Record<string, number> = {
  domingo: 0, lunes: 1, martes: 2, miercoles: 3, 'miércoles': 3,
  jueves: 4, viernes: 5, sabado: 6, 'sábado': 6,
};

function toDateStr(d: Date): string {
  const y  = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const dy = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${dy}`;
}

function generateDeadlineDates(
  start: Date,
  end: Date,
  dias: readonly string[],
): string[] {
  const targets = dias
    .map(d => DAY_NAME_TO_IDX[d.toLowerCase()])
    .filter((d): d is number => d !== undefined);
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    if (targets.includes(cur.getDay())) dates.push(toDateStr(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function isSeasonalMatch(estacionalidad: string): boolean {
  const l = estacionalidad.toLowerCase();
  if (l === 'evergreen') return false;
  return (
    l.includes('julio') || l.includes('agosto') || l.includes('septiembre') ||
    l.includes('junio') || l.includes('verano') ||
    (l.includes('abril') && l.includes('septiembre')) ||
    (l.includes('junio') && l.includes('agosto')) ||
    (l.includes('julio') && l.includes('septiembre'))
  );
}

function generateQuarterlyPlan(): PlannerItem[] {
  const dates    = generateDeadlineDates(WINDOW_START, WINDOW_END, MOCK_CLIENT.dias_publicacion);
  const seasonal = CONTENT_POOL.filter(c => isSeasonalMatch(c.Estacionalidad));
  const evergrn  = CONTENT_POOL.filter(c => !isSeasonalMatch(c.Estacionalidad));
  const ordered  = [...seasonal, ...evergrn];
  const count    = Math.min(dates.length, ordered.length);
  return dates.slice(0, count).map((date, i) => {
    const tpl = ordered[i];
    const d   = new Date(`${date}T00:00:00`);
    return {
      ...tpl,
      id:             `auto-${date}-${i}`,
      deadline_date:  date,
      origen:         'automatizacion' as const,
      Mes:            d.toLocaleDateString('es-ES', { month: 'long' }),
      Fecha_Publicacion: date,
    };
  });
}

function getUrgency(deadline: string): 'urgente' | 'proximo' | null {
  if (!deadline) return null;
  const dl   = new Date(`${deadline}T00:00:00`);
  const diff = Math.ceil((dl.getTime() - SIM_TODAY.getTime()) / 86_400_000);
  if (diff <= 3) return 'urgente';
  if (diff <= 7) return 'proximo';
  return null;
}

// ── CSV helpers ───────────────────────────────────────────────────────────────

function parseDateDMY(dmy: string): string {
  const p = dmy.split('/');
  if (p.length === 3) return `${p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
  return dmy;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; }
    else if (ch === ',' && !inQ) { result.push(cur.trim()); cur = ''; }
    else { cur += ch; }
  }
  result.push(cur.trim());
  return result;
}

function parseCSV(text: string): PlannerItem[] {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  const rows: PlannerItem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = parseCSVLine(lines[i]);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => { obj[h.trim()] = vals[idx] ?? ''; });
    const raw      = obj['Fecha_Publicacion'] ?? '';
    const deadline = raw.includes('/') ? parseDateDMY(raw) : raw;
    rows.push({
      id:                      `csv-${Date.now()}-${i}`,
      Estacionalidad:          obj['Estacionalidad'] ?? '',
      Mes:                     obj['Mes'] ?? '',
      Fecha_Publicacion:       raw,
      Silo:                    obj['Silo'] ?? '',
      Subtema:                 obj['Subtema'] ?? '',
      URL_Slug:                obj['URL_Slug'] ?? '',
      Padre_Interlinking:      obj['Padre_Interlinking'] ?? '',
      Formato_Distribucion:    obj['Formato_Distribucion'] ?? 'Blog Post',
      Plantilla_ID:            obj['Plantilla_ID'] ?? '',
      Contexto_Local_Regional: obj['Contexto_Local_Regional'] ?? '',
      Angulo_Enfoque_Sugerido: obj['Angulo_Enfoque_Sugerido'] ?? '',
      Keyword_Principal:       obj['Keyword_Principal'] ?? '',
      Vol_Busquedas:           parseInt(obj['Vol_Busquedas'] ?? '0', 10) || 0,
      Marcas_Autoridad:        obj['Marcas_Autoridad'] ?? '',
      Intencion_Funnel:        obj['Intencion_Funnel'] ?? 'INFORMACIONAL',
      Email_OptIn:             obj['Email_OptIn'] ?? '',
      CTA_Primario:            obj['CTA_Primario'] ?? '',
      CTA_Secundario:          obj['CTA_Secundario'] ?? '',
      Estado_Publicado:        obj['Estado_Publicado']?.toLowerCase() === 'true',
      Estado_Planner:          obj['Estado_Planner'] ?? 'PLANIFICADO',
      deadline_date:           deadline,
      origen:                  'automatizacion',
    });
  }
  return rows;
}

// ── Generator bridge ──────────────────────────────────────────────────────────

function mapFormato(formato: string): Record<string, boolean> {
  const map: Record<string, string> = {
    'Blog Post': 'blog', Blog: 'blog', Email: 'email',
    LinkedIn: 'social_linkedin', Instagram: 'social_instagram',
    WhatsApp: 'whatsapp', PDF: 'pdf', Newsletter: 'email',
  };
  return { [map[formato] ?? 'blog']: true };
}

function mapPlantillaToContentType(plantilla: string): ContentType {
  const l = plantilla.toLowerCase();
  if (l.includes('comparativa')) return 'comparativa';
  if (l.includes('guía') || l.includes('guia')) return 'guia_completa';
  if (l.includes('tutorial')) return 'tutorial';
  if (l.includes('tips')) return 'tips_trucos';
  if (l.includes('tendencias')) return 'tendencias';
  if (l.includes('caso')) return 'caso_estudio';
  return 'guia_completa';
}

function extractSubtitulo(plantilla: string): string {
  const idx = plantilla.indexOf(':');
  return idx >= 0 ? plantilla.slice(idx + 1).trim() : plantilla;
}

// ── Sort helper ───────────────────────────────────────────────────────────────

function sortByDeadline(items: PlannerItem[]): PlannerItem[] {
  return [...items].sort((a, b) => {
    if (!a.deadline_date) return 1;
    if (!b.deadline_date) return -1;
    return a.deadline_date.localeCompare(b.deadline_date);
  });
}

// ── Badge sub-components ──────────────────────────────────────────────────────

function FunnelBadge({ intent }: { intent: string }) {
  const isTransac = intent === 'TRANSACCIONAL';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
      isTransac ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
    }`}>
      {intent}
    </span>
  );
}

function OrigenBadge({ origen }: { origen: PlannerItem['origen'] }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
      origen === 'manual'
        ? 'bg-violet-100 text-violet-700'
        : 'bg-slate-100 text-slate-500'
    }`}>
      {origen === 'manual' ? <Plus size={9} /> : <Sparkles size={9} />}
      {origen === 'manual' ? 'Manual' : 'Auto'}
    </span>
  );
}

function UrgencyBadge({ urgency }: { urgency: 'urgente' | 'proximo' }) {
  return urgency === 'urgente' ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600">
      <AlertCircle size={9} /> Urgente
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-600">
      <Clock size={9} /> Próximo
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PlannerTestView() {
  const router = useRouter();
  const { selectedClient } = useGenerator();

  const [plannerData,   setPlannerData]   = useState<PlannerItem[]>([]);
  const [expandedId,    setExpandedId]    = useState<string | null>(null);
  const [activeTab,     setActiveTab]     = useState<PlannerTab>('automatizacion');
  const [monthFilter,   setMonthFilter]   = useState<MonthFilter>(0);
  const [isDragOver,    setIsDragOver]    = useState(false);
  const [csvLoaded,     setCsvLoaded]     = useState(false);
  const [csvFileName,   setCsvFileName]   = useState('');
  const [manualForm,    setManualForm]    = useState<ManualFormData>(EMPTY_FORM);
  const [planGenerated, setPlanGenerated] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasClient = !!selectedClient;

  // ── Derived state (no sort in render) ─────────────────────────────────────
  const filteredData = useMemo(() => {
    if (monthFilter === 0) return plannerData;
    return plannerData.filter(row => {
      if (!row.deadline_date) return false;
      return new Date(`${row.deadline_date}T00:00:00`).getMonth() + 1 === monthFilter;
    });
  }, [plannerData, monthFilter]);

  const stats = useMemo(() => ({
    total:    plannerData.length,
    auto:     plannerData.filter(r => r.origen === 'automatizacion').length,
    manual:   plannerData.filter(r => r.origen === 'manual').length,
    volTotal: plannerData.reduce((s, r) => s + r.Vol_Busquedas, 0),
  }), [plannerData]);

  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = { 7: 0, 8: 0, 9: 0 };
    plannerData.forEach(r => {
      if (!r.deadline_date) return;
      const m = new Date(`${r.deadline_date}T00:00:00`).getMonth() + 1;
      if (m in counts) counts[m]++;
    });
    return counts;
  }, [plannerData]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(() => {
    setPlannerData(sortByDeadline(generateQuarterlyPlan()));
    setPlanGenerated(true);
    setMonthFilter(0);
    setExpandedId(null);
  }, []);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        setPlannerData(prev => sortByDeadline([...prev, ...parsed]));
        setCsvFileName(file.name);
        setCsvLoaded(true);
        setActiveTab('automatizacion');
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const handleAddManual = useCallback(() => {
    if (!manualForm.keyword.trim() || !manualForm.deadline_date) return;
    const slug = manualForm.keyword
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    const d = new Date(`${manualForm.deadline_date}T00:00:00`);
    const newItem: PlannerItem = {
      id:                      `manual-${Date.now()}`,
      deadline_date:           manualForm.deadline_date,
      origen:                  'manual',
      Estacionalidad:          'Manual',
      Mes:                     d.toLocaleDateString('es-ES', { month: 'long' }),
      Fecha_Publicacion:       manualForm.deadline_date,
      Silo:                    manualForm.silo.trim() || 'Sin Silo',
      Subtema:                 '',
      URL_Slug:                `blog/${slug}`,
      Padre_Interlinking:      'blog/',
      Formato_Distribucion:    'Blog Post',
      Plantilla_ID:            'Manual',
      Contexto_Local_Regional: '',
      Angulo_Enfoque_Sugerido: manualForm.angulo.trim(),
      Keyword_Principal:       manualForm.keyword.trim(),
      Vol_Busquedas:           0,
      Marcas_Autoridad:        '',
      Intencion_Funnel:        'INFORMACIONAL',
      Email_OptIn:             'NO',
      CTA_Primario:            '',
      CTA_Secundario:          '',
      Estado_Publicado:        false,
      Estado_Planner:          'PLANIFICADO',
    };
    setPlannerData(prev => sortByDeadline([...prev, newItem]));
    setManualForm(EMPTY_FORM);
    setActiveTab('automatizacion');
    setMonthFilter(0);
  }, [manualForm]);

  const handleRedactar = useCallback((row: PlannerItem) => {
    const payload: FormDataInjection = {
      selectedFormats:       mapFormato(row.Formato_Distribucion),
      keywordsSeleccionadas: [row.Keyword_Principal],
      propuestaElegida: {
        titulo:          row.Angulo_Enfoque_Sugerido,
        metaTitle:       `${row.Keyword_Principal} | ${row.Contexto_Local_Regional || 'Nacional'}`,
        metaDescription: row.Angulo_Enfoque_Sugerido,
      },
      contentType:        mapPlantillaToContentType(row.Plantilla_ID),
      subtitle:           extractSubtitulo(row.Plantilla_ID),
      targetStep:         7,
      geoCiudad:          row.Contexto_Local_Regional,
      isLocalSEO:         !!row.Contexto_Local_Regional && row.Contexto_Local_Regional.toLowerCase() !== 'nacional',
      seoSlug:            row.URL_Slug,
      internalLink1:      row.Padre_Interlinking,
      marcasAutoridadGEO: row.Marcas_Autoridad,
      angulosEnfoque:     row.Angulo_Enfoque_Sugerido,
      ctasYOptins: {
        primario:   row.CTA_Primario,
        secundario: row.CTA_Secundario,
        optin:      row.Email_OptIn,
      },
    };
    sessionStorage.setItem('planner-injection', JSON.stringify(payload));
    sessionStorage.setItem('planner-source', 'true');
    router.push('/generators');
  }, [router]);

  const toggleRow = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  // ── Month filter buttons ──────────────────────────────────────────────────
  const monthButtons: { label: string; value: MonthFilter }[] = [
    { label: 'Todos', value: 0 },
    { label: 'Julio', value: 7 },
    { label: 'Agosto', value: 8 },
    { label: 'Septiembre', value: 9 },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ background: 'linear-gradient(135deg, #4aa87a, #2d7a58)' }}>
              <CalendarDays size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900">Planificador Trimestral</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 uppercase tracking-wide">
                  MODO TEST
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {MOCK_CLIENT.name} · {MOCK_CLIENT.posts_por_semana} posts/sem ·{' '}
                {MOCK_CLIENT.dias_publicacion.join(' & ')} ·{' '}
                {planGenerated
                  ? `Ventana Jul–Sep 2026 · ${plannerData.length} piezas`
                  : csvLoaded ? `CSV: ${csvFileName}` : 'Sin plan generado aún'}
              </p>
            </div>
          </div>
          <ClientSelectorChip />
        </div>
      </div>

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex gap-6 flex-shrink-0 justify-end">
        {[
          { label: 'Total piezas',   value: stats.total },
          { label: 'Automáticas',    value: stats.auto },
          { label: 'Manuales',       value: stats.manual },
          { label: 'Vol. búsquedas', value: stats.volTotal },
        ].map(s => (
          <div key={s.label} className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-slate-900">{s.value.toLocaleString('es-ES')}</span>
            <span className="text-xs text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-6 flex gap-1 flex-shrink-0">
        {([
          { key: 'automatizacion' as PlannerTab, label: '🪄 Automatización Trimestral' },
          { key: 'manual'         as PlannerTab, label: '✏️ Inserción Manual' },
          { key: 'csv'            as PlannerTab, label: '📁 Cargar CSV' },
        ] as const).map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px whitespace-nowrap"
              style={isActive
                ? { color: '#4aa87a', borderColor: '#4aa87a' }
                : { color: '#94a3b8', borderColor: 'transparent' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-4 pb-2 flex-shrink-0" style={{ minHeight: '80px' }}>

        {/* Tab 1: Automatización Trimestral */}
        {activeTab === 'automatizacion' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all"
                style={{ backgroundColor: '#4aa87a', color: '#fff' }}
              >
                <Sparkles size={16} />
                {planGenerated ? 'Regenerar Plan Jul–Sep 2026' : 'Generar Plan Jul–Sep 2026'}
              </button>
              {planGenerated && (
                <span className="text-xs text-slate-400">
                  {stats.auto} automáticas · {stats.manual} manuales
                </span>
              )}
            </div>
            {!hasClient && (
              <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>Selecciona un cliente antes de redactar para que la inyección funcione correctamente.</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Inserción Manual */}
        {activeTab === 'manual' && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Plus size={14} className="text-violet-500" />
              <span className="text-sm font-semibold text-slate-700">Añadir Post Manual</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Keyword Principal *
                </label>
                <input
                  type="text"
                  value={manualForm.keyword}
                  onChange={e => setManualForm(f => ({ ...f, keyword: e.target.value }))}
                  placeholder="e.g. guantes jardinería impermeables"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#4aa87a]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Silo de Destino
                </label>
                <input
                  type="text"
                  value={manualForm.silo}
                  onChange={e => setManualForm(f => ({ ...f, silo: e.target.value }))}
                  placeholder="e.g. Productos & Tienda"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#4aa87a]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Ángulo de Enfoque
                </label>
                <input
                  type="text"
                  value={manualForm.angulo}
                  onChange={e => setManualForm(f => ({ ...f, angulo: e.target.value }))}
                  placeholder="e.g. Guantes que repelen agua para jardinería intensa"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#4aa87a]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Deadline * (ventana Jul–Sep 2026)
                </label>
                <input
                  type="date"
                  value={manualForm.deadline_date}
                  min={WINDOW_MIN}
                  max={WINDOW_MAX}
                  onChange={e => setManualForm(f => ({ ...f, deadline_date: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-[#4aa87a]"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAddManual}
                disabled={!manualForm.keyword.trim() || !manualForm.deadline_date}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#4aa87a', color: '#fff' }}
              >
                <Plus size={14} /> Añadir a la cola
              </button>
              <button
                onClick={() => setManualForm(EMPTY_FORM)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 rounded-lg transition-all"
              >
                <X size={14} /> Limpiar
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Cargar CSV */}
        {activeTab === 'csv' && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileInput}
            />
            <div
              className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all my-1 flex flex-col items-center gap-2"
              style={{
                borderColor: isDragOver ? '#4aa87a' : '#cbd5e1',
                backgroundColor: isDragOver ? '#e8f5ee' : '#f9f9f9',
              }}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {csvLoaded ? (
                <>
                  <CheckCircle size={22} style={{ color: '#4aa87a' }} />
                  <p className="text-sm font-semibold" style={{ color: '#4aa87a' }}>
                    {csvFileName} importado · filas añadidas a la cola
                  </p>
                  <p className="text-xs text-slate-400">Clic para importar otro CSV</p>
                </>
              ) : (
                <>
                  <Upload size={22} className="text-[#6b9e80]" />
                  <p className="text-sm font-medium text-slate-700">
                    Arrastra tu CSV de planificación o{' '}
                    <span className="text-[#4aa87a] underline font-semibold">explora tus archivos</span>
                  </p>
                  <p className="text-xs text-slate-400">
                    Encabezados: Silo, Keyword_Principal, Fecha_Publicacion, Angulo_Enfoque_Sugerido…
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Month filter strip ───────────────────────────────────────────── */}
      {plannerData.length > 0 && (
        <div className="px-6 pb-2 flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-400 mr-1">Filtrar:</span>
          {monthButtons.map(btn => {
            const isActive = monthFilter === btn.value;
            const count = btn.value === 0
              ? plannerData.length
              : (monthCounts[btn.value] ?? 0);
            return (
              <button
                key={btn.value}
                onClick={() => setMonthFilter(btn.value)}
                className="px-3 py-1 text-xs font-semibold rounded-full transition-all"
                style={isActive
                  ? { backgroundColor: '#4aa87a', color: '#fff' }
                  : { backgroundColor: '#e2e8f0', color: '#64748b' }}
              >
                {btn.label}{btn.value !== 0 ? ` (${count})` : ''}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-6 pb-4">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
            <CalendarDays size={40} className="text-slate-200" />
            <p className="text-sm text-slate-400 font-medium">
              {plannerData.length === 0
                ? 'Pulsa "Generar Plan Jul–Sep 2026" para calcular los deadlines trimestrales automáticos'
                : 'No hay piezas para este mes en la ventana actual'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#e8f5ee' }} className="border-b border-slate-200">
                    {[
                      'Deadline / Entrega', 'Origen', 'Formato', 'Silo',
                      'Contexto Local', 'Keyword Principal', 'Intención', 'Acciones',
                    ].map(col => (
                      <th key={col}
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest whitespace-nowrap"
                        style={{ color: '#6b9e80' }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.flatMap(row => {
                    const isExpanded = expandedId === row.id;
                    const urgency    = getUrgency(row.deadline_date);
                    const dl         = row.deadline_date
                      ? new Date(`${row.deadline_date}T00:00:00`)
                      : null;

                    return [
                      <tr
                        key={row.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => toggleRow(row.id)}
                      >
                        {/* Deadline column */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {dl ? (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-slate-900 leading-none">
                                  {dl.getDate()}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 capitalize">
                                  {dl.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 capitalize">
                                {dl.toLocaleDateString('es-ES', { weekday: 'long' })}
                              </span>
                              {urgency && <UrgencyBadge urgency={urgency} />}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>

                        {/* Origen */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <OrigenBadge origen={row.origen} />
                        </td>

                        {/* Formato */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: '#e8f5ee', color: '#4aa87a' }}>
                            {row.Formato_Distribucion}
                          </span>
                        </td>

                        {/* Silo */}
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-800">{row.Silo}</p>
                          {row.Subtema && (
                            <p className="text-[11px] text-slate-400">{row.Subtema}</p>
                          )}
                        </td>

                        {/* Contexto */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {row.Contexto_Local_Regional ? (
                            <div className="flex items-center gap-1.5">
                              <Globe size={12} className="text-slate-400 flex-shrink-0" />
                              <span className="text-sm text-slate-700">{row.Contexto_Local_Regional}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>

                        {/* Keyword */}
                        <td className="px-4 py-3">
                          <p className="text-sm text-slate-800 font-medium max-w-[200px] leading-snug">
                            {row.Keyword_Principal}
                          </p>
                          {row.Vol_Busquedas > 0 && (
                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <TrendingUp size={10} />
                              {row.Vol_Busquedas.toLocaleString('es-ES')} búsq/mes
                            </p>
                          )}
                        </td>

                        {/* Intención */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <FunnelBadge intent={row.Intencion_Funnel} />
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => handleRedactar(row)}
                              disabled={!hasClient}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{ backgroundColor: '#4aa87a' }}
                              title={!hasClient ? 'Selecciona un cliente primero' : 'Inyectar en el Generador → Paso 7'}
                            >
                              <Zap size={13} />
                              Redactar
                            </button>
                            <button
                              onClick={() => toggleRow(row.id)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>,

                      // Detail row
                      ...(isExpanded ? [
                        <tr key={`${row.id}-detail`}>
                          <td colSpan={8} className="px-0 py-0">
                            <div
                              className="px-6 py-4 border-t grid grid-cols-2 gap-4"
                              style={{ backgroundColor: '#f4fbf7', borderColor: '#d4ece0' }}
                            >
                              <div className="flex gap-2.5">
                                <Target size={14} className="text-violet-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Ángulo / Enfoque
                                  </p>
                                  <p className="text-sm text-slate-700 leading-snug">
                                    {row.Angulo_Enfoque_Sugerido || '—'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2.5">
                                <Tag size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Marcas de Autoridad
                                  </p>
                                  <p className="text-sm text-slate-700">{row.Marcas_Autoridad || '—'}</p>
                                </div>
                              </div>
                              <div className="flex gap-2.5">
                                <MessageSquare size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    CTAs & Opt-in
                                  </p>
                                  {row.CTA_Primario && (
                                    <p className="text-xs text-slate-600">
                                      <span className="font-medium">Principal:</span> {row.CTA_Primario}
                                    </p>
                                  )}
                                  {row.CTA_Secundario && (
                                    <p className="text-xs text-slate-600">
                                      <span className="font-medium">Secundario:</span> {row.CTA_Secundario}
                                    </p>
                                  )}
                                  {row.Email_OptIn && row.Email_OptIn !== 'NO' && (
                                    <p className="text-xs text-slate-500 mt-0.5 italic">{row.Email_OptIn}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2.5">
                                <Link size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Enlazado Interno
                                  </p>
                                  <p className="text-xs text-slate-600">
                                    <span className="font-medium">Slug:</span>{' '}
                                    <code className="bg-slate-100 px-1 rounded text-slate-700">/{row.URL_Slug}</code>
                                  </p>
                                  <p className="text-xs text-slate-600 mt-0.5">
                                    <span className="font-medium">Padre:</span>{' '}
                                    <code className="bg-slate-100 px-1 rounded text-slate-700">/{row.Padre_Interlinking}</code>
                                  </p>
                                </div>
                              </div>
                              <div
                                className="col-span-2 pt-3 border-t flex items-center justify-between"
                                style={{ borderColor: '#d4ece0' }}
                              >
                                <p className="text-xs text-slate-500">
                                  <span className="font-medium text-slate-600">Plantilla:</span>{' '}
                                  {row.Plantilla_ID}
                                </p>
                                <p className="text-xs text-slate-400">
                                  Estacionalidad: {row.Estacionalidad}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>,
                      ] : []),
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info box */}
        <div
          className="mt-4 px-4 py-3 rounded-xl border text-sm flex items-start gap-2"
          style={{ backgroundColor: '#f0f9ff', borderColor: '#7dd3fc', color: '#0369a1' }}
        >
          <Zap size={14} className="flex-shrink-0 mt-0.5" />
          <span>
            <strong>Modo Test · {MOCK_CLIENT.name}:</strong> El algoritmo genera{' '}
            {MOCK_CLIENT.posts_por_semana} deadlines/semana en{' '}
            <em>{MOCK_CLIENT.dias_publicacion.join(' y ')}</em>, colocando primero los
            contenidos estacionales (Jul–Sep) y rellenando con evergreen.
            El botón <em>Redactar</em> inyecta el payload completo al Generador
            y salta directamente al <strong>paso de generación final (Paso 7)</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
