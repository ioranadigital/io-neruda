import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { z } from 'zod';
import * as exportService from '../services/export.service.js';

const router = express.Router();

const startExportSchema = z.object({
  projectName: z.string().min(1),
  contentId: z.string().uuid(),
  filename: z.string().min(1),
  targets: z.array(z.enum(['markdown', 'whatsapp', 'html', 'json', 'social', 'email'])).min(1),
  url: z.string().url().optional(),
});

// POST /api/export - Start export job
router.post('/', async (req, res) => {
  try {
    const validated = startExportSchema.parse(req.body);
    const { projectName, contentId, filename, targets, url } = validated;

    // Get content to verify it exists and get project_id
    const { data: content, error: contentError } = await supabase
      .from('io_neruda_contents')
      .select('project_id')
      .eq('id', contentId)
      .single();

    if (contentError || !content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Create export records for each target
    const exports = [];
    for (const target of targets) {
      const { data: exportRecord, error } = await supabase
        .from('io_neruda_exports')
        .insert([{
          content_id: contentId,
          project_id: content.project_id,
          target,
          style: null,
          output_path: null,
          url: url || null,
        }])
        .select()
        .single();

      if (error) throw error;
      exports.push(exportRecord);
    }

    logger.info(`Export job created for ${targets.join(',')}`);

    // Trigger actual export in background (don't await)
    (async () => {
      try {
        await exportService.runExport({
          projectName,
          filename,
          targets,
          url: url || null,
        });
        logger.info(`Export completed successfully for ${filename}`);
      } catch (err) {
        logger.error(`Export failed for ${filename}:`, err);
      }
    })();

    res.status(202).json({ exports, status: 'queued' });
  } catch (err) {
    logger.error('Error creating export job:', err);
    const statusCode = err instanceof z.ZodError ? 400 : 500;
    res.status(statusCode).json({ error: err.message || 'Failed to start export' });
  }
});

// GET /api/export - List exports
router.get('/', async (req, res) => {
  try {
    const { project, contentId } = req.query;

    let query = supabase.from('io_neruda_exports').select('*');

    if (contentId) {
      query = query.eq('content_id', contentId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    logger.error('Error listing exports:', err);
    res.status(500).json({ error: 'Failed to list exports' });
  }
});

// GET /api/export/download/:id - Download export (stub)
router.get('/download/:id', (req, res) => {
  res.status(501).json({ error: 'File download not yet implemented' });
});

export default router;
