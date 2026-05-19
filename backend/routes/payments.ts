import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

// --- Client Payments ---
router.get('/clients', async (req, res) => {
  try {
    const payments = await getPrisma().payment.findMany({
      include: { client: true, invoice: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client payments' });
  }
});

router.post('/clients', async (req, res) => {
  try {
    let internalInvoiceId = null;
    
    // If the user typed an invoice number in the reference field, let's look it up
    if (req.body.invoiceId) {
      const invoice = await getPrisma().invoice.findFirst({
        where: { 
          OR: [
            { id: req.body.invoiceId },
            { invoiceNumber: req.body.invoiceId }
          ]
        }
      });
      if (invoice) {
        internalInvoiceId = invoice.id;
        req.body.invoiceId = invoice.id; // Correct the relation
      } else {
        return res.status(400).json({ error: 'Invoice reference not found. Please provide a valid Invoice Number or ID.' });
      }
    } else {
        return res.status(400).json({ error: 'Invoice reference is required.' });
    }

    const payment = await getPrisma().payment.create({
      data: req.body
    });
    
    // Auto-update invoice status to PAID
    if (internalInvoiceId) {
      await getPrisma().invoice.update({
        where: { id: internalInvoiceId },
        data: { status: 'PAID' }
      });
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client payment' });
  }
});

// --- Vendor Payments ---
router.get('/vendors', async (req, res) => {
  try {
    const payments = await getPrisma().vendorPayment.findMany({
      include: { vendor: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor payments' });
  }
});

router.post('/vendors', async (req, res) => {
  try {
    const payment = await getPrisma().vendorPayment.create({
      data: req.body
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor payment' });
  }
});

export default router;
