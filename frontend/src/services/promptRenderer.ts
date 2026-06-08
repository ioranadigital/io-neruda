import { PromptRenderData } from '@/src/types/aiGeneration';

const PROMPT_TEMPLATE = `# 🎯 PROMPT DEFINITIVO PARA GENERACIÓN DE CONTENIDO

## INSTRUCCIÓN PRINCIPAL

Eres un especialista en creación de contenido de alto impacto. Tu objetivo es generar contenido que NO SOLO rankee en SEO, sino que VENDA, INSPIRE y GENERE ACCIÓN en la audiencia objetivo.

## 1️⃣ CONTEXTO DEL CLIENTE

**Nombre de la empresa:** \`{CLIENT_NAME}\`
**Propuesta de valor:** {CLIENT_USP}
**Voz de marca:** {BRAND_VOICE}
**Valores principales:** {BRAND_VALUES}
**Industria:** {INDUSTRY}

## 2️⃣ PERFIL DEL LECTOR (BUYER PERSONA)

**Quién es:** \`{BUYER_PERSONA}\`
**Su problema principal:** {PAIN_POINT}
**Lo que quiere conseguir:** {READER_GOAL}
**Nivel de conocimiento:** {KNOWLEDGE_LEVEL}
**Psicografía:** {PSYCHOGRAPHICS}

## 3️⃣ OBJETIVO DEL CONTENIDO

**Intención principal:** \`{CONTENT_INTENT}\`
**Formato de publicación:** \`{CONTENT_FORMAT}\`
**Keyword principal:** \`{PRIMARY_KEYWORD}\`
**Keywords secundarias:** {SECONDARY_KEYWORDS}
**Longitud target:** {ESTIMATED_LENGTH} palabras

## 4️⃣ GUÍA DE TONO Y ESTILO

**Descripción del tono:** {TONE_DESCRIPTION}
**Frases y patrones:** {PHRASE_PATTERNS}
**Vocabulario a USAR:** {VOCABULARY_USE}
**Vocabulario a EVITAR:** {VOCABULARY_AVOID}
**Keywords PROHIBIDAS:** {FORBIDDEN_KEYWORDS}

## 5️⃣ ESTRUCTURA REQUERIDA

1. **Intro gancho** (primera frase que atrape)
2. **Por qué esto importa** (contexto)
3. **Qué aprenderás** (promesa clara)
4. **H2 #1:** {SECTION_1_TITLE}
5. **H2 #2:** {SECTION_2_TITLE}
6. **H2 #3:** {SECTION_3_TITLE}
7. **Conclusión:** Resumen + transición suave a CTA
8. **Call-to-Action:** {SPECIFIC_CTA}

## 7️⃣ FORMATO DE SALIDA ESPERADO

Retorna EXACTAMENTE en este formato JSON:

\`\`\`json
{
  "metadata": {
    "title": "string (60 caracteres máx)",
    "metaDescription": "string (160 caracteres máx)",
    "h1": "string",
    "estimatedReadTime": "number",
    "keywordDensity": "number"
  },
  "content": {
    "intro": { "hook": "string", "context": "string", "promise": "string" },
    "sections": [{ "h2": "string", "content": "string", "keyTakeaway": "string" }],
    "conclusion": "string",
    "cta": "string"
  },
  "seo": {
    "primaryKeywordPlacement": "intro|h1|first_paragraph",
    "keywordsUsed": ["keyword1", "keyword2"],
    "readabilityScore": "number"
  },
  "engagement": {
    "sentimentTone": "positive|neutral|urgent|inspirational",
    "personalityIndex": "number",
    "trustBuilders": ["element1"],
    "emotionalTriggers": ["trigger1"]
  },
  "qualityMetrics": {
    "componentScores": {
      "buyerPersonaAlignment": 85,
      "contentIntentMatch": 85,
      "brandVoiceConsistency": 85,
      "keywordIntegration": 85,
      "formatOptimization": 85
    }
  }
}
\`\`\`

Puntuación mínima de calidad: 8/10 (80/100)`;

const VARIABLE_MAP: Record<string, (data: PromptRenderData) => string> = {
  '{CLIENT_NAME}': (data) => data.clientName,
  '{CLIENT_USP}': (data) => data.clientUsp,
  '{BRAND_VOICE}': (data) => data.brandVoice,
  '{BRAND_VALUES}': (data) => data.brandValues.join(', '),
  '{COMPETITOR_DIFFERENTIATION}': (data) => data.competitorDifferentiation,
  '{INDUSTRY}': (data) => data.industry,
  '{MARKET_POSITIONING}': (data) => data.marketPositioning,

  '{BUYER_PERSONA}': (data) => data.buyerPersona,
  '{PAIN_POINT}': (data) => data.painPoint,
  '{READER_GOAL}': (data) => data.readerGoal,
  '{KNOWLEDGE_LEVEL}': (data) => data.knowledgeLevel,
  '{PSYCHOGRAPHICS}': (data) => data.psychographics,

  '{CONTENT_INTENT}': (data) => data.contentIntent,
  '{CONTENT_FORMAT}': (data) => data.contentFormat,
  '{PRIMARY_KEYWORD}': (data) => data.primaryKeyword,
  '{SECONDARY_KEYWORDS}': (data) => data.secondaryKeywords.join(', '),
  '{ESTIMATED_LENGTH}': (data) => data.estimatedLength.toString(),
  '{SEASONAL_CONTEXT}': (data) => data.seasonalContext,

  '{TONE_DESCRIPTION}': (data) => data.toneDescription,
  '{PHRASE_PATTERNS}': (data) => data.phrasePatterns.map((p) => `- ${p}`).join('\n'),
  '{VOCABULARY_USE}': (data) => data.vocabularyUse.map((v) => `- ${v}`).join('\n'),
  '{VOCABULARY_AVOID}': (data) => data.vocabularyAvoid.map((v) => `- ${v}`).join('\n'),
  '{FORBIDDEN_KEYWORDS}': (data) => data.forbiddenKeywords.map((k) => `- ${k}`).join('\n'),
  '{REFERENCE_CONTENT}': (data) => data.referenceContent,

  '{SECTION_1_TITLE}': (data) => data.section1Title,
  '{SECTION_2_TITLE}': (data) => data.section2Title,
  '{SECTION_3_TITLE}': (data) => data.section3Title,
  '{SPECIFIC_CTA}': (data) => data.specificCta,

  '{CLICHES_TO_AVOID}': (data) => data.clichesToAvoid.map((c) => `"${c}"`).join(', '),
};

export function renderPrompt(template: string, data: PromptRenderData): string {
  let rendered = template;

  Object.entries(VARIABLE_MAP).forEach(([placeholder, getValue]) => {
    const value = getValue(data);
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    rendered = rendered.replace(regex, value);
  });

  return rendered;
}

export function getPromptTemplate(): string {
  return PROMPT_TEMPLATE;
}
