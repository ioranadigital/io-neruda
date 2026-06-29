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

export interface Subcategoria {
  id: string;
  nombre: string;
  descripcion: string;
}

// MAPEO DE SUBCATEGORÍAS POR PROPUESTA (PASO 3)
export const SUBCATEGORIAS_POR_PROPUESTA: Record<string, Subcategoria[]> = {
  'guide': [
    { id: 'introduccion-principiantes', nombre: 'Introducción para Principiantes', descripcion: 'Enfocado en conceptos base desde cero.' },
    { id: 'manual-avanzado', nombre: 'Manual Avanzado / Deep Dive', descripcion: 'Contenido técnico y profundo para expertos.' },
    { id: 'guia-compra-seleccion', nombre: 'Guía de Compra y Selección', descripcion: 'Criterios clave antes de adquirir el producto.' },
  ],
  'comparison': [
    { id: 'modelo-vs-modelo', nombre: 'Modelo Vs Modelo (Directa)', descripcion: 'Enfrentamiento técnico de dos productos específicos.' },
    { id: 'tecnologia-concepto', nombre: 'Tecnología o Concepto', descripcion: 'Comparación de dos soluciones o enfoques alternativos.' },
    { id: 'marca-vs-marca', nombre: 'Marca A vs Marca B', descripcion: 'Análisis de catálogos y filosofías de fabricantes rivales.' },
  ],
  'tips': [
    { id: 'quick-fix', nombre: 'Solución Rápida (Quick Fix)', descripcion: 'Consejos inmediatos para resolver un contratiempo.' },
    { id: 'optimizacion-rendimiento', nombre: 'Optimización y Rendimiento', descripcion: 'Trucos para exprimir al máximo el rendimiento.' },
    { id: 'errores-comunes', nombre: 'Errores Comunes a Evitar', descripcion: 'Lista de fallos típicos y cómo prevenirlos.' },
  ],
  'case_study': [
    { id: 'restauracion-recuperacion', nombre: 'Restauración o Recuperación Real', descripcion: 'Proceso artesanal de rescate de un producto.' },
    { id: 'transformacion-antes-despues', nombre: 'Transformación Antes y Después', descripcion: 'Análisis del impacto o cambio en un entorno.' },
    { id: 'logro-hito-tecnico', nombre: 'Logro o Hito Técnico', descripcion: 'Cómo se resolvió un desafío complejo paso a paso.' },
  ],
  'tutorial': [
    { id: 'montaje-instalacion', nombre: 'Montaje e Instalación (DIY)', descripcion: 'Instrucciones de armado y configuración inicial.' },
    { id: 'mantenimiento-limpieza', nombre: 'Mantenimiento y Limpieza Profunda', descripcion: 'Pasos para cuidar y extender la vida útil.' },
    { id: 'conservacion-materiales', nombre: 'Conservación de Materiales', descripcion: 'Técnicas avanzadas para preservar componentes.' },
  ],
  'trends': [
    { id: 'tendencia-temporada', nombre: 'Informe de Temporada / Estación', descripcion: 'Lo que viene con fuerza en el mercado actual.' },
    { id: 'disrupcion-tecnologia', nombre: 'Disrupción y Nuevas Tecnologías', descripcion: 'Análisis de innovaciones emergentes.' },
    { id: 'predicciones-consumo', nombre: 'Predicciones de Consumo', descripcion: 'Hacia dónde se dirigen el interés y los valores de los usuarios.' },
  ],
};

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

