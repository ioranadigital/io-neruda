import { EditorialPiece, MonthlyPlan } from '@/src/types/planner';

const SURFVINTAGE_PLAN: EditorialPiece[] = [
  {
    id: 'sv-week1',
    week: 1,
    format: 'blog',
    contentType: 'guia_completa',
    subtitle: 'Manual Avanzado',
    title: 'Manual de coleccionista: Cómo identificar etiquetas auténticas de Levi\'s 501 de los 80',
    recommendedKeyword: 'Levi\'s vintage 501',
    metaTitle: 'Guía Levi\'s 501 Vintage: Identificar Etiquetas Reales | Surfvintage',
    metaDescription: 'Aprende a identificar Levi\'s 501 auténticas de los 80. Guía completa de etiquetas y características.',
    status: 'idea',
    icon: '📖',
  },
  {
    id: 'sv-week2',
    week: 2,
    format: 'instagram',
    contentType: 'tips_trucos',
    subtitle: 'Solución Rápida',
    title: 'El método de los 3 pasos para eliminar el olor a humedad de prendas vintage pesadas',
    recommendedKeyword: 'olor a humedad en ropa vintage como quitarlo',
    metaTitle: '3 Pasos para Eliminar Olor Humedad | Ropa Vintage',
    metaDescription: 'Método efectivo para eliminar olor a humedad de prendas vintage. Técnica probada paso a paso.',
    status: 'idea',
    icon: '✨',
  },
  {
    id: 'sv-week3',
    week: 3,
    format: 'blog',
    contentType: 'comparativa',
    subtitle: 'Análisis Técnico',
    title: 'Tablas Retro Single-Fin vs Twin-Fin: ¿Qué sensaciones buscas en el Cantábrico?',
    recommendedKeyword: 'tabla de surf single-fin vs twin-fin',
    metaTitle: 'Single-Fin vs Twin-Fin: Comparativa Completa | Surfvintage',
    metaDescription: 'Análisis detallado entre tablas retro single-fin y twin-fin. Encuentra la ideal para ti.',
    status: 'idea',
    icon: '🏄',
  },
  {
    id: 'sv-week4',
    week: 4,
    format: 'email',
    contentType: 'tendencias',
    subtitle: 'Informe Temporada',
    title: 'Las 5 sudaderas surferas oversize de los 90 indispensables para las noches de julio',
    recommendedKeyword: 'sudaderas de surf de los 90 americanas',
    metaTitle: '5 Sudaderas Surf 90s: Guía Verano 2024 | Surfvintage',
    metaDescription: 'Descubre las mejores sudaderas retro de surf de los 90. Edición limitada y piezas de colección.',
    status: 'idea',
    icon: '👕',
  },
];

const ESGARDEN_PLAN: EditorialPiece[] = [
  {
    id: 'eg-week1',
    week: 1,
    format: 'blog',
    contentType: 'comparativa',
    subtitle: 'Análisis a Fondo',
    title: 'Weber Spirit E-315 frente a E-325: Análisis a fondo antes de renovar tu terraza',
    recommendedKeyword: 'Weber Spirit E-315 vs E-325',
    metaTitle: 'Weber E-315 vs E-325: Comparativa Completa | Esgarden',
    metaDescription: 'Análisis detallado entre Weber Spirit E-315 y E-325. Todo lo que necesitas saber antes de comprar.',
    status: 'idea',
    icon: '🔥',
  },
  {
    id: 'eg-week2',
    week: 2,
    format: 'linkedin',
    contentType: 'caso_estudio',
    subtitle: 'Antes y Después',
    title: 'Caso de éxito: Transformación de un ático en Madrid con césped artificial para mascotas',
    recommendedKeyword: 'cesped artificial en Madrid',
    metaTitle: 'Transformación Ático Madrid: Césped Artificial | Esgarden',
    metaDescription: 'Caso de éxito real: Ático transformado con césped artificial pet-friendly. Proyecto completo paso a paso.',
    status: 'idea',
    icon: '🏠',
  },
  {
    id: 'eg-week3',
    week: 3,
    format: 'blog',
    contentType: 'tutorial',
    subtitle: 'Mantenimiento',
    title: 'Guía paso a paso para purgar y calibrar una estufa de pellets antes de los primeros fríos',
    recommendedKeyword: 'como purgar una estufa de pellets',
    metaTitle: 'Purgar Estufa de Pellets: Guía Completa | Esgarden',
    metaDescription: 'Tutorial detallado: Cómo purgar y calibrar tu estufa de pellets. Mantenimiento preventivo esencial.',
    status: 'idea',
    icon: '🔧',
  },
  {
    id: 'eg-week4',
    week: 4,
    format: 'whatsapp',
    contentType: 'errores_comunes',
    subtitle: 'Errores Típicos',
    title: 'Alerta Piscina: Los 3 errores típicos que vuelven el agua verde en 48 horas',
    recommendedKeyword: 'por que el agua de mi piscina esta verde',
    metaTitle: 'Agua Piscina Verde: Causas y Soluciones | Esgarden',
    metaDescription: 'Descubre los 3 errores que ponen el agua verde. Soluciones rápidas y efectivas.',
    status: 'idea',
    icon: '💧',
  },
];

export function getMonthlyPlan(clientId: string): MonthlyPlan {
  const isEsgarden = clientId.toLowerCase().includes('esgarden');
  const pieces = isEsgarden ? ESGARDEN_PLAN : SURFVINTAGE_PLAN;

  return {
    clientId,
    clientName: isEsgarden ? 'Esgarden' : 'Surfvintage',
    pieces,
    generatedAt: new Date().toISOString(),
  };
}

export const EMPTY_PLAN: MonthlyPlan = {
  clientId: '',
  clientName: '',
  pieces: [],
  generatedAt: '',
};
