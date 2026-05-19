import { Router } from 'express';

const router = Router();

router.get('/ping', (req, res) => {
  res.json({ status: 'pong', timestamp: new Date().toISOString() });
});

export default router;
