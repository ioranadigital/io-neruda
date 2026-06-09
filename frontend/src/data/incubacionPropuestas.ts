import { Client } from '@/src/types/client';

export interface IncubacionPropuesta {
  id: string;
  badge: string;
  icon: string; // nombre del icono de lucide-react
  titulo: string;
  metaTitle: string;
  metaDescription: string;
  puntosClave: string[];
  puntosEstructura: string[];
  slug: string;
}

// PROPUESTAS DINÁMICAS POR CLIENTE
const PROPUESTAS_SURFVINTAGE: IncubacionPropuesta[] = [
  {
    id: 'newsjacking',
    badge: 'Newsjacking / Tendencias',
    icon: 'TrendingUp',
    titulo: 'Por qué las sudaderas retro oversize de los 90 son el outfit del verano en el Cantábrico',
    metaTitle: 'Sudaderas Retro Oversize 90s: Tendencia Verano | Surfvintage',
    metaDescription: 'Descubre por qué las sudaderas retro oversize de los 90 están arrasando este verano. Estilo surf clásico y sostenible en el norte.',
    puntosClave: [
      'El regreso de la estética surf de los 90.',
      'Cómo combinarlas en días frescos en Asturias y Cantabria.',
      'Sostenibilidad frente al fast-fashion.',
    ],
    puntosEstructura: [
      'Contexto: Qué está pasando en el mercado',
      'Tu ángulo: Cómo tu solución responde a ello',
      'Llamado a acción: Actúa ahora mientras es tendencia',
    ],
    slug: 'sudaderas-retro-tendencia-verano',
  },
  {
    id: 'case_study',
    badge: 'Caso de Éxito / Social Proof',
    icon: 'Trophy',
    titulo: 'Cómo restauramos una chaqueta de cuero de los 70 para un surfero de Gijón',
    metaTitle: 'Restauración de Chaquetas de Cuero 70s: Caso Real | Surfvintage',
    metaDescription: 'Te contamos el proceso artesanal de recuperación de una chaqueta de cuero de los 70 auténtica. Pasión por el coleccionismo vintage.',
    puntosClave: [
      'Tratamiento y curación del cuero antiguo.',
      'La historia detrás de una prenda de más de 50 años.',
      'Valor de marca y autenticidad.',
    ],
    puntosEstructura: [
      'Situación inicial: El desafío que enfrentaba',
      'Intervención: Qué hiciste exactamente paso a paso',
      'Resultados cuantificables: Números y testimonios reales',
    ],
    slug: 'restauracion-chaqueta-cuero-70s',
  },
  {
    id: 'tutorial',
    badge: 'Tutorial / Paso a Paso',
    icon: 'BookOpen',
    titulo: 'Guía definitiva: Cómo identificar ropa vintage auténtica (y evitar réplicas)',
    metaTitle: 'Cómo Identificar Ropa Vintage Auténtica: Guía Completa | Surfvintage',
    metaDescription: 'Aprende los secretos para detectar prendas vintage legítimas. Etiquetas, costuras, tejidos: todo lo que necesitas saber para ser un experto.',
    puntosClave: [
      'Características de las etiquetas originales de los 70-90.',
      'Detalles de costuras y tejidos en prendas auténticas.',
      'Preguntas clave al vendedor antes de comprar.',
    ],
    puntosEstructura: [
      'Introducción: Por qué debería aprender esto',
      'Pasos secuenciales: 5-7 pasos claros y accionables',
      'Conclusión + descargables: Recursos para profundizar',
    ],
    slug: 'guia-identificar-ropa-vintage',
  },
  {
    id: 'hot_take',
    badge: 'Hot Take / Contra-corriente',
    icon: 'Zap',
    titulo: 'Por qué el fast-fashion es la nueva moda desechable y el vintage es el futuro',
    metaTitle: 'Vintage vs Fast-Fashion: Por Qué la Moda Retro Es Sostenible | Surfvintage',
    metaDescription: 'Análisis sin filtros: cómo el coleccionismo vintage está revolucionando la industria de la moda frente al consumo desechable. Un viaje a la autenticidad.',
    puntosClave: [
      'El costo ambiental del fast-fashion.',
      'Cómo las prendas vintage duran décadas.',
      'La tendencia de "lujo asequible" en moda retro.',
    ],
    puntosEstructura: [
      'Tesis provocadora: La opinión contraria que defenderás',
      'Argumentos sólidos: 3-4 razones respaldadas con datos',
      'Conclusión: Por qué tu visión es el futuro',
    ],
    slug: 'vintage-vs-fast-fashion',
  },
  {
    id: 'commercial',
    badge: 'Comercial / Hard-Sell',
    icon: 'Target',
    titulo: 'Colección exclusiva limitada: Tablas de surf vintage de los 80 (solo 3 disponibles)',
    metaTitle: 'Tablas de Surf Vintage de los 80: Colección Exclusiva Limitada | Surfvintage',
    metaDescription: 'Únicamente 3 tablas de surf clásicas de los 80 en stock. Piezas de colección para surfistas que entienden de calidad. Compra hoy antes de que se agoten.',
    puntosClave: [
      'Disponibilidad limitada: solo 3 unidades en todo el país.',
      'Valor de inversión: estas tablas suben de precio cada año.',
      'Garantía de autenticidad y procedencia documentada.',
    ],
    puntosEstructura: [
      'Problema urgente: La brecha de dolor que resuelves',
      'Tu solución: Por qué eres la mejor opción (diferenciadores)',
      'Cierre urgente: CTA con escasez, tiempo limitado o exclusividad',
    ],
    slug: 'tablas-surf-vintage-80s-exclusivas',
  },
  {
    id: 'storytelling',
    badge: 'Storytelling / Narrativa Emocional',
    icon: 'BookMarked',
    titulo: 'El viaje de una prenda: Cómo una chaqueta de cuero de los 70 llegó a coleccionar historias',
    metaTitle: 'Historias de Prendas Vintage: El Viaje de una Chaqueta de Cuero | Surfvintage',
    metaDescription: 'Descubre el viaje emocional de una chaqueta de cuero auténtica de los 70. De su fabricación en Italia hasta las manos de un coleccionista en Asturias.',
    puntosClave: [
      'La historia detrás de cada prenda: donde se hizo, quién la usó.',
      'Conexión emocional con la moda vintage y el coleccionismo.',
      'Por qué las prendas antiguas tienen alma que el fast-fashion no puede copiar.',
    ],
    puntosEstructura: [
      'Contexto histórico: De dónde viene y qué pasaba en esa época.',
      'Viaje narrativo: Los dueños anteriores y sus historias.',
      'Conclusión emocional: Por qué esta prenda importa hoy.',
    ],
    slug: 'viaje-prenda-vintage-historia',
  },
];

