import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';
import { getOrgId } from '../middleware/org.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const notifications: any[] = [];
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    
    const [overdueInvoices, endingDeals, recentPayments, taskReminders] = await Promise.all([
      getPrisma().invoice.findMany({
        where: { orgId, status: 'OVERDUE' },
        include: { client: true }
      }),
      getPrisma().deal.findMany({
        where: { orgId, status: 'ACTIVE', endDate: { gte: now, lte: nextWeek } }
      }),
      getPrisma().payment.findMany({
        where: { orgId, paymentDate: { gte: threeDaysAgo } },
        include: { client: true }
      }),
      getPrisma().task.findMany({
        where: { orgId, status: { notIn: ['COMPLETED', 'CANCELLED'] }, reminderAt: { lte: now } }
      })
    ]);
    
    overdueInvoices.forEach(inv => {
      notifications.push({
        id: `inv-${inv.id}`,
        type: 'INVOICE_DUE',
        message: `Invoice #${inv.invoiceNumber} is overdue for ${inv.client?.name || 'Unknown'}`,
        date: inv.dueDate.toISOString(),
        isRead: false
      });
    });

    endingDeals.forEach(deal => {
      const daysLeft = Math.ceil((deal.endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
      notifications.push({
        id: `deal-${deal.id}`,
        type: 'DEAL_END',
        message: `Deal "${deal.title}" is ending in ${daysLeft} days`,
        date: deal.endDate.toISOString(),
        isRead: false
      });
    });

    recentPayments.forEach(pay => {
      notifications.push({
        id: `pay-${pay.id}`,
        type: 'PAYMENT_RECEIVED',
        message: `Payment received: ₹${pay.amount.toLocaleString()} from ${pay.client?.name || 'Unknown'}`,
        date: pay.paymentDate.toISOString(),
        isRead: false
      });
    });

    taskReminders.forEach(task => {
      notifications.push({
        id: `task-${task.id}`,
        type: 'TASK_REMINDER',
        message: `Reminder: "${task.title}" is scheduled`,
        date: task.reminderAt!.toISOString(),
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
