export interface KeywordCategory {
  id: string;
  icon: string;
  level: string;
  title: string;
  items: KeywordItem[];
}

export interface KeywordItem {
  id: string;
  name: string;
  description: string;
  keywords: string[];
}

export const KEYWORD_STRUCTURE: KeywordCategory[] = [
  {
    id: 'level-1-entity',
    icon: '🏗️',
    level: 'Nivel 1: Keywords de Entidad y Core',
    title: 'Fundación del Negocio',
    items: [
      {
        id: 'entity-core',
        name: 'Keywords de Entidad y Core',
        description: 'La base del negocio. Palabras que definen qué es tu empresa y en qué mercado compite.',
        keywords: ['barbacoa', 'parrilla', 'carbón', 'accesorios barbacoa'],
      },
      {
        id: 'branded-kw',
        name: 'Keywords de Marca (Branded KW)',
        description: 'Búsquedas que incluyen directamente el nombre de tu empresa. Mayor tasa de conversión.',
        keywords: ['miempresa barbacoa', 'tienda barbacoas miempresa', 'miempresa parrillas'],
      },
      {
        id: 'third-party-brand',
        name: 'Keywords de Marca de Terceros / Fabricante',
        description: 'Términos de las marcas líderes que distribuyes. Atraen tráfico con alta intención de compra.',
        keywords: ['Weber barbacoa', 'Kamado Joe', 'Traeger pellets', 'Broil King'],
      },
      {
        id: 'niche-head',
        name: 'Keywords de Nicho / Sector (Head Terms)',
        description: 'Palabras clave genéricas de una o dos palabras que definen tus categorías maestras.',
        keywords: ['barbacoas', 'parrillas', 'accesorios jardin', 'elementos patio'],
      },
    ],
  },
  {
    id: 'level-2-segmentation',
    icon: '🗺️',
    level: 'Nivel 2: Keywords de Segmentación',
    title: 'Segmentación por Usuario',
    items: [
      {
        id: 'local-geo',
        name: 'Keywords Locales (Geo-targeted KW)',
        description: 'Palabras clave que incluyen una ubicación geográfica. Cruciales para SEO Local.',
        keywords: ['barbacoas Madrid', 'parrillas Barcelona', 'tienda barbacoas Valencia', 'accesorios jardín Bilbao'],
      },
      {
        id: 'audience-profile',
        name: 'Keywords de Audiencia / Perfil',
        description: 'Definen el tipo de usuario que consume el producto, segmentando por experiencia o necesidad.',
        keywords: ['barbacoa principiante', 'parrilla experto', 'barbacoa familiar', 'parrilla restaurante'],
      },
    ],
  },
  {
    id: 'level-3-informational',
    icon: '🎓',
    level: 'Nivel 3: Keywords Informacionales y Editoriales',
    title: 'Contenido Educativo',
    items: [
      {
        id: 'how-to',
        name: 'Keywords Educacionales / "How-to"',
        description: 'Búsquedas que empiezan por "cómo", "qué", "cuándo" o "por qué". Demuestran autoridad técnica.',
        keywords: ['cómo limpiar barbacoa', 'qué tipo de parrilla elegir', 'cómo encender carbón', 'cómo mantener parrilla'],
      },
      {
        id: 'problem-symptom',
        name: 'Keywords de Problema / Síntoma',
        description: 'El usuario detecta que algo va mal pero no sabe qué producto necesita para solucionarlo.',
        keywords: ['parrilla humo', 'barbacoa no calienta uniforme', 'carbón no enciende', 'óxido en parrilla'],
      },
      {
        id: 'seasonal',
        name: 'Keywords Estacionales',
        description: 'Búsquedas que explotan en épocas muy concretas del año. El blog debe anticiparse a ellas.',
        keywords: ['barbacoa verano', 'parrilla primavera', 'barbacoa navidad', 'accesorios jardín primavera'],
      },
    ],
  },
  {
    id: 'level-4-research',
    icon: '⚖️',
    level: 'Nivel 4: Keywords de Investigación Comercial',
    title: 'Investigación del Comprador',
    items: [
      {
        id: 'comparative',
        name: 'Keywords Comparativas ("Vs")',
        description: 'Enfrentan dos tecnologías, marcas o modelos para resolver la duda del comprador.',
        keywords: ['Weber vs Kamado', 'parrilla gas vs carbón', 'barbacoa eléctrica vs carbón', 'Traeger vs pellet'],
      },
      {
        id: 'lists-compilations',
        name: 'Keywords de Listas / Recopilatorios',
        description: 'Búsquedas que agrupan los mejores productos bajo un criterio de calidad o precio.',
        keywords: ['mejores barbacoas 2024', 'parrillas más vendidas', 'top accesorios barbacoa', 'mejores marcas parrilla'],
      },
      {
        id: 'review-opinions',
        name: 'Keywords de Review / Opiniones',
        description: 'Análisis profundos de un modelo exacto. Tráfico hiper-cualificado.',
        keywords: ['opinión Kamado Joe', 'reseña Traeger Pro', 'crítica Weber Summit', 'análisis Broil King'],
      },
    ],
  },
  {
    id: 'level-5-longtail',
    icon: '🎯',
    level: 'Nivel 5: Keywords de Larga Cola (Long-Tail KW)',
    title: 'Búsquedas Específicas',
    items: [
      {
        id: 'longtail-informational',
        name: 'Long-Tail Informacional de Nicho',
        description: 'Resuelven una duda extremadamente específica.',
        keywords: ['cómo cocinar costillas en ahumador Traeger', 'temperatura ideal pechuga barbacoa Kamado', 'mejor método limpiar parrilla acero inoxidable'],
      },
      {
        id: 'longtail-transactional',
        name: 'Long-Tail Transaccional Oculta',
        description: 'Búsquedas tan detalladas que revelan que el usuario está listo para comprar ya.',
        keywords: ['dónde comprar Kamado Joe Madrid barato', 'tienda pellets Traeger Barcelona online', 'accesorios barbacoa Weber oferta hoy'],
      },
    ],
  },
];
