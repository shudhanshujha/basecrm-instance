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

// Get all sites
router.get('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const sites = await getPrisma().site.findMany({
      where: { orgId },
      include: { vendor: true }
    });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

// Get single site
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const site = await getPrisma().site.findFirst({
      where: { id, orgId },
      include: { vendor: true, campaignSites: true }
    });
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site' });
  }
});

// Create site
router.post('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const site = await getPrisma().site.create({
      data: {
        ...req.body,
        orgId
      }
    });
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create site' });
  }
});

// Update site
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().site.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Site not found' });

    const site = await getPrisma().site.update({
      where: { id },
      data: req.body
    });
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site' });
  }
});

// Delete site
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().site.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Site not found' });

    await getPrisma().site.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

// Update site status
router.patch('/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const site = await getPrisma().site.update({
      where: { id, orgId },
      data: { status: status.toUpperCase() }
    });
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site status' });
  }
});

export default router;
