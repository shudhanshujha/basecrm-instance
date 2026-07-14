import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';
import { getOrgId } from '../middleware/org.js';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// --- Client Payments (Collections) ---
router.get('/clients', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const payments = await getPrisma().payment.findMany({
      where: { orgId },
      include: { client: true, invoice: true },
      orderBy: { paymentDate: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client payments' });
  }
});

router.post('/clients', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { invoiceId, clientId, amount, paymentDate, paymentMode, referenceNumber, notes } = req.body;
    let internalInvoiceId: string | undefined = undefined;
    
    // Look up invoice by number or ID — OPTIONAL
    if (invoiceId && invoiceId.trim()) {
      const invoice = await getPrisma().invoice.findFirst({
        where: { 
          orgId,
          OR: [
            { id: invoiceId },
            { invoiceNumber: invoiceId }
          ]
        }
      });
      if (invoice) {
        internalInvoiceId = invoice.id;
      }
      // If invoice ref provided but not found, still allow — just record without linking
    }


    const payment = await getPrisma().payment.create({
      data: {
        orgId,
        invoiceId: internalInvoiceId,
        clientId,
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        paymentMode,
        referenceNumber,
        notes
      }
    });
    
    // Auto-update invoice status — only mark PAID if total payments >= invoice total
    if (internalInvoiceId) {
      const inv = await getPrisma().invoice.findUnique({
        where: { id: internalInvoiceId },
        include: { payments: true }
      });
      if (inv) {
        const totalPaid = inv.payments.reduce((sum, p) => sum + Number(p.amount), 0) + Number(amount);
        const invoiceTotal = Number(inv.totalAmount);
        if (totalPaid >= invoiceTotal) {
          await getPrisma().invoice.update({
            where: { id: internalInvoiceId },
            data: { status: 'PAID' }
          });
        } else {
          await getPrisma().invoice.update({
            where: { id: internalInvoiceId },
            data: { status: 'PARTIAL' }
          });
        }
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to record collection' });
  }
});

// --- Vendor Payments (Payouts) ---
router.get('/vendors', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const payments = await getPrisma().vendorPayment.findMany({
      where: { orgId },
      include: { vendor: true },
      orderBy: { paymentDate: 'desc' }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor payments' });
  }
});

router.post('/vendors', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { vendorId, amount, paymentDate, paymentMode, referenceNumber, purpose, notes, month, year } = req.body;

    const payment = await getPrisma().vendorPayment.create({
      data: {
        orgId,
        vendorId,
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        paymentMode,
        referenceNumber,
        purpose,
        notes,
        month: month ? parseInt(month) : new Date(paymentDate).getMonth() + 1,
        year: year ? parseInt(year) : new Date(paymentDate).getFullYear()
      }
    });

    // Log in general Expenses for P&L
    await getPrisma().expense.create({
      data: {
        orgId,
        date: new Date(paymentDate),
        category: 'VENDOR_PAYOUT',
        amount: parseFloat(amount),
        description: `Vendor Payout: ${purpose || 'Inventory Settlement'}`,
        paymentMode,
        referenceNumber
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create vendor payment error:', error);
    res.status(500).json({ error: 'Failed to record payout' });
  }
});

export default router;
