import { Router } from 'express';
import prisma from '../prismaClient';

const router = Router();

router.get('/export', async (req, res) => {
  try {
    const [clients, sites, vendors, campaigns, invoices, payments, vendorPayments, expenses] = await Promise.all([
      prisma.client.findMany(),
      prisma.site.findMany(),
      prisma.vendor.findMany(),
      prisma.campaign.findMany(),
      prisma.invoice.findMany(),
      prisma.payment.findMany(),
      prisma.vendorPayment.findMany(),
      prisma.expense.findMany()
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
