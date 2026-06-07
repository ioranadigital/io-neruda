export const TECHNICAL_AUDIT_DATA = [
  {
    id: 'seo-technical',
    icon: '🔒',
    title: 'SEO Técnico y Rastreabilidad',
    description: 'Verifica la estructura técnica y accesibilidad del sitio',
    subcategories: [
      {
        id: 'seo-basics',
        title: 'SEO Técnico',
        icon: '🧱',
        color: 'red' as const,
        checks: [
          {
            id: 'meta-title',
            title: 'Meta Title',
            status: 'pass' as const,
            description: 'Título meta presente y optimizado',
          },
          {
            id: 'meta-desc',
            title: 'Meta Description',
            status: 'pass' as const,
            description: 'Descripción meta presente',
          },
          {
            id: 'h1-tag',
            title: 'H1 Tag',
            status: 'fail' as const,
            description: 'H1 tag faltante',
          },
          {
            id: 'url-structure',
            title: 'URL Structure',
            status: 'pass' as const,
            description: 'URLs limpias y descriptivas',
          },
          {
            id: 'mobile-responsive',
            title: 'Mobile Responsive',
            status: 'pass' as const,
            description: 'Diseño responsivo',
          },
          {
            id: 'site-speed',
            title: 'Site Speed',
            status: 'warning' as const,
            description: 'Velocidad de carga moderada',
          },
          {
            id: 'xml-sitemap',
            title: 'XML Sitemap',
            status: 'pass' as const,
            description: 'Sitemap.xml presente',
          },
          {
            id: 'robots-txt',
            title: 'Robots.txt',
            status: 'pass' as const,
            description: 'Robots.txt configurado',
          },
        ],
      },
      {
        id: 'crawlability',
        title: 'Rastreabilidad',
        icon: '🕷️',
        color: 'yellow' as const,
        checks: [
          {
            id: 'canonical-tags',
            title: 'Canonical Tags',
            status: 'pass' as const,
          },
          {
            id: 'internal-links',
            title: 'Internal Links',
            status: 'pass' as const,
          },
          {
            id: 'broken-links',
            title: 'Broken Links',
            status: 'warning' as const,
          },
          {
            id: 'redirect-chains',
            title: 'Redirect Chains',
            status: 'pass' as const,
          },
          {
            id: 'noindex-pages',
            title: 'Noindex Pages',
            status: 'pass' as const,
          },
        ],
      },
    ],
  },
  {
    id: 'content-quality',
    icon: '✍️',
    title: 'Calidad del Contenido',
    description: 'Análisis de relevancia y optimización de contenido',
    subcategories: [
      {
        id: 'content-optimization',
        title: 'Optimización de Contenido',
        icon: '📝',
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
