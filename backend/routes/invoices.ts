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
    const prisma = getPrisma();
    
    // 1. Get default Organization (CRITICAL for linking)
    const org = await prisma.organization.findFirst();
    if (!org) return res.status(400).json({ error: 'No organization found. Please set up organization first.' });

    const { 
      invoiceNumber, clientId, campaignId, invoiceDate, dueDate, 
      subtotal, taxableAmount, cgstAmount, sgstAmount, igstAmount, 
      totalAmount, lineItems, notes, bankDetails 
    } = req.body;

    // 2. Parse items if they are passed as a JSON string or array
    const items = typeof lineItems === 'string' ? JSON.parse(lineItems) : lineItems;

    // 3. Create everything in a Transaction
    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          orgId: org.id,
          invoiceNumber,
          clientId,
          campaignId: campaignId || null,
          invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          subtotal: parseFloat(subtotal),
          taxableAmount: parseFloat(taxableAmount),
          cgstAmount: parseFloat(cgstAmount),
          sgstAmount: parseFloat(sgstAmount),
          igstAmount: parseFloat(igstAmount),
          totalAmount: parseFloat(totalAmount),
          notes,
          bankDetails,
          status: 'PENDING'
        }
      });

      // Create line items linked to this invoice
      if (items && Array.isArray(items)) {
        await tx.invoiceItem.createMany({
          data: items.map((item: any) => ({
            orgId: org.id,
            invoiceId: invoice.id,
            description: item.description,
            hsn: item.hsn,
            quantity: parseFloat(item.qty),
            rate: parseFloat(item.rate),
            amount: parseFloat(item.amount)
          }))
        });
      }

      return invoice;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice and link to database' });
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
