import logger from '../../utils/logger.js';

// ====================================================================
// KEYWORD OPTIMIZER SERVICE
// Integra keywords naturalmente en el contenido generado
// ====================================================================

/**
 * Integra keywords naturalmente en el texto
 * Valida densidad y posicionamiento
 */
export async function integrateKeywords(
  text,
  keywordsNiche = [],
  keywordsLongtail = [],
  format = 'blog'
) {
  try {
    logger.info('Integrando keywords en contenido', {
      niche: keywordsNiche.length,
      longtail: keywordsLongtail.length,
      format,
    });

    if (!text) {
      throw new Error('Text no puede estar vacío');
    }

    let optimizedText = text;

    // Integrar keywords de nicho (puede aparecer 2-3 veces)
    for (const keyword of keywordsNiche) {
      const count = countKeywordOccurrences(optimizedText, keyword);
      if (count === 0 && format === 'blog') {
        // En blogs, si no existe, intentamos agregar (en modo desarrollo)
        optimizedText = addKeywordNaturally(optimizedText, keyword, 'niche');
      }
    }

    // Integrar keywords long-tail (una sola vez, estratégicamente)
    for (const keyword of keywordsLongtail) {
      const count = countKeywordOccurrences(optimizedText, keyword);
      if (count === 0 && format === 'blog') {
        optimizedText = addKeywordNaturally(optimizedText, keyword, 'longtail');
      }
    }

    // Validar densidad
    const allKeywords = [...keywordsNiche, ...keywordsLongtail];
    const density = calculateDensity(optimizedText, allKeywords);

    if (density > 5) {
      logger.warn('Keyword density muy alta:', density);
    }

    return optimizedText;
  } catch (error) {
    logger.error('Error en integrateKeywords:', error);
    throw error;
  }
}

/**
 * Cuenta cuántas veces aparece una keyword en el texto
 */
export function countKeywordOccurrences(text, keyword) {
  if (!keyword) return 0;
  const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

/**
 * Calcula la densidad de keywords
 * Retorna porcentaje (0-100)
 */
export function calculateDensity(text, keywords) {
  try {
    if (!text || !keywords || keywords.length === 0) {
      return 0;
    }

    const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 0;

    let keywordCount = 0;

    for (const keyword of keywords) {
      if (!keyword) continue;
      const regex = new RegExp(`\\b${escapeRegex(keyword.toLowerCase())}\\b`, 'g');
      const matches = text.toLowerCase().match(regex);
      if (matches) {
        keywordCount += matches.length;
      }
    }

    const density = (keywordCount / words.length) * 100;
    return Math.round(density * 100) / 100; // 2 decimales
  } catch (error) {
    logger.error('Error calculando density:', error);
    return 0;
  }
}

/**
 * Agrega una keyword naturalmente al texto
 * (Modo desarrollo: simplemente la agrega)
 */
function addKeywordNaturally(text, keyword, type = 'niche') {
  try {
    if (!text || !keyword) return text;

    // En modo desarrollo, agregamos la keyword de forma simple
    const lines = text.split('\n');

    if (type === 'longtail' && lines.length > 0) {
      // Agregar en el primer párrafo (estratégico)
      lines[0] = lines[0] + ` ${keyword}.`;
    } else if (type === 'niche') {
      // Agregar en la mitad del texto
      const midpoint = Math.floor(lines.length / 2);
      if (lines[midpoint]) {
        lines[midpoint] = lines[midpoint].replace(/\.$/, `. ${keyword}.`);
      }
    }

    return lines.join('\n');
  } catch (error) {
    logger.warn('Error agregando keyword:', error.message);
    return text;
  }
}

/**
 * Extrae keywords encontradas en el texto
 */
export function extractFoundKeywords(text, keywords) {
  if (!text || !keywords || keywords.length === 0) {
    return [];
  }

  return keywords.filter(keyword => {
    if (!keyword) return false;
    const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i');
    return regex.test(text);
  });
}

/**
 * Escapa caracteres especiales para regex
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Valida la integración de keywords
 * Retorna objeto con resultado y detalles
 */
export function validateKeywordIntegration(text, keywordsNiche, keywordsLongtail) {
  try {
    const allKeywords = [...(keywordsNiche || []), ...(keywordsLongtail || [])];

    const foundKeywords = extractFoundKeywords(text, allKeywords);
    const density = calculateDensity(text, allKeywords);

    const niches = {
      found: extractFoundKeywords(text, keywordsNiche || []).length,
      total: (keywordsNiche || []).length,
    };

    const longtails = {
      found: extractFoundKeywords(text, keywordsLongtail || []).length,
      total: (keywordsLongtail || []).length,
    };

    return {
      isValid: density <= 5 && foundKeywords.length > 0,
      density: density,
      keywordsFound: foundKeywords.length,
      keywordsTotal: allKeywords.length,
      niche: niches,
      longtail: longtails,
      warnings: [
        density > 5 && 'Densidad de keywords muy alta',
        foundKeywords.length === 0 && 'Ninguna keyword encontrada',
        niches.found === 0 && 'Ninguna keyword de nicho integrada',
      ].filter(Boolean),
    };
  } catch (error) {
    logger.error('Error validando keywords:', error);
    throw error;
  }
}

export default {
  integrateKeywords,
  calculateDensity,
  countKeywordOccurrences,
  extractFoundKeywords,
  validateKeywordIntegration,
};
