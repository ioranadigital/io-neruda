import { supabase } from '../../config/supabase.js';
import logger from '../../utils/logger.js';
import * as toneEngine from './tone-engine.service.js';
import * as keywordOptimizer from './keyword-optimizer.service.js';

// ====================================================================
// CONTENT GENERATOR SERVICE
// Orquesta la generación de contenido en múltiples formatos
// ====================================================================

/**
 * Genera contenido en múltiples formatos para un Plan
 * @param {Object} content - Plan/contenido base
 * @param {Object} config - Configuración de generación
 * @param {Object} metadata - Parámetros estratégicos (insightOrigin, contentIntent, etc)
 * @param {Boolean} mockMode - Si true, usa contenido mock en lugar de llamar al LLM
 */
export async function generateMultiFormat(content, config, metadata = {}, mockMode = false) {
  try {
    logger.info(`Generando contenido para: ${content.title}`, {
      formats: Object.keys(config.enabledFormats).filter(k => config.enabledFormats[k]),
      contentId: content.id,
      metadata: {
        insightOrigin: metadata.insightOrigin,
        contentIntent: metadata.contentIntent,
        localGeoEnabled: metadata.localGeoEnabled,
      },
    });

    const results = {};

    // Iterar por cada formato habilitado
    for (const [format, enabled] of Object.entries(config.enabledFormats)) {
      if (!enabled) continue;

      try {
        logger.info(`Generando formato: ${format}`);

        const generated = await generateForFormat(
          content,
          format,
          config,
          metadata,
          mockMode
        );

        results[format] = generated;
        logger.info(`✅ ${format} generado exitosamente`);
      } catch (error) {
        logger.error(`❌ Error generando ${format}:`, error.message);
        results[format] = {
          error: error.message,
          status: 'failed',
        };
      }
    }

    return results;
  } catch (error) {
    logger.error('Error en generateMultiFormat:', error);
    throw error;
  }
}

/**
 * Genera contenido para un formato específico
 * @param {Object} content - Plan/contenido base
 * @param {String} format - Formato de salida (blog, email, etc)
 * @param {Object} config - Configuración de generación
 * @param {Object} metadata - Parámetros estratégicos (insightOrigin, contentIntent, etc)
 * @param {Boolean} mockMode - Si true, usa contenido mock
 */
async function generateForFormat(content, format, config, metadata = {}, mockMode = false) {
  const startTime = Date.now();

  try {
    // 1. Construir prompt específico del formato (incluyendo metadata estratégica)
    const prompt = buildFormatPrompt(content, format, config, metadata);

    // 2. Generar con Claude (o mock si mockMode)
    let generatedText;
    if (mockMode) {
      generatedText = getMockContent(format, content, config);
    } else {
      // TODO: Conectar con Claude API
      // generatedText = await claudeClient.generate(prompt);
      generatedText = getMockContent(format, content, config);
    }

    // 3. Aplicar tono
    const withTone = await toneEngine.applyTone(
      generatedText,
      config.tone,
      config.toneCustomText
    );

    // 4. Integrar keywords naturalmente
    const withKeywords = await keywordOptimizer.integrateKeywords(
      withTone,
      config.keywordsNiche,
      config.keywordsLongtail,
      format
    );

    // 5. Validar y procesar por formato
    const finalContent = processFormatSpecific(withKeywords, format);

    // 6. Calcular métricas
    const wordCount = finalContent.split(/\s+/).length;
    const keywordsUsed = extractUsedKeywords(
      finalContent,
      [...config.keywordsNiche, ...config.keywordsLongtail]
    );
    const keywordDensity = keywordOptimizer.calculateDensity(
      finalContent,
      keywordsUsed
    );

    const generationTime = Date.now() - startTime;

    return {
      id: generateUUID(),
      format,
      text: finalContent,
      wordCount,
      keywordsUsed,
      keywordDensity: parseFloat(keywordDensity.toFixed(2)),
      generationTimeMs: generationTime,
      status: 'draft',
      alternatives: [],
    };
  } catch (error) {
    logger.error(`Error en generateForFormat (${format}):`, error);
    throw error;
  }
}

/**
 * Construye prompt específico por formato
 * @param {Object} content - Plan/contenido base
 * @param {String} format - Formato de salida
 * @param {Object} config - Configuración de generación
 * @param {Object} metadata - Parámetros estratégicos (insightOrigin, contentIntent, etc)
 */
