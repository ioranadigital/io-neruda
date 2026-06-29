import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { z } from 'zod';
import * as pipelineService from '../services/pipeline.service.js';

const router = express.Router();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Project name must be lowercase alphanumeric with hyphens'),
  displayName: z.string().min(1),
  type: z.enum(['blog', 'ecommerce', 'corporate']).default('blog'),
  wordPressUrl: z.string().url().optional(),
});

const updateProjectSchema = z.object({
  displayName: z.string().min(1).optional(),
  type: z.enum(['blog', 'ecommerce', 'corporate']).optional(),
  wordPressUrl: z.string().url().optional(),
  config: z.object({}).passthrough().optional(),
  status: z.enum(['active', 'paused']).optional(),
});

// GET /api/projects - List projects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('io_neruda_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    logger.error('Error listing projects:', err);
    res.status(500).json({ error: 'Failed to list projects' });
  }
});

// GET /api/projects/:name - Get project details
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { data, error } = await supabase
      .from('io_neruda_projects')
      .select('*')
      .eq('name', name)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Project not found' });

    res.json(data);
  } catch (err) {
    logger.error('Error getting project:', err);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// POST /api/projects - Create project
router.post('/', async (req, res) => {
  try {
    const validated = createProjectSchema.parse(req.body);
    const { name, displayName, type, wordPressUrl } = validated;

    // Create project folders on filesystem first
    await pipelineService.createProjectFolders(name);

    // Then insert into database
    const { data, error } = await supabase
      .from('io_neruda_projects')
      .insert([{
        name,
        display_name: displayName,
        type,
        wordpress_url: wordPressUrl,
        status: 'active',
        config: {
          tone: { primary: 'professional', secondary: 'friendly' },
          exporters: { enabled: ['markdown', 'whatsapp', 'html', 'json', 'social', 'email'] },
        },
      }])
      .select()
      .single();

    if (error) throw error;
    logger.info(`Project created: ${name}`);
    res.status(201).json(data);
  } catch (err) {
    logger.error('Error creating project:', err);
    const statusCode = err.code === 'PGRST116' ? 409 : 400;
    res.status(statusCode).json({ error: err.message || 'Failed to create project' });
  }
});

// PATCH /api/projects/:name - Update project
router.patch('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const validated = updateProjectSchema.parse(req.body);

    const updateData = {
      updated_at: new Date().toISOString(),
      ...Object.fromEntries(
        Object.entries(validated).map(([k, v]) => {
          // Convert camelCase to snake_case
          const key = k.replace(/([A-Z])/g, '_$1').toLowerCase();
          return [key, v];
        })
      ),
    };

    const { data, error } = await supabase
      .from('io_neruda_projects')
      .update(updateData)
      .eq('name', name)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Project not found' });

    logger.info(`Project updated: ${name}`);
    res.json(data);
  } catch (err) {
    logger.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// GET /api/projects/:name/stats - Get project statistics
router.get('/:name/stats', async (req, res) => {
  try {
    const { name } = req.params;

    const { data: project, error: projectError } = await supabase
      .from('io_neruda_projects')
      .select('id')
      .eq('name', name)
      .single();

    if (projectError) throw projectError;
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { data: contents, error: contentsError } = await supabase
      .from('io_neruda_contents')
      .select('stage')
      .eq('project_id', project.id);

    if (contentsError) throw contentsError;

    const stats = {
      insights: contents?.filter(c => c.stage === 'insight').length || 0,
      plans: contents?.filter(c => c.stage === 'plan').length || 0,
      ready: contents?.filter(c => c.stage === 'ready').length || 0,
      total: contents?.length || 0,
    };

    res.json(stats);
  } catch (err) {
    logger.error('Error getting project stats:', err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;
