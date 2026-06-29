import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';
import {
  contentConfigurationSchema,
  generateContentSchema,
  batchJobSchema,
  emailTemplateSchema,
  updateGeneratedContentSchema,
} from '../validators/generators.schema.js';
import * as contentGeneratorService from '../services/generators/content-generator.service.js';
import * as batchProcessorService from '../services/generators/batch-processor.service.js';

const router = express.Router();

// ====================================================================
// 1. POST /api/generators/config
// Crear o guardar una configuración reutilizable
// ====================================================================
router.post('/config', async (req, res) => {
  try {
    // Validar con Zod
    const validated = contentConfigurationSchema.parse(req.body);

    logger.info('Creando configuración:', validated.name);

    // Insertar en BD
    const insertData = {
      name: validated.name,
      description: validated.description,
      keywords_niche: validated.keywordsNiche,
      keywords_longtail: validated.keywordsLongtail,
      tone: validated.tone,
      tone_custom_text: validated.toneCustomText,
      enabled_formats: validated.enabledFormats,
      email_template_id: validated.emailTemplateId,
      is_template: validated.isTemplate,
    };

    // Solo incluir project_id si se proporciona
    if (validated.projectId) {
      insertData.project_id = validated.projectId;
    }

    const { data, error } = await supabase
      .from('io_neruda_content_configurations')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    logger.info(`✅ Configuración creada: ${data.id}`);

    res.status(201).json(data);
  } catch (err) {
    logger.error('Error en POST /config:', err.message);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validación fallida',
        details: err.errors,
      });
    }

    res.status(500).json({ error: err.message || 'Error creando configuración' });
  }
});

// ====================================================================
// 2. GET /api/generators/config/:projectId
// Listar configuraciones de un proyecto
// ====================================================================
router.get('/config/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    logger.info(`Obteniendo configs para proyecto: ${projectId}`);

    const { data, error } = await supabase
      .from('io_neruda_content_configurations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    logger.error('Error en GET /config/:projectId:', err.message);
    res.status(500).json({ error: err.message || 'Error obteniendo configuraciones' });
  }
});

// ====================================================================
// 3. POST /api/generators/generate
// Generar contenido en múltiples formatos para un Plan
// ====================================================================
router.post('/generate', async (req, res) => {
  try {
    // Validar con Zod
    const validated = generateContentSchema.parse(req.body);

    logger.info('Generando contenido:', {
      contentId: validated.contentId,
      configId: validated.configId,
    });

    // Obtener el content (Plan)
    const { data: content, error: contentError } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', validated.contentId)
      .single();

    if (contentError || !content) {
      return res.status(404).json({ error: 'Content no encontrado' });
    }

    // Obtener o construir configuración
    let config;
    if (validated.configId) {
      const { data, error } = await supabase
        .from('io_neruda_content_configurations')
        .select('*')
        .eq('id', validated.configId)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Configuración no encontrada' });
      }

      config = data;
    } else {
      // Construir config inline
      config = {
        id: null,
        keywordsNiche: validated.keywordsNiche || [],
        keywordsLongtail: validated.keywordsLongtail || [],
        tone: validated.tone || 'professional',
        toneCustomText: validated.toneCustomText,
        enabledFormats: validated.enabledFormats || {
          blog: false,
          email: false,
          social_linkedin: false,
          social_instagram: false,
          whatsapp: false,
          pdf: false,
        },
      };
    }

    // Extraer parámetros estratégicos dinámicos
    const {
      insightOrigin,
      contentIntent,
      localGeoEnabled,
      localGeoValue,
    } = validated;

    // Generar contenido (pasar metadata estratégica)
    const generated = await contentGeneratorService.generateMultiFormat(content, config, {
      insightOrigin,
      contentIntent,
      localGeoEnabled,
      localGeoValue,
    });

    // Guardar cada formato en BD
    const generatedContents = {};

    for (const [format, result] of Object.entries(generated)) {
      if (result.error) {
        logger.warn(`Error generando ${format}:`, result.error);
        continue;
      }

      const { data: savedContent, error: saveError } = await supabase
        .from('io_neruda_generated_contents')
        .insert({
          content_id: validated.contentId,
          config_id: config?.id,
          format,
          generated_text: result.text,
          keywords_used: result.keywordsUsed || [],
          tone_applied: config.tone || 'professional',
          word_count: result.wordCount || 0,
          keyword_density: result.keywordDensity || 0,
          version: 1,
          is_alternative: false,
          status: 'draft',
          generation_time_ms: result.generationTimeMs || 0,
          insight_origin: insightOrigin,
          content_intent: contentIntent,
          local_geo_enabled: localGeoEnabled || false,
          local_geo_value: localGeoValue,
        })
        .select('*')
        .single();

      if (saveError) {
        logger.error(`Error guardando ${format}:`, saveError);
      } else {
        generatedContents[format] = savedContent;
      }
    }

    logger.info(`✅ Contenido generado: ${Object.keys(generatedContents).length} formatos`);

    res.json({
      jobId: null,
      contentId: validated.contentId,
      generatedContents,
    });
  } catch (err) {
    logger.error('Error en POST /generate:', err.message);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validación fallida',
        details: err.errors,
      });
    }

    res.status(500).json({ error: err.message || 'Error generando contenido' });
  }
});

