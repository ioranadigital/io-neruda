import { Client } from '../types/client';

export const MOCK_CLIENTS: Client[] = [
  {
    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                    CLIENTE 5: SURFVINTAGE                          ║
    // ║           Tienda Online de Ropa Vintage & Artículos Surf           ║
    // ╚════════════════════════════════════════════════════════════════════╝

    // IDENTIDAD BÁSICA
    id: '5',
    name: 'Surfvintage',
    slug: 'surfvintage',
    brand_name: 'Surfvintage',
    description: 'Tienda online especializada en ropa vintage auténtica de los años 70-90 y artículos de surf clásicos. Cada pieza es cuidadosamente seleccionada por expertos en moda retro.',
    long_description: 'Surfvintage es el destino premium para amantes de la moda vintage auténtica y la cultura surf clásica. Nuestro catálogo curado incluye prendas de diseño de época, artículos de surf históricos y accesorios exclusivos. Trabajamos directamente con coleccionistas y proveedores especializados para garantizar autenticidad en cada producto. Desde nostálgicos millennials hasta coleccionistas expertos, nos especializamos en conectar personas con las piezas que definen su estilo personal.',
    business_type: 'E-Commerce | Tienda de Ropa Online Vintage',
    website_url: 'https://surfvintage.com',
    country: 'España',
    phone: '+34-912-345-678',
    email: 'contacto@surfvintage.com',
    tagline: 'Auténtico. Retro. Icónico.',

    // AUDIENCIA & MERCADO
    target_audience: 'Millennials nostálgicos, Gen-Z fashionistas, coleccionistas de vintage, surfistas clásicos, influencers de moda alternativa',
    avg_age: 28,
    income_level: 'Medio-Alto (€30k-€80k/año)',
    target_industries: ['Moda', 'Lifestyle', 'Contenido Digital', 'Entretenimiento', 'Turismo'],
    problems_solved: [
      'Dificultad para encontrar ropa vintage auténtica sin intermediarios',
      'Desconfianza sobre la autenticidad de prendas vintage',
      'Falta de catálogos curados con criterio estético',
      'Preocupación por la calidad y estado de prendas de segunda mano',
      'Necesidad de conexión con comunidad vintage'
    ],
    unique_proposition: 'Selección curada por expertos con garantía de autenticidad, cada prenda con historia y procedencia documentada, comunidad de coleccionistas, asesoría personal de estilo.',
    success_case: 'En 6 meses aumentamos ventas un 340% con estrategia de contenido narrativo sobre historia de cada pieza, colaboración con micro-influencers de moda alternativa y comunidad de coleccionistas en TikTok.',

    // MARCA & VOZ
    logo_url: 'https://surfvintage.com/logo-surfvintage.svg',
    color_primary: '#FF6B6B',
    color_secondary: '#FFD93D',
    color_palette: ['#FF6B6B', '#FFD93D', '#4ECDC4', '#1A1A1A', '#F7F7F7'],
    typography: 'Montserrat (headers) + Poppins (body)',
    brand_voice: 'Auténtico, apasionado, storyteller, accesible pero premium, nostálgico sin ser melancólico',
    brand_story: 'Surfvintage nació en 2018 cuando dos amigos apasionados por la moda de los 80 y la cultura surf se cansaron de encontrar réplicas baratas. Decidieron crear un espacio donde cada prenda tuviera una historia real, donde la autenticidad fuera garantizada y donde la pasión por lo retro fuera celebrada. Hoy somos punto de referencia para coleccionistas y amantes de la moda alternativa.',
    brand_values: [
      'Autenticidad sin compromiso',
      'Sostenibilidad a través de la moda circular',
      'Comunidad y conexión genuina',
      'Respeto por la historia y la artesanía',
      'Accesibilidad de lo premium'
    ],
    default_tone: 'friendly',
    tone_varies_by_channel: true,

    // CONTENIDO & SEO
    keywords_niche: [
      'ropa vintage',
      'moda retro',
      'prendas de los 70',
      'ropa de los 80',
      'artículos de surf clásico',
      'vintage auténtico',
      'coleccionismo de moda',
      'moda circular'
    ],
    keywords_longtail: [
      'dónde comprar ropa vintage auténtica en España',
      'chaquetas de cuero vintage de los 70 originales',
      'vaqueros retro de los 80 de diseñador',
      'camisetas de surf vintage año 90 coleccionable',
      'sudaderas retro oversize auténticas de marca',
      'cómo identificar ropa vintage falsa',
      'marcas de moda de los 70 y 80 más buscadas',
      'artículos de surf vintage con certificado de autenticidad'
    ],
    keywords_producto: [
      'chaquetas de cuero de los 70',
      'vaqueros retro de los 80',
      'camisetas surf vintage',
      'sudaderas retro oversize',
      'tablas de surf clásicas',
      'wetsuits vintage',
      'botas de bota vaquera retro',
      'cinturones y accesorios vintage'
    ],
    content_pillars: [
      'Historia de la moda retro: tendencias de los 70-90',
      'Guías de autenticidad y cómo identificar réplicas',
      'Cultura surf clásica: leyendas e iconos históricos',
      'Técnicas de cuidado y restauración de prendas vintage',
      'Perfiles de diseñadores y marcas legendarias',
      'Historias de coleccionistas y sus hallazgos más preciados',
      'Tendencias actuales inspiradas en moda vintage'
    ],
    publication_frequency: 'Diaria en Instagram (4-6 posts/day), 3-4 artículos/mes en blog, 2-3 videos/semana en TikTok, newsletter 2x/semana',
    supported_languages: ['es', 'en'],
    meta_description_template: 'Descubre {{producto}} vintage auténtico en Surfvintage. Selección curada, garantía de autenticidad, envíos rápidos. ✓ Compra segura',
    avg_word_count: 1200,

    // COMPETENCIA & POSICIONAMIENTO
    forbidden_keywords: [
      'barato',
      'copia',
      'falso',
      'imitación',
      'réplica',
      'segunda mano',
      'usado',
      'gastado',
      'dañado',
      'pirata'
    ],
    competitor_urls: [
      'https://www.vintagevibes.com',
      'https://www.retrothreads.es',
      'https://www.vintageshop.es',
      'https://www.depop.com',
      'https://www.vinted.es'
    ],
    competitor_study_urls: [
      'https://www.madewell.com/vintage',
      'https://www.rag-bone.com/en/vintage',
      'https://www.seastead.com'
    ],
    successful_content_urls: [
      'https://www.vogue.com/article/vintage-fashion-trend',
      'https://www.instagram.com/vintagetiktok',
      'https://www.youtube.com/@VintageKing'
    ],
    competitive_advantages: [
      'Autenticidad garantizada con certificado de procedencia',
      'Selección curada por expertos con criterio estético',
      'Comunidad activa de coleccionistas y apasionados',
      'Envíos rápidos con embalaje especial para prendas delicadas',
      'Política de devoluciones sin preguntas en 30 días',
      'Contenido narrativo detallado sobre historia de cada pieza',
      'Asesoramiento personal gratuito de estilo',
      'Colaboración con influencers y coleccionistas reconocidos'
    ],
    differentiators: [
      'Base de datos de autenticidad verificada',
      'Storytelling único para cada producto',
      'Comunidad exclusiva de VIP collectors',
      'Certificados digitales de autenticidad blockchain-ready'
    ],
    market_positioning: 'Tienda de referencia número 1 en España para moda vintage auténtica de calidad premium, con comunidad de coleccionistas y asesoramiento experto.',
    monitor_competitors: true,

    // CANALES & DISTRIBUCIÓN
    channel_blog: true,
    channel_email: true,
    channel_linkedin: false,
    channel_instagram: true,
    channel_twitter: false,
    channel_tiktok: true,
    channel_youtube: false,
    newsletter_enabled: true,
    newsletter_subscribers: 12500,
    social_media_handles: {
      instagram: '@surfvintage_oficial',
      tiktok: '@surfvintage.fy',
      facebook: 'SurfvintageOfficial',
      pinterest: 'Surfvintage-Vintage-Fashion'
    },
    preferred_formats: ['blog-article', 'instagram-carousel', 'tiktok-video', 'email-newsletter', 'instagram-story'],

    // REFERENCIAS & CONTEXTO
    reference_sites: [
      'https://www.thesartorialist.com',
      'https://www.highsnobiety.com',
      'https://www.hypebeast.com',
      'https://www.vogue.es'
    ],
    resources_urls: [
      'https://www.vintagetextiles.com/identify',
      'https://www.fashionhistory.fitnyc.edu',
      'https://www.smithsonianmag.com/fashion'
    ],
    internal_docs_url: 'https://drive.google.com/drive/folders/surfvintage-docs',

    // INTEGRACIONES & HERRAMIENTAS
    crm_platform: 'HubSpot',
    analytics_tool: 'Google Analytics 4 + Shopify Analytics',
    email_platform: 'ConvertKit',
    integrations: ['Shopify', 'Instagram Shopping', 'Pinterest Catalog', 'Google Merchant Center'],
    tech_stack: 'Shopify Plus, Liquid, React, Node.js, PostgreSQL',
    linkedin_connected: false,
    wordpress_connected: true,
    wordpress_url: 'https://surfvintage.com/blog',
    wordpress_username: 'admin_vintage_sv',
    publishing_integrations: [
      {
        platform: 'wordpress',
        connected: true,
        last_sync: '2026-06-09T10:30:00.000Z'
      }
    ],

    // MÉTRICAS & KPIs
    main_objective: 'Posicionarse como tienda número 1 de referencia en España para moda vintage auténtica, triplicar ventas anuales y expandir a mercado europeo.',
    main_kpi: 'AOV (valor promedio de pedido), tasa de conversión, tasa de repetición de compra, alcance en redes sociales, engagement rate',
    conversion_goal: 'Compra completada en tienda online con ticket mínimo €150',
    monthly_budget: 4500,
    team_size: 8,
    project_timeline: 'Roadmap 12 meses: Q3 2026 landing en Francia, Q4 2026 colección limitada colaborativa, 2027 flagship store en Madrid',

    // GESTIÓN & CONTACTOS
    internal_notes: 'Cliente VIP - alto engagement, comunidad leal, excelente ROI. Expandir estrategia en UGC y micro-influencers. Explorar partnerships con podcasts de moda alternativa.',
    client_status: 'active',
    start_date: '2023-03-15T00:00:00.000Z',
    next_review: '2026-07-15T00:00:00.000Z',
    primary_contact_name: 'Javier Rodríguez García',
    primary_contact_email: 'javier@surfvintage.com',
    account_manager_id: 'team_member_01',

    // SISTEMA
    is_active: true,
    created_at: '2026-06-08T00:00:00.000Z',
    updated_at: '2026-06-09T00:00:00.000Z',

    // BUYER PERSONAS COMPLETO
    buyer_personas_list: [
      {
        name: 'Nostálgico Millennial',
        description: 'Edad 25-35, profesional establecido, busca recrear looks de infancia, valora autenticidad y rareza, gasta €100-300/mes, presente en Instagram y TikTok, influenciable por storytelling'
      },
      {
        name: 'Influencer de Moda Alternativa',
        description: 'Edad 18-32, creador de contenido, compra para TikTok/Instagram, busca prendas únicas y statement pieces, presupuesto €200-800/mes, requiere exclusividad, colaboraciones potenciales'
      },
      {
        name: 'Coleccionista Experto',
        description: 'Edad 35-60, coleccionista serio, experto en épocas y marcas, busca ediciones limitadas y valor coleccionable, presupuesto €500-5000/mes, comunidad cerrada, requiere documentación'
      },
      {
        name: 'Surfista Clásico Entusiasta',
        description: 'Edad 28-45, apasionado de cultura surf, busca tablas y wetsuits vintage originales, presupuesto €150-1000/mes, presente en comunidades online de surf, valora historia del producto'
      }
    ],

    // KEYWORDS JERÁRQUICAS - ESTRUCTURA COMPLETA (6 NIVELES)
    keywords_hierarchical: {
      // NIVEL 1: Keywords de Entidad y Core
      level1_entity_core: [
        'tienda de ropa vintage online',
        'moda sostenible de segunda mano',
        'curacion de ropa retro',
        'articulos de surf clasicos',
        'coleccionismo de ropa urbana'
      ],
      level1_branded: [
        'Surfvintage',
        'Surfvintage online',
        'Surfvintage Cantabria',
        'tienda Surfvintage Gijon',
        'comunidad Surfvintage'
      ],
      level1_brand_third_party: [
        'Levi\'s vintage 501',
        'sudaderas Champion retro',
        'chaquetas Carhartt antiguas',
        'tablas de surf Lightning Bolt',
        'camisetas Quiksilver 90s'
      ],
      level1_niche_sector: [
        'ropa vintage de los 80',
        'sudaderas retro de los 90',
        'chaquetas de cuero de los 70',
        'camisetas de surf clasicas',
        'tablas de surf single-fin'
      ],
      // NIVEL 2: Keywords de Segmentación
      level2_local: [
        'tienda de ropa vintage en Gijon',
        'comprar chaquetas retro en Santander',
        'tablas de surf clasicas en Galicia',
        'ropa de surf vintage en Asturias',
        'camisetas retro en A Coruña'
      ],
      level2_audience_profile: [
        'ropa vintage oversize para estilo urbano',
        'sudaderas de surf comodas para despues de surfear',
        'chaquetas de cuero moteras para amantes de lo retro',
        'tablas de surf clasicas para surfistas de tablon',
        'vaqueros vintage de cintura alta para estetica 80s'
      ],
      // NIVEL 3: Keywords Informacionales y Editoriales
      level3_educational_howto: [
        'como saber si una prenda Levi\'s es vintage original',
        'como lavar y cuidar chaquetas de cuero de los 70',
        'como quitar manchas en sudaderas blancas de los 90',
        'como elegir los litros de una tabla de surf clasica',
        'como identificar el año de una camiseta retro por la etiqueta'
      ],
      level3_problem_symptom: [
        'como arreglar una cremallera atascada en chaqueta antigua',
        'olor a humedad en ropa vintage como quitarlo',
        'cuero agrietado o reseco como restaurarlo',
        'reparar un toque de resina en tabla de surf clasica',
        'vaqueros rigidos que quedan muy duros como ablandarlos'
      ],
      level3_seasonal: [
        'sudaderas de surf abrigadas para las noches de verano',
        'chaquetas de pana y cuero para el otoño en el norte',
        'camisetas surferas ligeras para temporada de olas',
        'look retro festivalero para eventos de verano',
        'ropa de abrigo vintage para el invierno cantabrico'
      ],
      // NIVEL 4: Keywords de Investigación Comercial
      level4_comparative_vs: [
        'ropa vintage de los 80 vs los 90 diferencias',
        'Levi\'s 501 vintage vs edicion moderna',
        'tabla de surf single-fin vs twin-fin sensaciones',
        'chaqueta de cuero biker vs chaqueta aviador retro',
        'algodon vintage americano vs algodon industrial actual'
      ],
      level4_lists_roundups: [
        'las 5 mejores marcas de sudaderas retro de los 90',
        'mejores tiendas online de ropa surf vintage',
        'chaquetas de cuero mas iconicas del cine de los 70',
        'marcas de tablas de surf clasicas que hicieron historia',
        'mejores vaqueros de corte retro para mujer'
      ],
      level4_review_opinions: [
        'analisis de calidad vaqueros Levi\'s 501 de los 80',
        'review de durabilidad sudaderas Champion Reverse Weave',
        'opiniones sobre tablas de surf retro single-fin',
        'analisis de autenticidad etiquetas Carhartt antiguas',
        'valoracion chaquetas de flecos estilo setentero'
      ],
      // NIVEL 5: Keywords de Larga Cola
      level5_longtail_informational: [
        'que significa el sello red tab en vaqueros levi\'s antiguos',
        'peso ideal de una sudadera vintage de algodon pesado',
        'como guardar chaquetas de cuero antiguas para que no huelan',
        'historia del logo original de las marcas de surf de los 80',
        'diferencia entre una reproduccion retro y una prenda vintage original'
      ],
      level5_longtail_transactional: [
        'donde comprar chaquetas de cuero de los 70 autenticas',
        'comprar sudaderas de surf de los 90 americanas',
        'vaqueros levi\'s 501 vintage de segunda mano tallas reales',
        'comprar tabla de surf retro single-fin restaurada',
        'comprar camisetas de marcas de surf clasicas online'
      ],
      // NIVEL 6: Exclusiones y Restricciones
      level6_banned_words: [
        'en el ecosistema actual',
        'imperdible',
        'fascinante',
        'innovador',
        'revolucionario'
      ],
      level6_banned_tones: [
        'fast-fashion corporativo',
        'juvenil forzado',
        'demasiado comercial',
        'robotico de catalogo',
        'sensacionalista'
      ],
      level6_competing_keywords: [
        'Amazon ropa vintage barata',
        'Mercado Libre prendas usadas',
        'eBay vaqueros retro',
        'Vinted prendas de segunda mano',
        'Depop sudaderas vintage falsas'
      ]
    },
  },

  {
    // ╔════════════════════════════════════════════════════════════════════╗
    // ║                      CLIENTE 6: ESGARDEN                           ║
    // ║     Tienda Online de Plantas, Barbacoas y Piscinas Desmontables    ║
    // ╚════════════════════════════════════════════════════════════════════╝

    // IDENTIDAD BÁSICA
    id: '6',
    name: 'Esgarden',
    slug: 'esgarden',
    brand_name: 'Esgarden',
    description: 'Tienda online especializada en soluciones premium para jardines, terrazas y espacios exteriores. Barbacoas profesionales, plantas de exterior resistentes y piscinas desmontables de gama alta.',
    long_description: 'Esgarden es el partner ideal para transformar espacios exteriores en oasis de confort y estilo. Nuestro catálogo incluye barbacoas de diseño profesional, plantas de exterior resistentes y durables, sistemas de piscinas desmontables de última generación, y mobiliario de jardín premium. Ofrecemos asesoramiento técnico gratuito, instalación profesional incluida, y garantías extendidas de hasta 5 años. Nuestros clientes varían desde propietarios particulares hasta profesionales del interiorismo y hostelería.',
    business_type: 'E-Commerce | Tienda de Artículos para Exterior y Jardinería',
    website_url: 'https://esgarden.es',
    country: 'España',
    phone: '+34-934-567-890',
    email: 'info@esgarden.es',
    tagline: 'Tu espacio exterior, elevado a premium',

    // AUDIENCIA & MERCADO
    target_audience: 'Propietarios de vivienda, gestores de comunidades, profesionales del interiorismo y paisajismo, restauradores y dueños de hostelería, constructoras, diseñadores',
    avg_age: 42,
    income_level: 'Medio-Alto a Alto (€50k-€150k+/año)',
    target_industries: ['Inmobiliario', 'Hostelería', 'Diseño', 'Construcción', 'Paisajismo', 'Hogar & Lifestyle'],
    problems_solved: [
      'Dificultad para encontrar productos de exterior de calidad premium en una única plataforma',
      'Confusión sobre qué plantas son resistentes a diferentes climas',
      'Necesidad de asesoramiento técnico para instalación y mantenimiento',
      'Búsqueda de soluciones duraderas y de bajo mantenimiento para terrazas y jardines',
      'Deseo de mejorar valor estético y funcional del hogar sin obras mayor'
    ],
    unique_proposition: 'Catálogo completamente integrado de plantas, barbacoas y piscinas con asesoramiento experto incluido, instalación profesional gratuita, garantías extendidas, y apoyo post-compra a largo plazo.',
    success_case: 'Cliente B2B de cadena de 15 hoteles rurales: implementamos solución integrada de mobiliario, plantas y barbacoas con 87% reducción de tiempo de aprovisionamiento y 23% mejora en satisfacción de huéspedes.',

    // MARCA & VOZ
    logo_url: 'https://esgarden.es/logo-esgarden.svg',
    color_primary: '#2BBF4B',
    color_secondary: '#8BC34A',
    color_palette: ['#2BBF4B', '#8BC34A', '#FFB700', '#1A4620', '#F0F8F5'],
    typography: 'Raleway (headers) + Open Sans (body)',
    brand_voice: 'Profesional pero accesible, experto confiable, orientado a soluciones, premium sin ser pretencioso, educador y asesor',
    brand_story: 'Esgarden surgió en 2015 como respuesta a un problema real: propietarios con budgets para calidad pero sin acceso a asesoramiento experto. Nuestro fundador, paisajista profesional, decidió crear una plataforma donde expertos y clientes pudieran conectar. Hoy somos partner oficial de 200+ profesionales del diseño en España.',
    brand_values: [
      'Calidad sin compromiso',
      'Asesoramiento experto y accesible',
      'Sostenibilidad y respeto ambiental',
      'Durabilidad y valor a largo plazo',
      'Experiencia del cliente excepcional'
    ],
    default_tone: 'professional',
    tone_varies_by_channel: true,

    // CONTENIDO & SEO
    keywords_niche: [
      'barbacoas',
      'mobiliario de jardín',
      'plantas de exterior',
      'piscinas desmontables',
      'accesorios para terrazas',
      'césped artificial',
      'pérgolas',
      'sistemas de riego',
      'iluminación exterior',
      'decoración de jardín'
    ],
    keywords_longtail: [
      'mejores barbacoas de gas profesionales 2024 España',
      'cómo instalar césped artificial resistente para mascotas',
      'pérgolas de madera tratada para resistencia al clima',
      'piscinas desmontables grandes para familias de 6+ personas',
      'plantas resistentes al frío para terrazas en España',
      'mobiliario de exterior de aluminio y teca resistente',
      'sistema de riego automático inteligente para jardín',
      'barbacoa portátil carbón resistente para camping',
      'guía completa mantenimiento plantas exterior todo el año',
      'iluminación LED solar para terrazas sin obras'
    ],
    keywords_producto: [
      'barbacoas de gas',
      'barbacoas de carbón portátiles',
      'piscinas desmontables para jardín',
      'plantas de exterior resistentes',
      'césped artificial para perros',
      'pérgolas retráctiles',
      'mesas y sillas de exterior',
      'sistemas de riego automático',
      'farolas y lámparas solares',
      'accesorios para barbacoa'
    ],
    content_pillars: [
      'Guías completas de mantenimiento y cuidado de jardines',
      'Tendencias en diseño exterior y arquitectura de paisaje',
      'Consejos de climatización y protección de plantas',
      'Proyectos DIY paso a paso para terrazas y jardines',
      'Comparativas de productos: qué elegir según necesidades',
      'Sostenibilidad: cómo tener un jardín eco-responsable',
      'Historias de clientes: transformaciones de espacios',
      'Entrevistas con paisajistas y diseñadores profesionales'
    ],
    publication_frequency: 'Semanal en blog (2 artículos/semana), diaria en Instagram (3-5 posts/day), 2-3 videos/mes en YouTube, newsletter 1x/semana, LinkedIn 3x/semana',
    supported_languages: ['es', 'en', 'fr'],
    meta_description_template: '{{producto}} premium para exterior | Esgarden. Asesoramiento experto, instalación incluida, garantía 5 años. ✓ Compra segura',
    avg_word_count: 1500,

    // COMPETENCIA & POSICIONAMIENTO
    forbidden_keywords: [
      'barato',
      'defectuoso',
      'mala calidad',
      'roto',
      'segunda mano',
      'usado',
      'importación ilegal',
      'falsificación',
      'sin garantía',
      'plagado'
    ],
    competitor_urls: [
      'https://www.leroymerlin.es',
      'https://www.bauhaus.es',
      'https://www.bricomart.es',
      'https://www.carrefour.es',
      'https://www.ikea.com/es',
      'https://www.botania.com'
    ],
    competitor_study_urls: [
      'https://www.renishaw.com/garden',
      'https://www.vilto.com',
      'https://www.luxeoutdoor.com',
      'https://www.royaldesign.se/outdoor'
    ],
    successful_content_urls: [
      'https://www.arquitecturaydiseno.es',
      'https://www.casaviva.es',
      'https://www.youtube.com/@DesignScenesTV',
      'https://www.instagram.com/interiorismo.es'
    ],
    competitive_advantages: [
      'Mejor relación precio-calidad en gama premium de España',
      'Instalación profesional gratuita incluida en compras',
      'Garantía extendida de hasta 5 años en productos',
      'Asesoramiento técnico gratuito post-compra ilimitado',
      'Stock garantizado de los 100 productos más buscados',
      'Red de instaladores profesionales verificados',
      'Financiación flexible sin intereses hasta 24 meses',
      'Program de mantenimiento anual optional'
    ],
    differentiators: [
      'Ecosistema integrado: plantas, mobiliario, sistemas de riego, iluminación',
      'Equipo de paisajistas in-house para asesoramiento',
      'Simulador 3D online para visualizar proyectos',
      'Certificación en plantas resistentes y durabilidad',
      'Partnership con marcas premium europeas'
    ],
    market_positioning: 'Especialista número 1 en España en soluciones premium e integradas para jardines y espacios exteriores, con asesoramiento experto profesional y servicio post-venta excepcional.',
    monitor_competitors: true,

    // CANALES & DISTRIBUCIÓN
    channel_blog: true,
    channel_email: true,
    channel_linkedin: true,
    channel_instagram: true,
    channel_twitter: false,
    channel_tiktok: false,
    channel_youtube: true,
    newsletter_enabled: true,
    newsletter_subscribers: 34200,
    social_media_handles: {
      instagram: '@esgarden_oficial',
      youtube: 'EsgardenTV',
      linkedin: 'company/esgarden-spain',
      facebook: 'EsgardenEspana',
      pinterest: 'EsgardenDesign'
    },
    preferred_formats: ['blog-article', 'video-tutorial', 'instagram-reel', 'youtube-long-form', 'email-newsletter', 'linkedin-article'],

    // REFERENCIAS & CONTEXTO
    reference_sites: [
      'https://www.gardenersworld.com',
      'https://www.architecturaldigest.com',
      'https://www.designweek.co.uk',
      'https://www.ellehogar.com'
    ],
    resources_urls: [
      'https://www.rhs.org.uk/plants',
      'https://www.paisajistas.net',
      'https://www.botanicaonline.com',
      'https://www.foreststewardshipcouncil.org'
    ],
    internal_docs_url: 'https://drive.google.com/drive/folders/esgarden-resources',

    // INTEGRACIONES & HERRAMIENTAS
    crm_platform: 'Salesforce Commerce Cloud',
    analytics_tool: 'Google Analytics 4 + Adobe Analytics',
    email_platform: 'Mailchimp Premium',
    integrations: ['WooCommerce', 'Shopify', 'Pinterest Ads', 'Google Ads', 'LinkedIn Ads', 'Stripe', 'PayPal'],
    tech_stack: 'WooCommerce, WordPress, React, Node.js, MySQL, AWS',
    linkedin_connected: true,
    linkedin_profile_id: 'company/esgarden-spain',
    wordpress_connected: true,
    wordpress_url: 'https://esgarden.es/blog',
    wordpress_username: 'admin_esgarden_main',
    publishing_integrations: [
      {
        platform: 'wordpress',
        connected: true,
        last_sync: '2026-06-09T09:15:00.000Z'
      },
      {
        platform: 'linkedin',
        connected: true,
        last_sync: '2026-06-09T08:45:00.000Z'
      }
    ],

    // MÉTRICAS & KPIs
    main_objective: 'Aumentar ventas en 150% YoY, expandir mercado a Portugal y Francia, posicionarse como referencia europea en soluciones exterior premium integradas.',
    main_kpi: 'Ticket promedio de pedido (AOV), tasa de conversión, LTV (lifetime value), NPS (Net Promoter Score), tasa de clientes recurrentes B2B',
    conversion_goal: 'Compra completada online O solicitud de asesoramiento profesional para proyecto',
    monthly_budget: 8500,
    team_size: 28,
    project_timeline: 'Roadmap 18 meses: Q3 2026 app móvil, Q4 2026 programa de afiliados profesionales, Q2 2027 marketplace de paisajistas certificados',

    // GESTIÓN & CONTACTOS
    internal_notes: 'Cliente estratégico - ingresos anuales €2M+. Fuerte presencia B2B. Requiere contenido especializado y SEO técnico avanzado. Oportunidad: webinars educativos para profesionales. Explorar partnerships con asociaciones de paisajistas.',
    client_status: 'active',
    start_date: '2021-09-20T00:00:00.000Z',
    next_review: '2026-08-20T00:00:00.000Z',
    primary_contact_name: 'María Elena Domínguez López',
    primary_contact_email: 'maria@esgarden.es',
    account_manager_id: 'team_member_02',

    // SISTEMA
    is_active: true,
    created_at: '2026-06-08T00:00:00.000Z',
    updated_at: '2026-06-09T00:00:00.000Z',

    // BUYER PERSONAS COMPLETO
    buyer_personas_list: [
      {
        name: 'Propietario de Casa Premium',
        description: 'Edad 38-55, con casa propia de €400k+, busca mejorar y embellecer jardín/terraza, presupuesto €3k-€15k/proyecto, valora calidad y longevidad, presente en Redes (Facebook, Pinterest), influenciable por fotografías antes/después'
      },
      {
        name: 'Gestor de Comunidad Residencial',
        description: 'Edad 45-65, responsable de espacios comunes en fincas, requiere proveedores B2B, presupuesto €10k-€50k/año, valora servicio profesional y garantías, requiere facturación y soporte técnico continuo'
      },
      {
        name: 'Profesional Interiorista / Paisajista',
        description: 'Edad 28-50, recomienda a clientes, busca catálogo pro, márgenes mayoristas, presupuesto €5k-€50k/proyecto, requiere asesoramiento técnico, certificaciones y posible partnership a largo plazo'
      },
      {
        name: 'Restaurador / Dueño Hostelería',
        description: 'Edad 35-60, equipa terrazas de bares/restaurantes, necesita durabilidad y fácil mantenimiento, presupuesto €2k-€20k/local, presiona en rentabilidad, requiere soluciones quick-install y bajo mantenimiento'
      }
    ],

    // KEYWORDS JERÁRQUICAS - ESTRUCTURA COMPLETA (6 NIVELES)
    keywords_hierarchical: {
      // NIVEL 1: Keywords de Entidad y Core
      level1_entity_core: [
        'tienda de jardineria premium',
        'articulos de exterior para el hogar',
        'equipamiento para terrazas',
        'climatizacion exterior',
        'decoracion de jardines'
      ],
      level1_branded: [
        'Esgarden',
        'Esgarden online',
        'Esgarden España',
        'tienda Esgarden',
        'opiniones Esgarden'
      ],
      level1_brand_third_party: [
        'barbacoas Weber',
        'Moretti Design estufas',
        'jacuzzis NetSpa',
        'Keter cobertizos',
        'Pariani plantas'
      ],
      level1_niche_sector: [
        'barbacoas de gas',
        'piscinas desmontables',
        'estufas de pellets',
        'cesped artificial',
        'plantas de exterior'
      ],
      // NIVEL 2: Keywords de Segmentación
      level2_local: [
        'comprar barbacoa de gas en Bilbao',
        'tienda de piscinas en Madrid',
        'estufas de pellets en Zaragoza',
        'cesped artificial en Barcelona',
        'plantas de terraza en Valencia'
      ],
      level2_audience_profile: [
        'barbacoas portatiles para terrazas pequeñas',
        'piscinas desmontables seguras para niños',
        'estufas de pellets canalizables para chalets',
        'cesped artificial resistente para perros',
        'plantas de exterior que necesitan poca agua'
      ],
      // NIVEL 3: Keywords Informacionales y Editoriales
      level3_educational_howto: [
        'como encender una barbacoa de carbon rapido',
        'como limpiar el filtro de una piscina portatil',
        'como purgar una estufa de pellets',
        'como instalar cesped artificial sobre tierra',
        'cuando podar las plantas de exterior en primavera'
      ],
      level3_problem_symptom: [
        'por que el agua de mi piscina esta verde',
        'mi estufa de pellets saca mucho humo negro',
        'por que se apaga la llama de la barbacoa de gas',
        'como quitar los hongos del cesped artificial',
        'hojas amarillas en mis plantas de terraza que hacer'
      ],
      level3_seasonal: [
        'puesta a punto de piscinas desmontables en primavera',
        'comprar barbacoas antes de semana santa',
        'mantenimiento de estufas antes del invierno',
        'plantar bulbos de otoño',
        'proteger plantas del jardin frente a heladas'
      ],
      // NIVEL 4: Keywords de Investigación Comercial
      level4_comparative_vs: [
        'barbacoa de gas vs carbon',
        'Weber Spirit E-315 vs E-325',
        'estufa de pellets vs bomba de calor',
        'piscina de acero vs pvc desmontable',
        'cesped artificial vs cesped natural costes'
      ],
      level4_lists_roundups: [
        'las 5 mejores barbacoas de gas para jardin',
        'mejores piscinas desmontables calidad precio',
        'estufas de pellets mas silenciosas del mercado',
        'plantas de exterior mas resistentes para el norte',
        'mejores accesorios para barbacoas Weber'
      ],
      level4_review_opinions: [
        'analisis tecnico Weber Spirit E-425',
        'opiniones estufa Elegance Moretti',
        'review jacuzzi NetSpa Montana',
        'analisis piscinas desmontables Intex Ultra XTR',
        'test de rendimiento de cortacesped Bosch'
      ],
      // NIVEL 5: Keywords de Larga Cola
      level5_longtail_informational: [
        'cuanto tiempo tardan en quemarse las briquetas Weber',
        'cuantos sacos de arena necesita una depuradora portatil',
        'consumo medio de kg por hora estufa de pellets',
        'como limpiar manchas de grasa en cesped artificial',
        'que tipo de tierra necesita una costilla de adan'
      ],
      level5_longtail_transactional: [
        'donde comprar recambios de parrilla para Weber Spirit',
        'comprar limpiafondos automatico para piscina desmontable barata',
        'ofertas estufas de pellets con instalacion incluida',
        'comprar rollos de cesped artificial de 40mm premium',
        'comprar abono organico para plantas de exterior online'
      ],
      // NIVEL 6: Exclusiones y Restricciones
      level6_banned_words: [
        'en conclusion',
        'es crucial',
        'sumergete',
        'imprescindible',
        'revolucionario'
      ],
      level6_banned_tones: [
        'clickbait',
        'sensacionalista',
        'spam de ventas',
        'robotico',
        'excesivamente cientifico'
      ],
      level6_competing_keywords: [
        'Amazon barbacoas baratas',
        'Leroy Merlin piscinas de obra',
        'Carrefour fundas jardin',
        'Bricodepot ofertas estufas',
        'Ikea maceteros plasticos'
      ]
    },
  },
];
