import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Helper to get org_id
const getOrgId = async (req: any) => {
  if (req.user.orgId) return req.user.orgId;
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

// Get client timeline (history of deals, invoices, payments)
router.get('/:id/timeline', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const [deals, invoices, payments] = await Promise.all([
      getPrisma().deal.findMany({ where: { clientId: id, orgId }, orderBy: { createdAt: 'desc' } }),
      getPrisma().invoice.findMany({ where: { clientId: id, orgId }, orderBy: { createdAt: 'desc' } }),
      getPrisma().payment.findMany({ where: { clientId: id, orgId }, orderBy: { createdAt: 'desc' } })
    ]);

    const timeline = [
      ...deals.map(d => ({ id: d.id, type: 'DEAL', title: d.title, status: d.status, value: d.value, date: d.createdAt })),
      ...invoices.map(inv => ({ id: inv.id, type: 'INVOICE', title: `Invoice #${inv.invoiceNumber}`, status: inv.status, value: inv.totalAmount, date: inv.invoiceDate })),
      ...payments.map(p => ({ id: p.id, type: 'PAYMENT', title: `Payment Received`, status: 'COMPLETED', value: p.amount, date: p.paymentDate }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(timeline);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// Get all clients
router.get('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const clients = await getPrisma().client.findMany({
      where: { orgId },
      include: { deals: true, invoices: true }
    });
    res.json(clients);
  } catch (error) {
    console.error('[API ERROR] Failed to fetch clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const client = await getPrisma().client.findFirst({
      where: { id, orgId },
      include: { deals: true, invoices: true, payments: true }
    });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    console.error(`[API ERROR] Failed to fetch client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// Create client
router.post('/', async (req, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const client = await getPrisma().client.create({
      data: {
        ...req.body,
        orgId
      }
    });
    res.status(201).json(client);
  } catch (error) {
    console.error('[API ERROR] Failed to create client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().client.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Client not found' });

    const client = await getPrisma().client.update({
      where: { id },
      data: req.body
    });
    res.json(client);
  } catch (error) {
    console.error(`[API ERROR] Failed to update client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    // Verify ownership
    const existing = await getPrisma().client.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Client not found' });

    // Cascade delete all dependent records in a transaction
    await getPrisma().$transaction(async (tx) => {
      // Delete client files
      await tx.file.deleteMany({ where: { clientId: id } });

      // Delete payments linked to this client
      await tx.payment.deleteMany({ where: { clientId: id } });

      // Delete quotations
      await tx.quotation.deleteMany({ where: { clientId: id } });

      // Get all deals for this client
      const deals = await tx.deal.findMany({ where: { clientId: id }, select: { id: true } });
      for (const deal of deals) {
        // Delete files linked to activity logs
        const logs = await tx.activityLog.findMany({ where: { dealId: deal.id }, select: { id: true } });
        for (const log of logs) {
          await tx.file.deleteMany({ where: { activityLogId: log.id } });
        }
        await tx.activityLog.deleteMany({ where: { dealId: deal.id } });
        await tx.file.deleteMany({ where: { dealId: deal.id } });
      }

      // Get all invoices for this client and delete their items and payments
      const invoices = await tx.invoice.findMany({ where: { clientId: id }, select: { id: true } });
      for (const invoice of invoices) {
        await tx.payment.deleteMany({ where: { invoiceId: invoice.id } });
        await tx.invoiceItem.deleteMany({ where: { invoiceId: invoice.id } });
        await tx.file.deleteMany({ where: { invoiceId: invoice.id } });
      }
      await tx.invoice.deleteMany({ where: { clientId: id } });

      // Delete deals
      await tx.deal.deleteMany({ where: { clientId: id } });

      // Finally delete the client
      await tx.client.delete({ where: { id } });
    });

    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete client ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;
