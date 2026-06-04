import logger from '../../utils/logger.js';

// ====================================================================
// TONE ENGINE SERVICE
// Aplica tonalidad consistente a los textos generados
// ====================================================================

// Plantillas de tono predefinidas
export const TONE_TEMPLATES = {
  professional: {
    name: 'Profesional',
    vocabulary: 'formal, corporativo, especializado',
    sentenceStructure: 'complejo, sofisticado',
    examples: 'casos de estudio, datos empresariales',
    ctaStyle: 'directo, orientado a negocio',
    guidelines: `
      - Usa vocabulario formal pero accesible
      - Estructura: sujeto-verbo-objeto clara
      - Evita coloquialismos y jerga casual
      - Incluye datos y hechos para respaldar claims
      - CTA: "Solicita demostración" o "Descubre más"
    `,
  },

  friendly: {
    name: 'Amigable',
    vocabulary: 'casual, conversacional, cercano',
    sentenceStructure: 'simple, directo, natural',
    examples: 'historias personales, anécdotas relatable',
    ctaStyle: 'cálido, invitador, humano',
    guidelines: `
      - Habla como si fuera a un amigo
      - Usa contracciones: "no es", "está"
      - Puedes usar emojis estratégicamente (máx 1-2)
      - Historias personales que resuenen
      - CTA: "Únete" o "Descubre cómo"
    `,
  },

  technical: {
    name: 'Técnico',
    vocabulary: 'preciso, especializado, detallado',
    sentenceStructure: 'complejo pero claro, paso a paso',
    examples: 'especificaciones técnicas, implementaciones',
    ctaStyle: 'beneficios técnicos, ROI measurable',
    guidelines: `
      - Usa terminología técnica apropiada
      - Sé preciso en descripciones
      - Incluye requisitos y especificaciones
      - Explica el "cómo" no solo el "qué"
      - CTA: "Implementa ahora" o "Documentación técnica"
    `,
  },

  custom: {
    name: 'Personalizado',
    vocabulary: 'variado según guías',
    sentenceStructure: 'según guías',
    examples: 'según guías',
    ctaStyle: 'según guías',
    guidelines: 'Consulta las guías personalizadas',
  },
};

/**
 * Aplica tono a un texto generado
 * Para desarrollo, simplemente devuelve el texto
 * En producción, usaría Claude API para reescribir
 */
export async function applyTone(text, tone = 'professional', customTone = null) {
  try {
    logger.info(`Aplicando tono: ${tone}`);

    if (tone === 'custom' && !customTone) {
      throw new Error('customTone requerido si tone=custom');
    }

    // En modo desarrollo, solo modificamos ligeramente el texto
    let tonedText = text;

    if (tone === 'professional') {
      tonedText = makeProfessional(text);
    } else if (tone === 'friendly') {
      tonedText = makeFriendly(text);
    } else if (tone === 'technical') {
      tonedText = makeTechnical(text);
    } else if (tone === 'custom' && customTone) {
      // En modo desarrollo, simplemente agregamos nota
      tonedText = `/* Tone: ${customTone} */\n${text}`;
    }

    return tonedText;
  } catch (error) {
    logger.error('Error en applyTone:', error);
    throw error;
  }
}

/**
 * Heurísticas simples para hacer texto profesional
 */
function makeProfessional(text) {
  return text
    .replace(/hola/gi, 'Estimado/a')
    .replace(/hey/gi, 'Buenos días')
    .replace(/cool/gi, 'notable')
    .replace(/awesome/gi, 'excelente')
    .replace(/\!/g, '.') // Menos exclamaciones
    .replace(/\?\?/g, '?'); // Menos puntuación repetida
}

/**
 * Heurísticas simples para hacer texto amigable
 */
function makeFriendly(text) {
  return text
    .replace(/estimado/gi, 'Hola')
    .replace(/requiere/gi, 'necesita')
    .replace(/debe/gi, 'puedes')
    .replace(/\. /g, '. ') // Espacio después de puntos
    .replace(/\n\n/g, '\n'); // Menos saltos de línea
}

/**
 * Heurísticas simples para hacer texto técnico
 */
function makeTechnical(text) {
  return text
    .replace(/muy grande/gi, 'escalable')
    .replace(/rápido/gi, 'de baja latencia')
    .replace(/fácil/gi, 'intuitivo')
    .replace(/bueno/gi, 'optimizado');
}

/**
 * Retorna las guías de un tono específico
 */
export function getToneGuidelines(tone) {
  const template = TONE_TEMPLATES[tone];
  if (!template) {
    throw new Error(`Tono desconocido: ${tone}`);
  }
  return template;
}

/**
 * Valida que el tono sea válido
 */
export function validateTone(tone) {
  const validTones = Object.keys(TONE_TEMPLATES);
  if (!validTones.includes(tone)) {
    throw new Error(`Tono inválido. Opciones: ${validTones.join(', ')}`);
  }
  return true;
}

export default {
  applyTone,
  getToneGuidelines,
  validateTone,
  TONE_TEMPLATES,
};