// SETS ALTERNATIVOS - Variación B para evitar repetición
const PROPUESTAS_SURFVINTAGE_ALT: IncubacionPropuesta[] = [
  {
    id: 'hot_take',
    badge: 'Hot Take / Contra-corriente',
    icon: 'Zap',
    titulo: 'Por qué los pantalones de pana vintage de los 70 son la inversión de moda más inteligente de 2024',
    metaTitle: 'Pantalones Pana Vintage 70s: La Mejor Inversión en Moda | Surfvintage',
    metaDescription: 'Análisis detallado de por qué los pantalones de pana de los 70 representan lujo asequible y durabilidad versus el fast-fashion actual.',
    puntosClave: [
      'Durabilidad comprobada: tejidos que aguantan 40+ años.',
      'Sostenibilidad real: una prenda vs 100 camisetas de hoy.',
      'Valorización: estos pantalones suben de precio cada año.',
    ],
    puntosEstructura: [
      'Tesis provocadora: La opinión contraria que defenderás',
      'Argumentos sólidos: 3-4 razones respaldadas con datos',
      'Conclusión: Por qué tu visión es el futuro',
    ],
    slug: 'pantalones-pana-vintage-inversion-moda',
  },
  {
    id: 'comparison',
    badge: 'Comparativa / Análisis Técnico',
    icon: 'BarChart3',
    titulo: 'Chaquetas Levi\'s auténticas de los 80 vs réplicas chinas: análisis técnico y forense',
    metaTitle: 'Levi\'s Vintage 80s: Auténticas vs Falsificaciones | Surfvintage',
    metaDescription: 'Guía forense para diferenciar Levi\'s vintage auténticas de los 80 de las falsificaciones modernas. Costuras, etiquetas y detalles ocultos.',
    puntosClave: [
      'Análisis de etiquetas vintage vs reproducciones.',
      'Detalles de costura que revelan autenticidad.',
      'Patina natural vs envejecimiento artificial.',
    ],
    puntosEstructura: [
      'Contexto: Historia de las Levi\'s en los 80',
      'Comparación técnica: Auténticas vs falsas',
      'Checklist forense: Cómo identificar en 30 segundos',
    ],
    slug: 'levis-80s-autenticas-vs-falsas',
  },
  {
    id: 'tutorial',
    badge: 'Tutorial / Restauración',
    icon: 'Wrench',
    titulo: 'Cómo restaurar y tingir camisetas vintage de los 90 sin dañar el tejido',
    metaTitle: 'Restauración de Camisetas Vintage 90s: Guía Completa | Surfvintage',
    metaDescription: 'Tutorial paso a paso para limpiar, restaurar y teñir camisetas vintage de algodón sin perder calidad ni color original.',
    puntosClave: [
      'Técnicas de limpieza segura para tejidos antiguos.',
      'Métodos de teñido natural vs químicos.',
      'Reparación de grietas en impresiones vintage.',
    ],
    puntosEstructura: [
      'Introducción: Por qué debería aprender esto',
      'Pasos secuenciales: 7-8 pasos claros y accionables',
      'Conclusión + descargables: Recursos para profundizar',
    ],
    slug: 'restauracion-camisetas-vintage-90s',
  },
  {
    id: 'case_study',
    badge: 'Caso de Éxito / Colección Récord',
    icon: 'Trophy',
    titulo: 'Cómo una colección de sudaderas vintage de los 80 alcanzó el valor de un coche en 3 años',
    metaTitle: 'Colección Vintage Récord: De €500 a €25.000 | Surfvintage',
    metaDescription: 'Historia real de un coleccionista que convirtió €500 iniciales en una colección de sudaderas de diseñador vintage por €25.000 en menos de 3 años.',
    puntosClave: [
      'Estrategia de adquisición inteligente y timing.',
      'Identificación temprana de diseñadores emergentes.',
      'Documentación y certificación para valorización.',
    ],
    puntosEstructura: [
      'Situación inicial: El coleccionista y su primer hallazgo',
      'Intervención: Qué hizo diferente, decisiones clave',
      'Resultados cuantificables: El viaje hasta €25.000',
    ],
    slug: 'coleccion-sudaderas-vintage-25mil',
  },
  {
    id: 'storytelling',
    badge: 'Storytelling / Memoria Textil',
    icon: 'BookMarked',
    titulo: 'La chaqueta de cuero de un músico de grunge: cómo una prenda guarda 30 años de historias',
    metaTitle: 'Chaqueta Grunge: 30 Años de Historia en una Prenda | Surfvintage',
    metaDescription: 'Narrativa emocional sobre una chaqueta de cuero auténtica de los 90 que perteneció a un músico de Seattle y su viaje hasta hoy.',
    puntosClave: [
      'La identidad que porta una prenda: más allá del tejido.',
      'Conexión emocional del coleccionista con cada pieza.',
      'Cómo el vintage preserva memorias de épocas.',
    ],
    puntosEstructura: [
      'Contexto histórico: Seattle, los 90, la música grunge.',
      'Viaje narrativo: Los dueños anteriores y sus historias.',
      'Conclusión emocional: Por qué esta chaqueta importa hoy.',
    ],
    slug: 'chaqueta-grunge-historia-30-anos',
  },
];

