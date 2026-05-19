import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const envStatus = {
    DATABASE_URL: process.env.DATABASE_URL ? 'PRESENT (Masked)' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'PRESENT (Masked)' : 'MISSING',
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME ? 'PRESENT (Masked)' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
  };

  res.json({
    status: 'Diagnostics Page',
    environment: envStatus,
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

export default router;
