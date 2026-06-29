import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { z } from 'zod';
import * as pipelineService from '../services/pipeline.service.js';

const router = express.Router();

const createContentSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string().min(1),
  stage: z.enum(['insight', 'plan', 'ready']),
  filename: z.string().min(1).regex(/\.md$/, 'Filename must end with .md'),
  title: z.string().min(1),
  body: z.string(),
  frontmatter: z.object({}).passthrough().optional(),
});

const updateContentSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().optional(),
  frontmatter: z.object({}).passthrough().optional(),
  status: z.enum(['draft', 'review', 'published']).optional(),
});

// GET /api/content - List contents
router.get('/', async (req, res) => {
  try {
    const { project, stage } = req.query;
    let query = supabase.from('io_neruda_contents').select('*');

    if (project) {
      const { data: proj } = await supabase.from('io_neruda_projects').select('id').eq('name', project).single();
      if (proj) query = query.eq('project_id', proj.id);
    }

    if (stage) query = query.eq('stage', stage);

    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    logger.error('Error listing contents:', err);
    res.status(500).json({ error: 'Failed to list contents' });
  }
});

// GET /api/content/:id - Get content with body
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Content not found' });

    // Also read from filesystem to get latest body
    try {
      const fsContent = await pipelineService.readContentFile(
        data.filename?.split('-')[0] || 'unknown',
        data.stage,
        data.filename
      );
      data.body = fsContent.body;
    } catch (err) {
      logger.warn('Could not read file from filesystem:', err.message);
    }

    res.json(data);
  } catch (err) {
    logger.error('Error getting content:', err);
    res.status(500).json({ error: 'Failed to get content' });
  }
});

// POST /api/content - Create content
router.post('/', async (req, res) => {
  try {
    const validated = createContentSchema.parse(req.body);
    const { projectId, projectName, stage, filename, title, body, frontmatter } = validated;

    // Write to filesystem first
    await pipelineService.writeContentFile(projectName, stage, filename, body);

    // Then insert into database
    const { data, error } = await supabase
      .from('io_neruda_contents')
      .insert([{
        project_id: projectId,
        stage,
        filename,
        title,
        body,
        frontmatter: frontmatter || {},
        word_count: body.split(/\s+/).length,
        status: 'draft',
      }])
      .select()
      .single();

    if (error) throw error;
    logger.info(`Content created: ${filename} in ${projectName}/${stage}`);
    res.status(201).json(data);
  } catch (err) {
    logger.error('Error creating content:', err);
    res.status(400).json({ error: err.message || 'Failed to create content' });
  }
});

// PATCH /api/content/:id - Update content
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validated = updateContentSchema.parse(req.body);

    // Get current content to find filename and stage
    const { data: currentContent, error: getError } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!currentContent) return res.status(404).json({ error: 'Content not found' });

    // Update filesystem if body changed
    if (validated.body) {
      const projectName = currentContent.filename?.split('-')[0] || 'unknown';
      await pipelineService.writeContentFile(
        projectName,
        currentContent.stage,
        currentContent.filename,
        validated.body
      );
    }

    // Update database
    const updateData = {
      ...validated,
      word_count: validated.body?.split(/\s+/).length || currentContent.word_count,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('io_neruda_contents')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    logger.info(`Content updated: ${id}`);
    res.json(data);
  } catch (err) {
    logger.error('Error updating content:', err);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// DELETE /api/content/:id - Delete content
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get content to find filename and stage
    const { data: content, error: getError } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!content) return res.status(404).json({ error: 'Content not found' });

    // Delete from filesystem
    const projectName = content.filename?.split('-')[0] || 'unknown';
    await pipelineService.deleteContentFile(projectName, content.stage, content.filename);

    // Delete from database
    const { error: delError } = await supabase
      .from('io_neruda_contents')
      .delete()
      .eq('id', id);

    if (delError) throw delError;
    logger.info(`Content deleted: ${id}`);
    res.json({ success: true });
  } catch (err) {
    logger.error('Error deleting content:', err);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// POST /api/content/:id/promote - Move to next stage
router.post('/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: content, error: getError } = await supabase
      .from('io_neruda_contents')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!content) return res.status(404).json({ error: 'Content not found' });

    const stageMap = { insight: 'plan', plan: 'ready' };
    const nextStage = stageMap[content.stage];

    if (!nextStage) {
      return res.status(400).json({ error: 'Content is already in final stage' });
    }

    // Move file in filesystem
    const projectName = content.filename?.split('-')[0] || 'unknown';
    await pipelineService.promoteContentFile(projectName, content.stage, content.filename);

    // Update database
    const { data, error } = await supabase
      .from('io_neruda_contents')
      .update({
        stage: nextStage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    logger.info(`Content promoted: ${id} ${content.stage} → ${nextStage}`);
    res.json(data);
  } catch (err) {
    logger.error('Error promoting content:', err);
    res.status(500).json({ error: 'Failed to promote content' });
  }
});

export default router;
