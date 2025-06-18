import { Router } from 'express';
import { fetchCommitTitles } from '../services/githubService';

const router = Router();

// GET /api/github/commits?owner=usersuper838&repo=EzOnboarding
router.get('/commits', async (req, res) => {
  const owner = req.query.owner as string || 'usersuper838';
  const repo = req.query.repo as string || 'EzOnboarding';
  const perPage = req.query.perPage ? parseInt(req.query.perPage as string, 10) : 20;
  try {
    const commits = await fetchCommitTitles(owner, repo, perPage);
    res.json({ commits });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch commits' });
  }
});

export default router;
