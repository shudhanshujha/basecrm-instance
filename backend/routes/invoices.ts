import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await getPrisma().invoice.findMany({
      include: { client: true, campaign: true, payments: true }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await getPrisma().invoice.findUnique({
      where: { id },
      include: { client: true, campaign: true, payments: true }
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    const invoice = await getPrisma().invoice.create({
      data: req.body
    });
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await getPrisma().invoice.update({
      where: { id },
      data: req.body
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await getPrisma().invoice.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
