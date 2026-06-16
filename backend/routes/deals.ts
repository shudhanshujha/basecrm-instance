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

// Get all deals
router.get('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const deals = await getPrisma().deal.findMany({
      where: { orgId },
      include: { client: true, activityLogs: { include: { asset: true } } }
    });
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// Get single deal
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const deal = await getPrisma().deal.findFirst({
      where: { id, orgId },
      include: { client: true, activityLogs: { include: { asset: true } }, invoices: true }
    });
    if (!deal) return res.status(404).json({ error: 'Deal not found' });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deal' });
  }
});

// Create deal
router.post('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { assets, title, clientId, startDate, endDate, value, category } = req.body;

    const deal = await getPrisma().deal.create({
      data: {
        title,
        clientId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        value,
        category,
        orgId,
        activityLogs: {
          create: (assets || []).map((a: any) => ({
            assetId: a.id,
            activityType: 'INITIAL_ASSIGNMENT',
            description: `Asset assigned to deal at start`,
            orgId
          }))
        }
      },
      include: { activityLogs: true }
    });
    res.status(201).json(deal);
  } catch (error) {
    console.error('Create deal error:', error);
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// Update deal
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().deal.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Deal not found' });

    const deal = await getPrisma().deal.update({
      where: { id },
      data: req.body
    });
    res.json(deal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// Delete deal
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().deal.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Deal not found' });

    // Cascade delete all dependent records
    await getPrisma().$transaction(async (tx) => {
      // Delete deal files
      await tx.file.deleteMany({ where: { dealId: id } });

      // Delete activity log files and logs
      const logs = await tx.activityLog.findMany({ where: { dealId: id }, select: { id: true } });
      for (const log of logs) {
        await tx.file.deleteMany({ where: { activityLogId: log.id } });
      }
      await tx.activityLog.deleteMany({ where: { dealId: id } });

      // Nullify dealId on invoices (or delete them? instructions say keep invoices)
      // Generic CRM: probably keep invoices but disconnected?
      // Actually, if a deal is deleted, we might want to keep the invoice for accounting.
      await tx.invoice.updateMany({ where: { dealId: id }, data: { dealId: null } });

      // Finally delete the deal
      await tx.deal.delete({ where: { id } });
    });

    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete deal ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

export default router;
