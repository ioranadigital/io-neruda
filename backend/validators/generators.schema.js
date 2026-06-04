import { z } from 'zod';

// ====================================================================
// SCHEMAS DE VALIDACIÓN - Content Generation System
// ====================================================================

// ====================================================================
// 1. Content Configuration Schema
// Para guardar configuraciones reutilizables
// ====================================================================
export const contentConfigurationSchema = z.object({
  projectId: z.string().min(1, 'projectId no puede estar vacío').optional(),
  name: z.string()
    .min(1, 'name no puede estar vacío')
    .max(100, 'name no puede exceder 100 caracteres'),
  description: z.string().optional(),

  // Keywords
  keywordsNiche: z.array(z.string().min(2).max(50))
    .default([])
    .describe('Palabras clave amplias del nicho'),
  keywordsLongtail: z.array(z.string().min(5).max(100))
    .default([])
    .describe('Frases clave específicas'),

  // Tone
  tone: z.enum(['professional', 'friendly', 'technical', 'custom'])
    .default('professional'),
  toneCustomText: z.string()
    .max(500, 'toneCustomText no puede exceder 500 caracteres')
    .nullable()
    .optional()
    .describe('Guías personalizadas de tono si tone=custom'),

  // Enabled Formats
  enabledFormats: z.object({
    blog: z.boolean().default(false),
    email: z.boolean().default(false),
    social_linkedin: z.boolean().default(false),
    social_instagram: z.boolean().default(false),
    whatsapp: z.boolean().default(false),
    pdf: z.boolean().default(false),
  }).default({
    blog: false,
    email: false,
    social_linkedin: false,
    social_instagram: false,
    whatsapp: false,
    pdf: false,
  }),

  // Email Template
  emailTemplateId: z.string().min(1).nullable().optional()
    .describe('ID del template de email si email está habilitado'),

  // Metadata
  isTemplate: z.boolean().default(false)
    .describe('Si true, esta config es reutilizable globalmente'),
});

// ====================================================================
// 2. Generate Content Schema
// Para generar contenido en múltiples formatos
// ====================================================================
export const generateContentSchema = z.object({
  contentId: z.string().min(1, 'contentId no puede estar vacío'),

  // Opción A: Usar config guardada
  configId: z.string().min(1).nullable().optional(),

  // Opción B: Parámetros inline
  keywordsNiche: z.array(z.string()).optional(),
  keywordsLongtail: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'friendly', 'technical', 'custom']).optional(),
  toneCustomText: z.string().optional(),
  enabledFormats: z.object({
    blog: z.boolean(),
    email: z.boolean(),
    social_linkedin: z.boolean(),
    social_instagram: z.boolean(),
    whatsapp: z.boolean(),
    pdf: z.boolean(),
  }).optional(),
  emailTemplateId: z.string().min(1).optional(),

  // Opciones adicionales
  generateAlternatives: z.number()
    .int()
    .min(0)
    .max(3)
    .default(0)
    .describe('Cuántas alternativas generar por formato (0-3)'),

  saveConfig: z.boolean().default(false)
    .describe('Guardar esta config como reutilizable'),
}).refine(
  (data) => data.configId || (data.keywordsNiche || data.keywordsLongtail),
  { message: 'Debe proporcionar configId O keywordsNiche/keywordsLongtail' }
);

// ====================================================================
// 3. Batch Job Schema
// Para procesar múltiples Plans en paralelo
// ====================================================================
export const batchJobSchema = z.object({
  projectId: z.string().min(1, 'projectId no puede estar vacío'),
  contentIds: z.array(z.string().min(1))
    .min(1, 'contentIds debe tener al menos 1 elemento')
    .max(50, 'contentIds no puede exceder 50 elementos')
    .describe('Array de content IDs a procesar'),

  configId: z.string().min(1).nullable().optional()
    .describe('La configuración a usar para todos los plans'),

  concurrencyLimit: z.number()
    .int()
    .min(1, 'concurrencyLimit mínimo es 1')
    .max(5, 'concurrencyLimit máximo es 5')
    .default(3)
    .describe('Máximo de Plans procesándose en paralelo'),
});

// ====================================================================
// 4. Email Template Schema
// Para crear templates personalizados
// ====================================================================
export const emailTemplateSchema = z.object({
  name: z.string()
    .min(1, 'name no puede estar vacío')
    .max(100, 'name no puede exceder 100 caracteres'),

  category: z.enum(['newsletter', 'welcome', 'promotional', 'transactional', 'custom'])
    .describe('Categoría del template'),

  templateType: z.enum(['mjml', 'html', 'plain'])
    .default('mjml'),

  templateBody: z.string()
    .min(10, 'templateBody muy corto')
    .max(10000, 'templateBody muy largo')
    .describe('Contenido del template con {{variables}}'),

  primaryColor: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'primaryColor debe ser un color hex válido (#RRGGBB)')
    .default('#3B82F6'),

  fontFamily: z.string()
    .default('Inter, sans-serif'),

  projectId: z.string().uuid().optional()
    .describe('Null = template global, UUID = template de proyecto'),
});

// ====================================================================
// 5. Update Generated Content Schema
// Para actualizar contenido generado después de revisión
// ====================================================================
export const updateGeneratedContentSchema = z.object({
  text: z.string()
    .min(1, 'text no puede estar vacío')
    .optional()
    .describe('Contenido editado por el usuario'),

  status: z.enum(['draft', 'approved', 'published', 'archived'])
    .optional(),

  notes: z.string()
    .max(500, 'notes no puede exceder 500 caracteres')
    .optional(),
});

// ====================================================================
// 6. Helper: Validar que al menos un formato está habilitado
// ====================================================================
export function validateFormatsEnabled(enabledFormats) {
  const hasAnyFormat = Object.values(enabledFormats).some(v => v === true);
  if (!hasAnyFormat) {
    throw new Error('Al menos un formato debe estar habilitado');
  }
  return true;
}

// ====================================================================
// 7. Helper: Validar que si email está habilitado, hay template
// ====================================================================
export function validateEmailTemplate(data) {
  if (data.enabledFormats?.email && !data.emailTemplateId) {
    throw new Error('emailTemplateId requerido si email está habilitado');
  }
  return true;
}

// ====================================================================
// Type Inference for TypeScript (JSDoc for IDE support)
// ====================================================================
/**
 * @typedef {z.infer<typeof contentConfigurationSchema>} ContentConfiguration
 * @typedef {z.infer<typeof generateContentSchema>} GenerateContentRequest
 * @typedef {z.infer<typeof batchJobSchema>} BatchJobRequest
 * @typedef {z.infer<typeof emailTemplateSchema>} EmailTemplateRequest
 * @typedef {z.infer<typeof updateGeneratedContentSchema>} UpdateGeneratedContentRequest
 */
