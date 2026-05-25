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

// Get all invoices
router.get('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const invoices = await getPrisma().invoice.findMany({
      where: { orgId },
      include: { client: true, campaign: true, payments: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get single invoice
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const invoice = await getPrisma().invoice.findFirst({
      where: { id, orgId },
      include: { client: true, campaign: true, payments: true }
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post('/', async (req: any, res) => {
  try {
    const prisma = getPrisma();
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { 
      invoiceNumber, clientId, campaignId, invoiceDate, dueDate, 
      subtotal, taxableAmount, cgstAmount, sgstAmount, igstAmount, 
      totalAmount, lineItems, notes, bankDetails 
    } = req.body;

    // Parse items
    const items = typeof lineItems === 'string' ? JSON.parse(lineItems) : lineItems;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          orgId,
          invoiceNumber,
          clientId,
          campaignId: campaignId || null,
          invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          subtotal: parseFloat(subtotal) || 0,
          taxableAmount: parseFloat(taxableAmount) || 0,
          cgstAmount: parseFloat(cgstAmount) || 0,
          sgstAmount: parseFloat(sgstAmount) || 0,
          igstAmount: parseFloat(igstAmount) || 0,
          totalAmount: parseFloat(totalAmount) || 0,
          notes,
          bankDetails: bankDetails ? (typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails) : null,
          status: 'PENDING'
        }
      });

      if (items && Array.isArray(items)) {
        await tx.invoiceItem.createMany({
          data: items.map((item: any) => ({
            orgId,
            invoiceId: invoice.id,
            description: item.description,
            hsn: item.hsn,
            quantity: parseFloat(item.qty) || 1,
            rate: parseFloat(item.rate) || 0,
            amount: parseFloat(item.amount) || 0
          }))
        });
      }

      return invoice;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Update invoice
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const invoice = await getPrisma().invoice.update({
      where: { id, orgId },
      data: req.body
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    await getPrisma().invoice.delete({ where: { id, orgId } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

export default router;
