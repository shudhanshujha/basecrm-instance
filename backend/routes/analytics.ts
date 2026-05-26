import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware
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

router.get('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });
    
    const now = new Date();
    
    // Financial Analytics (3m, 6m, 1y)
    const getFinancials = async (months: number) => {
      const startDate = subMonths(now, months);
      
      const invoiceAgg = await getPrisma().invoice.aggregate({
        where: { orgId, invoiceDate: { gte: startDate } },
        _sum: { totalAmount: true }
      });
      
      const expenseAgg = await getPrisma().expense.aggregate({
        where: { orgId, date: { gte: startDate } },
        _sum: { amount: true }
      });

      const vendorAgg = await getPrisma().vendorPayment.aggregate({
        where: { orgId, paymentDate: { gte: startDate } },
        _sum: { amount: true }
      });

      const totalRevenue = invoiceAgg._sum.totalAmount || 0;
      const totalExpenses = (expenseAgg._sum.amount || 0) + (vendorAgg._sum.amount || 0);
      
      return {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netProfit: totalRevenue - totalExpenses
      };
    };

    const [analytics3m, analytics6m, analytics1y] = await Promise.all([
      getFinancials(3),
      getFinancials(6),
      getFinancials(12)
    ]);

    // GST Balance Sheet
    const invoiceGstAgg = await getPrisma().invoice.aggregate({
      where: { orgId },
      _sum: { cgstAmount: true, sgstAmount: true, igstAmount: true, taxableAmount: true }
    });

    const expenseGstAgg = await getPrisma().expense.aggregate({
      where: { orgId, gstin: { not: null } },
      _sum: { cgstAmount: true, sgstAmount: true, igstAmount: true }
    });

    const gstCollected = {
      cgst: invoiceGstAgg._sum.cgstAmount || 0,
      sgst: invoiceGstAgg._sum.sgstAmount || 0,
      igst: invoiceGstAgg._sum.igstAmount || 0,
    };

    const gstPaid = {
      cgst: expenseGstAgg._sum.cgstAmount || 0,
      sgst: expenseGstAgg._sum.sgstAmount || 0,
      igst: expenseGstAgg._sum.igstAmount || 0,
    };

    const outputDetails = await getPrisma().invoice.findMany({
      where: { orgId },
      select: {
        id: true,
        invoiceNumber: true,
        taxableAmount: true,
        cgstAmount: true,
        sgstAmount: true,
        igstAmount: true,
        totalAmount: true,
        client: {
          select: { name: true }
        }
      }
    });

    const inputDetails = await getPrisma().expense.findMany({
      where: { orgId, gstin: { not: null } },
      select: {
        id: true,
        description: true,
        category: true,
        amount: true,
        taxableAmount: true,
        cgstAmount: true,
        sgstAmount: true,
        igstAmount: true
      }
    });

    // P&L logic...
    const hoardingRevenue = invoiceGstAgg._sum.taxableAmount || 0;
    
    const allExpenses = await getPrisma().expense.findMany({
      where: { orgId },
      select: { taxableAmount: true, amount: true, category: true }
    });
    
    let indirectExpenses = 0;
    let mountingCosts = 0;
    allExpenses.forEach(exp => {
      const val = exp.taxableAmount || exp.amount || 0;
      if ((exp.category || '').toLowerCase().includes('mount')) mountingCosts += val;
      else indirectExpenses += val;
    });

    const vendorPayoutsAgg = await getPrisma().vendorPayment.aggregate({
      where: { orgId },
      _sum: { amount: true }
    });

    res.json({
      financials: { last3Months: analytics3m, last6Months: analytics6m, lastYear: analytics1y },
      gstReport: {
        collected: gstCollected,
        paid: gstPaid,
        balance: {
          cgst: gstCollected.cgst - gstPaid.cgst,
          sgst: gstCollected.sgst - gstPaid.sgst,
          igst: gstCollected.igst - gstPaid.igst,
        },
        outputDetails,
        inputDetails
      },
      plReport: {
        income: { hoarding: hoardingRevenue, total: hoardingRevenue },
        expenses: {
          lease: vendorPayoutsAgg._sum.amount || 0,
          mounting: mountingCosts,
          operating: indirectExpenses,
          total: (vendorPayoutsAgg._sum.amount || 0) + mountingCosts + indirectExpenses
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

router.get('/dashboard', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const { range, breakdown } = req.query;
    const now = new Date();
    
    // Monthly Comparison logic
    const currMonthStart = startOfMonth(now);
    const prevMonthStart = startOfMonth(subMonths(now, 1));
    const prevMonthEnd = endOfMonth(subMonths(now, 1));

    // 1. Revenue & Growth
    const currRev = await getPrisma().invoice.aggregate({
      where: { orgId, invoiceDate: { gte: currMonthStart } },
      _sum: { totalAmount: true }
    });
    const prevRev = await getPrisma().invoice.aggregate({
      where: { orgId, invoiceDate: { gte: prevMonthStart, lte: prevMonthEnd } },
      _sum: { totalAmount: true }
    });

    const revenueVal = currRev._sum.totalAmount || 0;
    const prevRevenueVal = prevRev._sum.totalAmount || 0;
    const revGrowth = prevRevenueVal > 0 
      ? ((revenueVal - prevRevenueVal) / prevRevenueVal) * 100
      : 0;

    // 2. Campaigns
    const activeCount = await getPrisma().campaign.count({
      where: { orgId, status: 'ACTIVE' }
    });
    const newCampaignsThisMonth = await getPrisma().campaign.count({
      where: { orgId, createdAt: { gte: currMonthStart } }
    });

    // 3. Outstanding
    const outstandingAgg = await getPrisma().invoice.aggregate({
      where: { orgId, status: { in: ['PENDING', 'OVERDUE'] } },
      _sum: { totalAmount: true }
    });
    const overdueCount = await getPrisma().invoice.count({
      where: { orgId, status: 'OVERDUE' }
    });

    // 4. Profitability
    const totalExp = await getPrisma().expense.aggregate({
      where: { orgId },
      _sum: { amount: true }
    });
    const vendorPay = await getPrisma().vendorPayment.aggregate({
      where: { orgId },
      _sum: { amount: true }
    });
    const totalCosts = (totalExp._sum.amount || 0) + (vendorPay._sum.amount || 0);
    const allTimeRev = await getPrisma().invoice.aggregate({
      where: { orgId },
      _sum: { totalAmount: true }
    });
    const totalRevenue = allTimeRev._sum.totalAmount || 0;
    const margin = totalRevenue > 0 ? ((totalRevenue - totalCosts) / totalRevenue) * 100 : 0;

    // Trend Logic...
    let months = range === '1y' ? 12 : range === '1m' ? 1 : range === '3m' ? 3 : 6;
    const startDate = subMonths(now, months);
    const invoicesInRange = await getPrisma().invoice.findMany({
      where: { orgId, invoiceDate: { gte: startDate } },
      select: { invoiceDate: true, totalAmount: true }
    });

    const monthMap: any = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthMap[key] = { name: d.toLocaleDateString('en-IN', { month: 'short' }), revenue: 0 };
    }
    invoicesInRange.forEach(inv => {
      const d = new Date(inv.invoiceDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) monthMap[key].revenue += (inv.totalAmount || 0) / 100000;
    });

    res.json({
      kpis: {
        revenue: `₹${(revenueVal / 100000).toFixed(1)}L`,
        revenueTrend: `${revGrowth >= 0 ? '↑' : '↓'} ${Math.abs(revGrowth).toFixed(1)}% vs prev month`,
        revenueTrendType: revGrowth >= 0 ? 'up' : 'down',
        campaigns: activeCount.toString(),
        campaignsTrend: `↑ ${newCampaignsThisMonth} new this month`,
        campaignsTrendType: 'up',
        outstanding: `₹${((outstandingAgg._sum.totalAmount || 0) / 100000).toFixed(1)}L`,
        outstandingTrend: `! ${overdueCount} overdue items`,
        outstandingTrendType: overdueCount > 0 ? 'down' : 'up',
        profit: `₹${((totalRevenue - totalCosts) / 100000).toFixed(1)}L`,
        profitTrend: `↑ ${margin.toFixed(1)}% gross margin`,
        profitTrendType: margin > 40 ? 'up' : 'down'
      },
      revenue: Object.values(monthMap).map((m: any) => ({ ...m, revenue: parseFloat(m.revenue.toFixed(2)) })),
      invoices: await getPrisma().invoice.findMany({
        where: { orgId },
        take: 5,
        orderBy: { invoiceDate: 'desc' },
        include: { client: true }
      })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});


router.get('/payments-summary', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const clientPaymentsAgg = await getPrisma().payment.aggregate({
      where: { paymentDate: { gte: startOfMonth } },
      _sum: { amount: true }
    });

    const vendorPaymentsAgg = await getPrisma().vendorPayment.aggregate({
      where: { paymentDate: { gte: startOfMonth } },
      _sum: { amount: true }
    });

    const netCollections = clientPaymentsAgg._sum.amount || 0;
    const totalPayouts = vendorPaymentsAgg._sum.amount || 0;

    res.json({
      netCollections,
      totalPayouts,
      netCashFlow: netCollections - totalPayouts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch payments summary' });
  }
});


export default router;
