import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await getPrisma().campaign.findMany({
      include: { client: true, campaignSites: { include: { site: true } } }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await getPrisma().campaign.findUnique({
      where: { id },
      include: { client: true, campaignSites: { include: { site: true } }, invoices: true }
    });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

// Create campaign
router.post('/', async (req, res) => {
  try {
    const { campaignSites, ...campaignData } = req.body;
    
    const campaign = await getPrisma().campaign.create({
      data: {
        ...campaignData,
        campaignSites: {
          create: campaignSites || []
        }
      },
      include: { campaignSites: true }
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Update campaign
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { campaignSites, ...campaignData } = req.body;

    // Simplified update: Just update campaign data. 
    // Managing campaignSites update (delete/create/update) might be more complex.
    const campaign = await getPrisma().campaign.update({
      where: { id },
      data: campaignData
    });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update campaign' });
  }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Note: CampaignSites should be deleted via cascade or manually if not set up in Prisma
    await getPrisma().campaignSite.deleteMany({ where: { campaignId: id } });
    await getPrisma().campaign.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
