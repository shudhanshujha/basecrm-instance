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

// Get all campaigns
router.get('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const campaigns = await getPrisma().campaign.findMany({
      where: { orgId },
      include: { client: true, campaignSites: { include: { site: true } } }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const campaign = await getPrisma().campaign.findFirst({
      where: { id, orgId },
      include: { client: true, campaignSites: { include: { site: true } }, invoices: true }
    });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Create campaign
router.post('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { sites, name, client, startDate, endDate, budget, type } = req.body;
    
    const campaign = await getPrisma().campaign.create({
      data: {
        orgId,
        campaignName: name,
        clientId: client,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        totalBudget: parseFloat(budget) || 0,
        status: 'PLANNING',
        campaignSites: {
          create: (sites || []).map((s: any) => ({
            orgId,
            siteId: s.id,
            agreedRate: parseFloat(s.rate) || 0,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : new Date()
          }))
        }
      },
      include: { campaignSites: true }
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().campaign.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Campaign not found' });

    const campaign = await getPrisma().campaign.update({
      where: { id },
      data: req.body
    });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().campaign.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Campaign not found' });

    await getPrisma().campaignSite.deleteMany({ where: { campaignId: id, orgId } });
    await getPrisma().campaign.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
