export const TECHNICAL_AUDIT_DATA = [
  {
    id: 'semantic-definition',
    icon: 'shield',
    title: 'Definición y Mapeo Semántico',
    description: 'Estructura semántica y definición de conceptos clave',
    subcategories: [
      {
        id: 'content-title',
        title: 'Título del Contenido',
        icon: 'check-circle',
        color: 'red' as const,
        checks: [],
      },
      {
        id: 'url-config',
        title: 'Configuración de URL',
        icon: 'alert-circle',
        color: 'yellow' as const,
        checks: [
          {
            id: 'url-structure',
            title: 'Estructura Limpia',
            status: 'pass' as const,
          },
          {
            id: 'url-keyword',
            title: 'Keyword en URL',
            status: 'pass' as const,
          },
          {
            id: 'url-length',
            title: 'Longitud Óptima',
            status: 'pass' as const,
          },
        ],
      },
      {
        id: 'keyword-types',
        title: 'Tipos de Keywords',
        icon: 'check-circle',
        color: 'green' as const,
        checks: [
          {
            id: 'primary-keyword',
            title: 'Keyword Primaria',
            status: 'pass' as const,
          },
          {
            id: 'lsi-keywords',
            title: 'LSI Keywords',
            status: 'pass' as const,
          },
          {
            id: 'longtail-keywords',
            title: 'Longtail Keywords',
            status: 'pass' as const,
          },
          {
            id: 'semantic-keywords',
            title: 'Palabras Semánticas',
            status: 'pass' as const,
          },
          {
            id: 'keyword-variations',
            title: 'Variaciones de Keyword',
            status: 'warning' as const,
          },
        ],
      },
    ],
  },
  {
    id: 'content-quality',
    icon: 'file-text',
    title: 'Calidad del Contenido',
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
