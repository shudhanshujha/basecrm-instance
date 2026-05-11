import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

// --- Client Payments ---
router.get('/clients', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { client: true, invoice: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client payments' });
  }
});

router.post('/clients', async (req, res) => {
  try {
    const payment = await prisma.payment.create({
      data: req.body
    });
    // Update invoice status if needed (e.g. if amount matches balance)
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client payment' });
  }
});

// --- Vendor Payments ---
router.get('/vendors', async (req, res) => {
  try {
    const payments = await prisma.vendorPayment.findMany({
      include: { vendor: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor payments' });
  }
});

router.post('/vendors', async (req, res) => {
  try {
    const payment = await prisma.vendorPayment.create({
      data: req.body
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor payment' });
  }
});

export default router;