function buildFormatPrompt(content, format, config, metadata = {}) {
  // Construir descripción de metadata estratégica
  let metadataSection = '';

  if (metadata.insightOrigin) {
    const insightDescriptions = {
      direct_idea: 'Idea directa del cliente o equipo (máxima originalidad, se puede ser creativo)',
      keyword_seo: 'Basado en investigación SEO y búsquedas (optimizar para posicionamiento)',
      obsidian_drive: 'Basado en investigación propia o base de conocimiento (aporta profundidad y autoridad)',
    };
    metadataSection += `\nOrigen del Insight: ${metadata.insightOrigin}\n  → ${insightDescriptions[metadata.insightOrigin]}`;
  }

  if (metadata.contentIntent) {
    const intentDescriptions = {
      educational: 'Proporcionar información y educar al lector sobre el tema',
      transactional: 'Guiar al lector hacia una acción (compra, registro, contacto)',
      social_proof: 'Incluir casos de éxito, testimonios y validación social',
      thought_leadership: 'Posicionar la marca como autoridad y experto en el tema',
    };
    metadataSection += `\nIntención: ${metadata.contentIntent}\n  → ${intentDescriptions[metadata.contentIntent]}`;
  }

  if (metadata.localGeoEnabled && metadata.localGeoValue) {
    metadataSection += `\nSEO Local: Optimizar para "${metadata.localGeoValue}"`;
    metadataSection += `\n  → Incluir referencias geográficas naturales`;
    metadataSection += `\n  → Usar variaciones: "${metadata.localGeoValue}", área cercana, región`;
  }

  const basePrompt = `
Genera contenido en formato ${format} basado en:
Título: ${content.title}
Contenido original: ${content.body}

Keywords a integrar:
- Nicho: ${config.keywordsNiche.join(', ')}
- Long-tail: ${config.keywordsLongtail.join(', ')}

Tono: ${config.tone}
${config.toneCustomText ? `Guías personalizadas: ${config.toneCustomText}` : ''}
${metadataSection}
`;

  const formatSpecificPrompts = {
    blog: `
${basePrompt}

BLOG POST REQUIREMENTS:
- 1500-2000 palabras
- Estructura: H1 → Intro → 3-5 H2 sections → Conclusion → CTA
- SEO-optimizado
- Include keyword in first 100 words
- Use bullet lists and bold for scanability
- Output: MARKDOWN format only
`,
    email: `
${basePrompt}

EMAIL REQUIREMENTS:
- 250-350 palabras
- Variables a llenar: {{subject}}, {{greeting}}, {{body_intro}}, {{body_main}}, {{cta_text}}
- Reading time: 60 segundos max
- Clear CTA
- Output: Plain text with variables marked as {{variable_name}}
`,
    social_linkedin: `
${basePrompt}

LINKEDIN POST REQUIREMENTS:
- 150-250 palabras
- Hook line que capture atención
- White space between paragraphs
- Engagement trigger (contrarian, story, framework, or data point)
- 3-5 hashtags
- Output: Plain text ready to paste
`,
    social_instagram: `
${basePrompt}

INSTAGRAM CAPTION REQUIREMENTS:
- 100-150 caracteres main caption
- 10-15 relevant hashtags
- Emoji strategically placed (1-3 max)
- Call-to-action
- Output: Caption + hashtags on new line
`,
    whatsapp: `
${basePrompt}

WHATSAPP MESSAGE REQUIREMENTS:
- 120-140 caracteres
- Conversational tone
- Strategic emoji usage
- Clear CTA
- Output: Plain text
`,
    pdf: `
${basePrompt}

PDF REPORT REQUIREMENTS:
- Professional structure
- 2-3 pages max
- Headers, sections, bullet points
- Output: Markdown (will be converted to PDF)
`,
  };

  return formatSpecificPrompts[format] || basePrompt;
}

/**
 * Procesa el contenido según el formato específico
 */
function processFormatSpecific(text, format) {
  switch (format) {
    case 'blog':
      return sanitizeMarkdown(text);
    case 'email':
      return sanitizeEmail(text);
    case 'social_linkedin':
      return sanitizeSocial(text, 250);
    case 'social_instagram':
      return sanitizeSocial(text, 150);
    case 'whatsapp':
      return sanitizeSocial(text, 140);
    case 'pdf':
      return sanitizeMarkdown(text);
    default:
      return text;
  }
}

/**
 * Funciones de sanitización por formato
 */
function sanitizeMarkdown(text) {
  return text.trim().replace(/\n{3,}/g, '\n\n');
}

function sanitizeEmail(text) {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}

function sanitizeSocial(text, maxChars) {
  let cleaned = text.trim().replace(/\n{3,}/g, '\n\n');
  if (cleaned.length > maxChars) {
    cleaned = cleaned.substring(0, maxChars - 3) + '...';
  }
  return cleaned;
}

/**
 * Extrae keywords que se usaron en el texto
 */
function extractUsedKeywords(text, keywords) {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => {
    const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Genera UUID v4 simple
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Mock content para desarrollo (sin IA)
 */
function getMockContent(format, content, config) {
  const mocks = {
    blog: `# ${content.title}\n\nIntroducción sobre ${content.title}...\n\n## Sección 1\n\nContenido de desarrollo.\n\n## Sección 2\n\nMás contenido.\n\n## Conclusión\n\nResumen y call to action.`,
    email: `Subject: {{subject}}\nGreeting: {{greeting}}\nIntro: {{body_intro}}\nMain: {{body_main}}\nCTA: {{cta_text}}`,
    social_linkedin: `Contenido de LinkedIn sobre ${content.title}. #desarrollo #contenido`,
    social_instagram: `Caption sobre ${content.title} 📱 #content #desarrollo`,
    whatsapp: `Hola! Lee sobre ${content.title} aquí 👉`,
    pdf: `# Reporte: ${content.title}\n\nContenido del reporte...`,
  };

  return mocks[format] || 'Contenido generado';
}

// ====================================================================
// EXPORT
// ====================================================================
export default {
  generateMultiFormat,
  generateForFormat,
};
