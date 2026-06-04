import pLimit from 'p-limit';
import { supabase } from '../../config/supabase.js';
import logger from '../../utils/logger.js';
import * as contentGenerator from './content-generator.service.js';

// ====================================================================
// BATCH PROCESSOR SERVICE
// Procesa múltiples Plans en paralelo con control de concurrencia
// ====================================================================

/**
 * Procesa un batch job
 * Genera contenido para múltiples Plans de forma paralela
 */
export async function processBatch(batchJob) {
  const jobId = batchJob.id;

  try {
    logger.info(`Iniciando batch job: ${jobId}`, {
      totalItems: batchJob.totalItems,
      concurrencyLimit: batchJob.concurrencyLimit,
    });

    // Marcar batch como "processing"
    await updateBatchStatus(jobId, 'processing');

    // Crear limitador de concurrencia
    const limit = pLimit(batchJob.concurrencyLimit || 3);

    // Obtener configuración
    const config = await getConfigForBatch(batchJob.config_id);

    // Crear tareas para cada content_id
    const tasks = batchJob.content_ids.map((contentId, index) =>
      limit(() =>
        processContentInBatch(contentId, config, jobId, index, batchJob.totalItems)
      )
    );

    // Ejecutar en paralelo
    const results = await Promise.allSettled(tasks);

    // Procesar resultados
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;

    // Preparar resumen
    const resultsSummary = results.map((result, idx) => {
      if (result.status === 'fulfilled') {
        return {
          contentId: batchJob.content_ids[idx],
          status: 'completed',
          generatedIds: result.value,
        };
      } else {
        return {
          contentId: batchJob.content_ids[idx],
          status: 'failed',
          error: result.reason?.message || 'Unknown error',
        };
      }
    });

    // Actualizar batch como completado
    await supabase
      .from('io_neruda_batch_jobs')
      .update({
        status: failureCount === 0 ? 'completed' : 'partial',
        processed_items: successCount,
        failed_items: failureCount,
        results: resultsSummary,
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);

    logger.info(`✅ Batch completado: ${jobId}`, {
      successCount,
      failureCount,
    });

    return {
      jobId,
      status: failureCount === 0 ? 'completed' : 'partial',
      processedItems: successCount,
      failedItems: failureCount,
      results: resultsSummary,
    };
  } catch (error) {
    logger.error(`❌ Error en batch ${jobId}:`, error);

    // Marcar como failed
    await updateBatchStatus(jobId, 'failed').catch(() => {});

    throw error;
  }
}

/**
 * Procesa un content individual dentro de un batch
 */
async function processContentInBatch(
  contentId,
  config,
  batchJobId,
  index,
  total
) {
  try {
    logger.info(`[${index + 1}/${total}] Procesando content: ${contentId}`);

    // Obtener el content (Plan)
    const { data: content, error: contentError } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      throw new Error(`Content no encontrado: ${contentId}`);
    }

    // Generar contenido en múltiples formatos
    const generated = await contentGenerator.generateMultiFormat(content, config, true);

    // Guardar cada formato en BD
    const generatedIds = [];

    for (const [format, result] of Object.entries(generated)) {
      if (result.error) {
        logger.warn(`Error generando ${format}:`, result.error);
        continue;
      }

      const { data: savedContent, error: saveError } = await supabase
        .from('io_neruda_generated_contents')
        .insert({
          content_id: contentId,
          config_id: config?.id,
          batch_job_id: batchJobId,
          format,
          generated_text: result.text,
          keywords_used: result.keywordsUsed || [],
          tone_applied: config?.tone || 'professional',
          word_count: result.wordCount || 0,
          keyword_density: result.keywordDensity || 0,
          version: 1,
          is_alternative: false,
          status: 'draft',
          generation_time_ms: result.generationTimeMs || 0,
        })
        .select('id')
        .single();

      if (saveError) {
        logger.error(`Error guardando ${format}:`, saveError);
      } else {
        generatedIds.push(savedContent.id);
      }
    }

    logger.info(`✅ Content procesado: ${contentId} (${generatedIds.length} formatos)`);

    return generatedIds;
  } catch (error) {
    logger.error(`Error procesando content ${contentId}:`, error);
    throw error;
  }
}

/**
 * Obtiene la configuración para un batch
 */
async function getConfigForBatch(configId) {
  if (!configId) {
    return {
      enabledFormats: {
        blog: true,
        email: true,
        social_linkedin: true,
      },
      tone: 'professional',
      keywordsNiche: [],
      keywordsLongtail: [],
    };
  }

  const { data, error } = await supabase
    .from('io_neruda_content_configurations')
    .select('*')
    .eq('id', configId)
    .single();

  if (error) {
    throw new Error(`Config no encontrada: ${configId}`);
  }

  return data;
}

/**
 * Actualiza el estado de un batch
 */
async function updateBatchStatus(jobId, status) {
  const { error } = await supabase
    .from('io_neruda_batch_jobs')
    .update({
      status,
      started_at: status === 'processing' ? new Date().toISOString() : undefined,
    })
    .eq('id', jobId);

  if (error) {
    logger.error(`Error actualizando batch status: ${jobId}`, error);
    throw error;
  }
}

/**
 * Obtiene el progreso de un batch job
 */
export async function getBatchProgress(batchJobId) {
  try {
    const { data, error } = await supabase
      .from('io_neruda_batch_jobs')
      .select('*')
      .eq('id', batchJobId)
      .single();

    if (error || !data) {
      throw new Error(`Batch no encontrado: ${batchJobId}`);
    }

    const percentComplete =
      data.total_items > 0
        ? Math.round((data.processed_items / data.total_items) * 100)
        : 0;

    return {
      batchJobId,
      status: data.status,
      totalItems: data.total_items,
      processedItems: data.processed_items,
      failedItems: data.failed_items,
      percentComplete,
      results: data.results || [],
    };
  } catch (error) {
    logger.error(`Error obteniendo progreso de batch: ${batchJobId}`, error);
    throw error;
  }
}

export default {
  processBatch,
  getBatchProgress,
};
