export const TECHNICAL_AUDIT_DATA = [
  {
    id: 'semantic-definition',
    icon: 'shield',
    title: 'Definición y Mapeo Semántico',
    description: 'Estructura semántica y definición de conceptos clave',
    subcategories: [],
    showSimpleFields: true,
  },
  {
    id: 'kw-definition-mapping',
    icon: 'shield',
    title: 'KW - Definición y Mapeo Semántico',
    description: 'Investigación y mapeo de palabras clave',
    subcategories: [],
    showToneSelectors: true,
  },
  {
    id: 'strategy-tone-approach',
    icon: 'shield',
    title: 'Estrategia, Tono y Enfoque (Personalidad)',
    description: 'Definición de estrategia y personalidad de contenido',
    subcategories: [],
  },
  {
    id: 'content-quality',
    icon: 'file-text',
    title: 'Formato de Salida',
    description: 'Análisis de relevancia y optimización de contenido',
    subcategories: [
      {
        id: 'content-optimization',
        title: 'Optimización de Contenido',
        icon: 'check-circle',
        color: 'green' as const,
        checks: [
          {
            id: 'keyword-density',
            title: 'Keyword Density',
            status: 'pass' as const,
          },
          {
            id: 'content-length',
            title: 'Content Length',
            status: 'pass' as const,
          },
          {
            id: 'readability',
            title: 'Readability',
            status: 'pass' as const,
          },
          {
            id: 'unique-content',
            title: 'Unique Content',
            status: 'pass' as const,
          },
          {
            id: 'keyword-placement',
            title: 'Keyword Placement',
            status: 'pass' as const,
          },
        ],
      },
    ],
  },
];