const PROPUESTAS_ESGARDEN: IncubacionPropuesta[] = [
  {
    id: 'newsjacking',
    badge: 'Newsjacking / Tendencias',
    icon: 'TrendingUp',
    titulo: 'La fiebre de las barbacoas de gas en Bilbao: ¿Por qué todos están cambiando el carbón?',
    metaTitle: 'Barbacoas de Gas en Bilbao: La Tendencia de Cocina Exterior | Esgarden',
    metaDescription: 'Analizamos el auge de las barbacoas de gas en los jardines del norte. Eficiencia, limpieza y sabor premium sin complicaciones.',
    puntosClave: [
      'Ventajas de la velocidad del gas frente al carbón.',
      'Modelos ideales para terrazas y climas húmedos.',
      'Mantenimiento express sin obras.',
    ],
    puntosEstructura: [
      'Contexto: Qué está pasando en el mercado',
      'Tu ángulo: Cómo tu solución responde a ello',
      'Llamado a acción: Actúa ahora mientras es tendencia',
    ],
    slug: 'barbacoas-gas-bilbao-tendencia',
  },
  {
    id: 'tutorial',
    badge: 'Tutorial / Paso a Paso',
    icon: 'BookOpen',
    titulo: 'Guía para mantener limpia tu piscina desmontable de jardín sin gastar una fortuna',
    metaTitle: 'Mantenimiento de Piscinas Desmontables de Jardín | Esgarden',
    metaDescription: 'Aprende a mantener el agua de tu piscina portátil cristalina todo el verano. Trucos fáciles de dosificación y filtrado.',
    puntosClave: [
      'Control de pH y cloro para principiantes.',
      'Evitar el desgaste de los materiales exteriores.',
      'Rutina diaria de 5 minutos.',
    ],
    puntosEstructura: [
      'Introducción: Por qué debería aprender esto',
      'Pasos secuenciales: 5-7 pasos claros y accionables',
      'Conclusión + descargables: Recursos para profundizar',
    ],
    slug: 'mantenimiento-piscina-desmontable',
  },
  {
    id: 'case_study',
    badge: 'Caso de Éxito / Social Proof',
    icon: 'Trophy',
    titulo: 'Cómo un restaurante en Donostia transformó su terraza con mobiliario premium de Esgarden',
    metaTitle: 'Caso Real: Terraza de Restaurante Transformada | Esgarden',
    metaDescription: 'Descubre cómo una pequeña bodega en San Sebastián duplicó su capacidad de clientes con nuestro mobiliario de exterior. Resultados reales.',
    puntosClave: [
      'Aumento de ingresos en temporada alta.',
      'Durabilidad comprobada en clima oceánico.',
      'Instalación sin obras ni complicaciones.',
    ],
    puntosEstructura: [
      'Situación inicial: El desafío que enfrentaba',
      'Intervención: Qué hiciste exactamente paso a paso',
      'Resultados cuantificables: Números y testimonios reales',
    ],
    slug: 'caso-exito-restaurante-donostia',
  },
  {
    id: 'hot_take',
    badge: 'Hot Take / Contra-corriente',
    icon: 'Zap',
    titulo: 'Por qué los grandes constructores ignoran el diseño exterior (y eso es un error)',
    metaTitle: 'Diseño Exterior Ignorado: El Error Costoso de Constructoras | Esgarden',
    metaDescription: 'Análisis sin tapujos: cómo el abandono del espacio exterior está costando millones a promotoras. Los números que nadie habla.',
    puntosClave: [
      'Impacto en el valor de la propiedad del diseño exterior.',
      'Cómo los compradores millennials valoran más un jardín bien hecho.',
      'El ROI de invertir en espacios exteriores premium.',
    ],
    puntosEstructura: [
      'Tesis provocadora: La opinión contraria que defenderás',
      'Argumentos sólidos: 3-4 razones respaldadas con datos',
      'Conclusión: Por qué tu visión es el futuro',
    ],
    slug: 'constructoras-ignoran-diseño-exterior',
  },
  {
    id: 'commercial',
    badge: 'Comercial / Hard-Sell',
    icon: 'Target',
    titulo: 'Promoción exclusiva: Barbacoa de gas + piscina desmontable con instalación gratis (este mes)',
    metaTitle: 'Promoción: Barbacoa + Piscina + Instalación Gratis | Esgarden',
    metaDescription: 'Pack exclusivo este mes: barbacoa de gas premium + piscina desmontable + instalación profesional totalmente gratis. Oferta limitada a 10 clientes.',
    puntosClave: [
      'Disponibilidad limitada: solo 10 paquetes en marzo.',
      'Ahorro de €3,500 en instalación profesional.',
      'Garantía de 5 años en ambos productos.',
    ],
    puntosEstructura: [
      'Problema urgente: La brecha de dolor que resuelves',
      'Tu solución: Por qué eres la mejor opción (diferenciadores)',
      'Cierre urgente: CTA con escasez, tiempo limitado o exclusividad',
    ],
    slug: 'promocion-barbacoa-piscina-gratis',
  },
  {
    id: 'storytelling',
    badge: 'Storytelling / Narrativa Emocional',
    icon: 'BookMarked',
    titulo: 'De zona gris a oasis: Cómo una familia transformó su terraza abandonada en paraíso',
    metaTitle: 'Transformación de Terraza: De Zona Gris a Paraíso | Esgarden',
    metaDescription: 'Conoce la historia real de cómo una familia vasca convirtió su terraza olvidada en un espacio de vida familiar. Fotos antes/después y lecciones aprendidas.',
    puntosClave: [
      'La transformación emocional: cambio de perspectiva del espacio exterior.',
      'Impacto en la calidad de vida familiar y dinámica del hogar.',
      'Cómo el diseño de jardín influye en nuestro bienestar mental.',
    ],
    puntosEstructura: [
      'Situación inicial: La terraza olvidada y la falta de aprovechamiento.',
      'El proceso: Decisiones tomadas, desafíos encontrados, soluciones.',
      'Resultado emocional: Cómo cambió la vida de la familia con este espacio.',
    ],
    slug: 'transformacion-terraza-oasis',
  },
];

// FUNCIÓN PRINCIPAL: Generar propuestas según el cliente
export const generarPropuestasIncubacion = (client: Client | null): IncubacionPropuesta[] => {
  if (!client) return [];

  switch (client.id) {
    case '5': // Surfvintage
      return PROPUESTAS_SURFVINTAGE;
    case '6': // Esgarden
      return PROPUESTAS_ESGARDEN;
    default:
      return [];
  }
};

// Helper para generar slug desde título
export const generarSlug = (titulo: string): string => {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
