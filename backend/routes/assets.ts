import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// Helper to get org_id
const getOrgId = async (req: any) => {
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

// Get all assets
router.get('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const assets = await getPrisma().asset.findMany({
      where: { orgId }
    });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

// Get single asset
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const asset = await getPrisma().asset.findFirst({
      where: { id, orgId },
      include: { activityLogs: true }
    });
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

// Create asset
router.post('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const asset = await getPrisma().asset.create({
      data: {
        ...req.body,
        orgId
      }
    });
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().asset.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Asset not found' });

    const asset = await getPrisma().asset.update({
      where: { id },
      data: req.body
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset' });
  }
});

// Delete asset
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().asset.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Asset not found' });

    // Cascade delete all dependent records in a transaction
    await getPrisma().$transaction(async (tx) => {
      // Delete files linked to this asset
      await tx.file.deleteMany({ where: { assetId: id } });
      // Nullify assetId on invoice items
      await tx.invoiceItem.updateMany({ where: { assetId: id }, data: { assetId: null } });
      // Delete activity logs linked to this asset (and their files first)
      const logs = await tx.activityLog.findMany({ where: { assetId: id }, select: { id: true } });
      for (const log of logs) {
        await tx.file.deleteMany({ where: { activityLogId: log.id } });
      }
      await tx.activityLog.deleteMany({ where: { assetId: id } });
      // Finally delete the asset
      await tx.asset.delete({ where: { id } });
    });

    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete asset ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete asset. It may have active dependencies.' });
  }
});

// Update asset status
router.patch('/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const asset = await getPrisma().asset.update({
      where: { id, orgId },
      data: { status: status.toUpperCase() }
    });
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update asset status' });
  }
});

export default router;
