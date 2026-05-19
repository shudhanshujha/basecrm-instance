import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

router.get('/export', async (req, res) => {
  try {
    const [clients, sites, vendors, campaigns, invoices, payments, vendorPayments, expenses] = await Promise.all([
      getPrisma().client.findMany(),
      getPrisma().site.findMany(),
      getPrisma().vendor.findMany(),
      getPrisma().campaign.findMany(),
      getPrisma().invoice.findMany(),
      getPrisma().payment.findMany(),
      getPrisma().vendorPayment.findMany(),
      getPrisma().expense.findMany()
    ]);

    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        clients,
        sites,
        vendors,
        campaigns,
        invoices,
        payments,
        vendorPayments,
        expenses
      }
    };

    res.json(backupData);
  } catch (error) {
    console.error('Backup failed:', error);
    res.status(500).json({ error: 'System backup failed' });
  }
});

export default router;
