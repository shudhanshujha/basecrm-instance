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
      include: { client: true, deal: true, payments: true },
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
      include: { client: true, deal: true, payments: true, invoiceItems: true, organization: true }
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
      invoiceNumber, clientId, dealId, invoiceDate, dueDate, 
      subtotal, taxableAmount, cgstAmount, sgstAmount, igstAmount, 
      totalAmount, lineItems, notes, bankDetails,
      reverseCharge, upiId, showUpiQr, showDigitalSignature, signatureUrl
    } = req.body;

    // Parse items
    const items = typeof lineItems === 'string' ? JSON.parse(lineItems) : lineItems;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          orgId,
          invoiceNumber,
          clientId,
          dealId: dealId || null,
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
          status: 'PENDING',
          reverseCharge: reverseCharge || 'N',
          upiId: upiId || '',
          showUpiQr: showUpiQr !== undefined ? showUpiQr : true,
          showDigitalSignature: showDigitalSignature !== undefined ? showDigitalSignature : false,
          signatureUrl: signatureUrl || ''
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
            amount: parseFloat(item.amount) || 0,
            discount: parseFloat(item.discount) || 0,
            cgstRate: parseFloat(item.cgstRate) || 0,
            sgstRate: parseFloat(item.sgstRate) || 0,
            igstRate: parseFloat(item.igstRate) || 0,
            cgstAmount: parseFloat(item.cgstAmount) || 0,
            sgstAmount: parseFloat(item.sgstAmount) || 0,
            igstAmount: parseFloat(item.igstAmount) || 0,
            total: parseFloat(item.total) || 0
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
    const prisma = getPrisma();
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { 
      invoiceNumber, clientId, dealId, invoiceDate, dueDate, 
      subtotal, taxableAmount, cgstAmount, sgstAmount, igstAmount, 
      totalAmount, lineItems, notes, bankDetails,
      reverseCharge, upiId, showUpiQr, showDigitalSignature, signatureUrl
    } = req.body;

    const items = lineItems ? (typeof lineItems === 'string' ? JSON.parse(lineItems) : lineItems) : null;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Invoice Metadata
      const updatedInvoice = await tx.invoice.update({
        where: { id, orgId },
        data: {
          invoiceNumber,
          clientId,
          dealId: dealId || null,
          invoiceDate: invoiceDate ? new Date(invoiceDate) : undefined,
          dueDate: dueDate ? new Date(dueDate) : undefined,
          subtotal: subtotal !== undefined ? parseFloat(subtotal) : undefined,
          taxableAmount: taxableAmount !== undefined ? parseFloat(taxableAmount) : undefined,
          cgstAmount: cgstAmount !== undefined ? parseFloat(cgstAmount) : undefined,
          sgstAmount: sgstAmount !== undefined ? parseFloat(sgstAmount) : undefined,
          igstAmount: igstAmount !== undefined ? parseFloat(igstAmount) : undefined,
          totalAmount: totalAmount !== undefined ? parseFloat(totalAmount) : undefined,
          notes,
          bankDetails: bankDetails ? (typeof bankDetails === 'string' ? JSON.parse(bankDetails) : bankDetails) : undefined,
          reverseCharge,
          upiId,
          showUpiQr: showUpiQr !== undefined ? showUpiQr : undefined,
          showDigitalSignature: showDigitalSignature !== undefined ? showDigitalSignature : undefined,
          signatureUrl
        }
      });

      // 2. If new line items are supplied, delete existing ones and insert new ones
      if (items && Array.isArray(items)) {
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: id, orgId }
        });

        await tx.invoiceItem.createMany({
          data: items.map((item: any) => ({
            orgId,
            invoiceId: id,
            description: item.description,
            hsn: item.hsn,
            quantity: parseFloat(item.qty) || 1,
            rate: parseFloat(item.rate) || 0,
            amount: parseFloat(item.amount) || 0,
            discount: parseFloat(item.discount) || 0,
            cgstRate: parseFloat(item.cgstRate) || 0,
            sgstRate: parseFloat(item.sgstRate) || 0,
            igstRate: parseFloat(item.igstRate) || 0,
            cgstAmount: parseFloat(item.cgstAmount) || 0,
            sgstAmount: parseFloat(item.sgstAmount) || 0,
            igstAmount: parseFloat(item.igstAmount) || 0,
            total: parseFloat(item.total) || 0
          }))
        });
      }

      return updatedInvoice;
    });

    res.json(result);
  } catch (error) {
    console.error('Invoice update error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const existing = await getPrisma().invoice.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Invoice not found' });

    await getPrisma().$transaction(async (tx) => {
      // Delete all dependent records first
      await tx.file.deleteMany({ where: { invoiceId: id } });
      await tx.payment.deleteMany({ where: { invoiceId: id } });
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
      // Finally delete the invoice
      await tx.invoice.delete({ where: { id } });
    });

    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete invoice ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

// Update invoice status
router.put('/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const invoice = await getPrisma().invoice.update({
      where: { id, orgId },
      data: { status: status.toUpperCase() }
    });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
});

export default router;
