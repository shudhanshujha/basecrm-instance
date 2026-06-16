import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/export', authMiddleware, async (req: any, res) => {
  try {
    const [clients, assets, vendors, deals, invoices, payments, vendorPayments, expenses] = await Promise.all([
      getPrisma().client.findMany(),
      getPrisma().asset.findMany(),
      getPrisma().vendor.findMany(),
      getPrisma().deal.findMany(),
      getPrisma().invoice.findMany(),
      getPrisma().payment.findMany(),
      getPrisma().vendorPayment.findMany(),
      getPrisma().expense.findMany()
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
