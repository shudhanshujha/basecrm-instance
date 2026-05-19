import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Find the database file
    const dbPath = path.resolve(process.cwd(), 'dev.db');
    
    let usedBytes = 0;
    if (fs.existsSync(dbPath)) {
      const stats = fs.statSync(dbPath);
      usedBytes = stats.size;
    }

    const limitBytes = 10 * 1024 * 1024 * 1024; // 10 GB
    const usedGB = usedBytes / (1024 * 1024 * 1024);
    const usedMB = usedBytes / (1024 * 1024);
    const percent = (usedBytes / limitBytes) * 100;

    res.json({
      usedBytes,
      limitBytes,
      usedGB: parseFloat(usedGB.toFixed(4)),
      usedMB: parseFloat(usedMB.toFixed(2)),
      limitGB: 10,
      percent: parseFloat(percent.toFixed(4)),
      label: usedMB < 1 ? `${(usedBytes / 1024).toFixed(1)} KB` : usedMB < 1024 ? `${usedMB.toFixed(2)} MB` : `${usedGB.toFixed(3)} GB`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get storage info' });
  }
});

export default router;
