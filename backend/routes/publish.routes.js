import express from 'express';
import { supabase } from '../config/supabase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// POST /api/publish/wordpress - Publish to WordPress
router.post('/wordpress', async (req, res) => {
  try {
    const { contentId, title, body, status } = req.body;

    if (!contentId || !title || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get content
    const { data: content, error: contentError } = await supabase
      .from('io_neruda_contents')
      .select('project_id')
      .eq('id', contentId)
      .single();

    if (contentError) throw contentError;
    if (!content) return res.status(404).json({ error: 'Content not found' });

    // Record publication
    const { data, error } = await supabase
      .from('io_neruda_publications')
      .insert([{
        content_id: contentId,
        project_id: content.project_id,
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
      }])
      .select()
      .single();

    if (error) throw error;

    logger.info(`Publication recorded: ${data.id}`);

    // TODO: Implement actual WordPress XML-RPC publishing
    res.status(202).json({ publicationId: data.id, status: 'queued' });
  } catch (err) {
    logger.error('Error publishing to WordPress:', err);
    res.status(500).json({ error: 'Failed to publish' });
  }
});

// GET /api/publish/history - Get publication history
router.get('/history', async (req, res) => {
  try {
    const { project } = req.query;

    let query = supabase.from('io_neruda_publications').select('*');

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    logger.error('Error getting publication history:', err);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

export default router;