// ====================================================================
// 4. GET /api/generators/generated/:contentId
// Listar contenidos generados para un Plan
// ====================================================================
router.get('/generated/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;

    logger.info(`Obteniendo contenidos generados para: ${contentId}`);

    const { data, error } = await supabase
      .from('io_neruda_generated_contents')
      .select('*')
      .eq('content_id', contentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    logger.error('Error en GET /generated/:contentId:', err.message);
    res.status(500).json({ error: err.message || 'Error obteniendo contenidos generados' });
  }
});

// ====================================================================
// 5. POST /api/generators/batch
// Iniciar batch processing (generar para múltiples Plans)
// ====================================================================
router.post('/batch', async (req, res) => {
  try {
    const validated = batchJobSchema.parse(req.body);

    logger.info('Iniciando batch job:', {
      totalItems: validated.contentIds.length,
      concurrencyLimit: validated.concurrencyLimit,
    });

    // Crear entrada en BD
    const { data: batchJob, error: createError } = await supabase
      .from('io_neruda_batch_jobs')
      .insert({
        project_id: validated.projectId,
        config_id: validated.configId,
        content_ids: validated.contentIds,
        total_items: validated.contentIds.length,
        concurrency_limit: validated.concurrencyLimit,
        status: 'pending',
      })
      .select()
      .single();

    if (createError) throw createError;

    // Iniciar processing en background (sin await)
    batchProcessorService.processBatch(batchJob).catch(err => {
      logger.error(`Batch ${batchJob.id} falló:`, err.message);
    });

    logger.info(`✅ Batch job creado: ${batchJob.id}`);

    res.status(202).json({
      batchJobId: batchJob.id,
      status: 'processing',
      totalItems: batchJob.total_items,
      estimatedTimeSeconds: Math.ceil((batchJob.total_items / (batchJob.concurrency_limit || 3)) * 10),
    });
  } catch (err) {
    logger.error('Error en POST /batch:', err.message);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validación fallida',
        details: err.errors,
      });
    }

    res.status(500).json({ error: err.message || 'Error creando batch' });
  }
});

// ====================================================================
// 6. GET /api/generators/batch/:batchJobId
// Ver progreso de un batch job
// ====================================================================
router.get('/batch/:batchJobId', async (req, res) => {
  try {
    const { batchJobId } = req.params;

    logger.info(`Obteniendo progreso de batch: ${batchJobId}`);

    const progress = await batchProcessorService.getBatchProgress(batchJobId);

    res.json(progress);
  } catch (err) {
    logger.error('Error en GET /batch/:batchJobId:', err.message);

    if (err.message.includes('no encontrado')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: err.message || 'Error obteniendo progreso' });
  }
});

// ====================================================================
// 7. GET /api/generators/email-templates
// Listar templates de email (sistema + proyecto)
// ====================================================================
router.get('/email-templates', async (req, res) => {
  try {
    const { projectId } = req.query;

    logger.info('Obteniendo email templates');

    // Templates del sistema
    const { data: systemTemplates, error: sysError } = await supabase
      .from('io_neruda_email_templates')
      .select('*')
      .eq('is_system', true);

    if (sysError) throw sysError;

    // Templates del proyecto (si se especifica)
    let projectTemplates = [];
    if (projectId) {
      const { data: proj, error: projError } = await supabase
        .from('io_neruda_email_templates')
        .select('*')
        .eq('project_id', projectId)
        .eq('is_system', false);

      if (projError) throw projError;
      projectTemplates = proj || [];
    }

    res.json({
      system: systemTemplates || [],
      project: projectTemplates,
    });
  } catch (err) {
    logger.error('Error en GET /email-templates:', err.message);
    res.status(500).json({ error: err.message || 'Error obteniendo templates' });
  }
});

// ====================================================================
// 8. PUT /api/generators/generated/:generatedId
// Actualizar contenido generado (estado, texto, etc)
// ====================================================================
router.put('/generated/:generatedId', async (req, res) => {
  try {
    const { generatedId } = req.params;
    const validated = updateGeneratedContentSchema.parse(req.body);

    logger.info(`Actualizando contenido generado: ${generatedId}`);

    const updateData = {
      ...validated,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('io_neruda_generated_contents')
      .update(updateData)
      .eq('id', generatedId)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Contenido no encontrado' });

    logger.info(`✅ Contenido actualizado: ${generatedId}`);

    res.json(data);
  } catch (err) {
    logger.error('Error en PUT /generated/:generatedId:', err.message);

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validación fallida',
        details: err.errors,
      });
    }

    res.status(500).json({ error: err.message || 'Error actualizando contenido' });
  }
});

// ====================================================================
// EXPORT
// ====================================================================
export default router;