const PROPUESTAS_ESGARDEN_ALT: IncubacionPropuesta[] = [
  {
    id: 'tips',
    badge: 'Tips & Trucos / Mantenimiento',
    icon: 'Lightbulb',
    titulo: '7 trucos de mantenimiento estival para que tu jardín prospere sin riego diario en agosto',
    metaTitle: 'Trucos Jardín Verano: Sin Riego Diario | Esgarden',
    metaDescription: 'Consejos inmediatos para mantener plantas vivas en agosto sin riego diario. Mulching, orientación solar y plantas resilientes.',
    puntosClave: [
      'Técnica de mulching para retener humedad.',
      'Reorientación de plantas según sombra estival.',
      'Plantas que sobreviven al abandono de verano.',
    ],
    puntosEstructura: [
      'Introducción: Por qué debería aprender esto',
      'Pasos secuenciales: 5-7 trucos claros y accionables',
      'Conclusión + descargables: Recursos para profundizar',
    ],
    slug: 'trucos-jardin-verano-sin-riego',
  },
  {
    id: 'hot_take',
    badge: 'Análisis / Tendencias',
    icon: 'Zap',
    titulo: 'Por qué los jardines verticales son un mito de sostenibilidad (y qué hacer en su lugar)',
    metaTitle: 'Jardines Verticales: Mito vs Realidad | Esgarden',
    metaDescription: 'Análisis crítico de los jardines verticales modernos: por qué fallan, costos ocultos, y alternativas realmente sostenibles.',
    puntosClave: [
      'Costos de mantenimiento real de sistemas verticales.',
      'Problemas de drenaje y humedad en muros.',
      'Alternativas más efectivas y económicas.',
    ],
    puntosEstructura: [
      'Tesis provocadora: La opinión contraria que defenderás',
      'Argumentos sólidos: 3-4 razones respaldadas con datos',
      'Conclusión: Por qué tu visión es el futuro',
    ],
    slug: 'jardines-verticales-mito-sostenibilidad',
  },
  {
    id: 'commercial',
    badge: 'Oferta Especial / Summer Pack',
    icon: 'Target',
    titulo: 'Pack jardinería de verano: Plantas resistentes + riego automático + asesoramiento premium (descuento 30%)',
    metaTitle: 'Pack Verano: Plantas + Riego Automático -30% | Esgarden',
    metaDescription: 'Paquete completo para preparar tu jardín en verano: 10 plantas resistentes + sistema de riego automático + 3 asesorías con experto.',
    puntosClave: [
      'Descuento 30% válido solo este mes.',
      'Plantas seleccionadas para clima veraniego.',
      'Instalación de riego automático incluida.',
    ],
    puntosEstructura: [
      'Problema urgente: La brecha de dolor que resuelves',
      'Tu solución: Por qué eres la mejor opción (diferenciadores)',
      'Cierre urgente: CTA con escasez, tiempo limitado o exclusividad',
    ],
    slug: 'pack-jardin-verano-descuento-30',
  },
  {
    id: 'case_study',
    badge: 'Transformación Real / Antes y Después',
    icon: 'Trophy',
    titulo: 'De balcón gris a mini-huerto productivo: cómo un apartamento pequeño produjo 40kg de hortalizas en 4 meses',
    metaTitle: 'Mini-Huerto Balcón: 40kg de Hortalizas | Esgarden',
    metaDescription: 'Caso real de cómo convertir un balcón de 6m² en un huerto productivo que genera 40kg de hortalizas en 4 meses sin experiencia previa.',
    puntosClave: [
      'Selección de cultivos para espacios pequeños.',
      'Rendimiento real con inversión mínima.',
      'Ahorro mensual vs compra en mercado.',
    ],
    puntosEstructura: [
      'Situación inicial: El desafío del espacio pequeño',
      'Intervención: Qué se hizo exactamente, paso a paso',
      'Resultados cuantificables: 40kg, ahorro, satisfacción',
    ],
    slug: 'balcon-huerto-40kg-hortalizas',
  },
  {
    id: 'storytelling',
    badge: 'Narrativa / Generacional',
    icon: 'BookMarked',
    titulo: 'Cómo una abuela transmite sus conocimientos de jardinería a través de un huerto compartido con su nieto',
    metaTitle: 'Huerto Generacional: Abuela y Nieto | Esgarden',
    metaDescription: 'Historia emocional de cómo tres generaciones se conectan a través de la jardinería en un espacio de 8m² que une a la familia.',
    puntosClave: [
      'La jardinería como puente intergeneracional.',
      'Transmisión de conocimientos ancestrales.',
      'Impacto en la salud mental y conexión familiar.',
    ],
    puntosEstructura: [
      'Contexto familiar: Presentación de los personajes.',
      'Viaje narrativo: El huerto como catalizador de encuentros.',
      'Conclusión emocional: Cómo cambió sus vidas.',
    ],
    slug: 'huerto-abuela-nieto-generacional',
  },
];

// FUNCIÓN PRINCIPAL: Generar propuestas según el cliente y variación
export const generarPropuestasIncubacion = (client: Client | null, variacion: number = 0): IncubacionPropuesta[] => {
  if (!client) return [];

  // Alterna entre set A (variacion par) y set B (variacion impar)
  const useAlternative = variacion % 2 === 1;

  switch (client.id) {
    case '5': // Surfvintage
      return useAlternative ? PROPUESTAS_SURFVINTAGE_ALT : PROPUESTAS_SURFVINTAGE;
    case '6': // Esgarden
      return useAlternative ? PROPUESTAS_ESGARDEN_ALT : PROPUESTAS_ESGARDEN;
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
