import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const getOrgId = async (req: any) => {
  if (req.user.orgId) return req.user.orgId;
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

router.get('/export', authMiddleware, async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const [clients, assets, vendors, deals, invoices, payments, vendorPayments, expenses] = await Promise.all([
      getPrisma().client.findMany({ where: { orgId } }),
      getPrisma().asset.findMany({ where: { orgId } }),
      getPrisma().vendor.findMany({ where: { orgId } }),
      getPrisma().deal.findMany({ where: { orgId } }),
      getPrisma().invoice.findMany({ where: { orgId } }),
      getPrisma().payment.findMany({ where: { orgId } }),
      getPrisma().vendorPayment.findMany({ where: { orgId } }),
      getPrisma().expense.findMany({ where: { orgId } })
    ]);

    const backupData = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      data: {
        clients,
        assets,
        vendors,
        deals,
        invoices,
        payments,
        vendorPayments,
        expenses
      }
    };

    res.json(backupData);
  } catch (error) {
    console.error('Backup failed:', error);
    res.status(500).json({ error: 'Failed to generate backup' });
  }
});

export default router;
