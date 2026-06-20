import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const fileCount = await getPrisma().file.count();
    const totalSizeResult = await getPrisma().file.aggregate({
      _sum: { fileSize: true },
    });
    const totalBytes = Number(totalSizeResult._sum.fileSize || BigInt(0));
    const limitBytes = 10 * 1024 * 1024 * 1024; // 10 GB
    const usedGB = totalBytes / (1024 * 1024 * 1024);
    const usedMB = totalBytes / (1024 * 1024);
    const percent = (totalBytes / limitBytes) * 100;

    res.json({
      usedBytes: totalBytes,
      limitBytes,
      usedGB: parseFloat(usedGB.toFixed(4)),
      usedMB: parseFloat(usedMB.toFixed(2)),
      limitGB: 10,
      percent: parseFloat(percent.toFixed(4)),
      fileCount,
      label: usedMB < 1 ? `${(totalBytes / 1024).toFixed(1)} KB` : usedMB < 1024 ? `${usedMB.toFixed(2)} MB` : `${usedGB.toFixed(3)} GB`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get storage info' });
  }
});

export default router;
