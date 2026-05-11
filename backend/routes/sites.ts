import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// Get all sites
router.get('/', async (req, res) => {
  try {
    const sites = await prisma.site.findMany({
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
    const site = await prisma.site.findUnique({
      where: { id },
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
    const site = await prisma.site.create({
      data: req.body
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
    const site = await prisma.site.update({
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
    await prisma.site.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete site' });
  }
});

export default router;
