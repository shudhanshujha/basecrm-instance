import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const notifications: any[] = [];
    const now = new Date();
    
    // 1. Overdue invoices
    const overdueInvoices = await getPrisma().invoice.findMany({
      where: { status: 'OVERDUE' },
      include: { client: true }
    });
    overdueInvoices.forEach(inv => {
      notifications.push({
        id: `inv-${inv.id}`,
        type: 'INVOICE_DUE',
        message: `Invoice #${inv.invoiceNumber} is overdue for ${inv.client.name}`,
        date: inv.dueDate.toISOString(),
        isRead: false
      });
    });

    // 2. Campaigns ending soon
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const endingCampaigns = await getPrisma().campaign.findMany({
      where: { 
        status: 'ACTIVE',
        endDate: { gte: now, lte: nextWeek }
      }
    });
    endingCampaigns.forEach(camp => {
      const daysLeft = Math.ceil((camp.endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      notifications.push({
        id: `camp-${camp.id}`,
        type: 'CAMPAIGN_END',
        message: `Campaign "${camp.campaignName}" is ending in ${daysLeft} days`,
        date: camp.endDate.toISOString(),
        isRead: false
      });
    });

    // 3. Recent payments
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);
    const recentPayments = await getPrisma().payment.findMany({
      where: { paymentDate: { gte: threeDaysAgo } },
      include: { client: true }
    });
    recentPayments.forEach(pay => {
      notifications.push({
        id: `pay-${pay.id}`,
        type: 'PAYMENT_RECEIVED',
        message: `Payment received: ₹${pay.amount.toLocaleString()} from ${pay.client.name}`,
        date: pay.paymentDate.toISOString(),
        isRead: false
      });
    });

    // Sort by date desc
    notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

export default router;
