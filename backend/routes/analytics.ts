import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { subMonths } from 'date-fns';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    
    // Financial Analytics (3m, 6m, 1y)
    const getFinancials = async (months: number) => {
      const startDate = subMonths(now, months);
      
      const invoiceAgg = await getPrisma().invoice.aggregate({
        where: { invoiceDate: { gte: startDate } },
        _sum: { totalAmount: true }
      });
      
      const expenseAgg = await getPrisma().expense.aggregate({
        where: { date: { gte: startDate } },
        _sum: { amount: true }
      });

      const vendorAgg = await getPrisma().vendorPayment.aggregate({
        where: { createdAt: { gte: startDate } },
        _sum: { amount: true }
      });

      const totalRevenue = invoiceAgg._sum.totalAmount || 0;
      const totalExpenses = expenseAgg._sum.amount || 0;
      const totalVendorPayments = vendorAgg._sum.amount || 0;
      
      return {
        revenue: totalRevenue,
        expenses: totalExpenses,
        vendorPayments: totalVendorPayments,
        netProfit: totalRevenue - (totalExpenses + totalVendorPayments)
      };
    };

    const [analytics3m, analytics6m, analytics1y] = await Promise.all([
      getFinancials(3),
      getFinancials(6),
      getFinancials(12)
    ]);

    // GST Balance Sheet (Cumulative)
    const invoiceGstAgg = await getPrisma().invoice.aggregate({
      _sum: { cgstAmount: true, sgstAmount: true, igstAmount: true, taxableAmount: true }
    });

    const expenseGstAgg = await getPrisma().expense.aggregate({
      where: { gstin: { not: null } },
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

    const gstBalance = {
      cgst: gstCollected.cgst - gstPaid.cgst,
      sgst: gstCollected.sgst - gstPaid.sgst,
      igst: gstCollected.igst - gstPaid.igst,
    };

    // Profit & Loss Report (Overall)
    const totalRevenue = invoiceGstAgg._sum.taxableAmount || 0; // P&L usually excludes tax
    
    const invoicesWithItems = await getPrisma().invoice.findMany({
      select: { lineItems: true }
    });

    let totalProductionRevenue = 0;
    invoicesWithItems.forEach(inv => {
      const items = inv.lineItems as any;
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          const desc = (item.description || '').toLowerCase();
          if (desc.includes('print') || desc.includes('prod') || desc.includes('mount')) {
            totalProductionRevenue += item.taxableValue || item.amount || 0;
          }
        });
      }
    });

    const hoardingRevenue = Math.max(0, totalRevenue - totalProductionRevenue);
    
    // For P&L, we need all expenses
    const allExpenses = await getPrisma().expense.findMany({
      select: { taxableAmount: true, amount: true, category: true }
    });
    
    let indirectExpenses = 0;
    let mountingCosts = 0;

    allExpenses.forEach(exp => {
      const category = (exp.category || '').toLowerCase();
      const val = exp.taxableAmount || exp.amount || 0;
      if (category.includes('mount') || category.includes('labour') || category.includes('print')) {
        mountingCosts += val;
      } else {
        indirectExpenses += val;
      }
    });
    
    const allVendorPaymentsAgg = await getPrisma().vendorPayment.aggregate({
      _sum: { amount: true }
    });
    const totalVendorPayouts = allVendorPaymentsAgg._sum.amount || 0;

    const plReport = {
      income: {
        hoarding: hoardingRevenue,
        production: totalProductionRevenue,
        total: totalRevenue
      },
      expenses: {
        lease: totalVendorPayouts,
        mounting: mountingCosts,
        operating: indirectExpenses,
        total: totalVendorPayouts + mountingCosts + indirectExpenses
      },
      netOperatingProfit: totalRevenue - (totalVendorPayouts + mountingCosts + indirectExpenses),
      gstLiability: {
        cgst: gstCollected.cgst,
        sgst: gstCollected.sgst,
        igst: gstCollected.igst,
        total: gstCollected.cgst + gstCollected.sgst + gstCollected.igst
      },
      finalBottomLine: (totalRevenue - (totalVendorPayouts + mountingCosts + indirectExpenses))
    };

    res.json({
      financials: {
        last3Months: analytics3m,
        last6Months: analytics6m,
        lastYear: analytics1y
      },
      gstReport: {
        collected: gstCollected,
        paid: gstPaid,
        balance: gstBalance,
        outputDetails: await getPrisma().invoice.findMany({
          take: 20,
          orderBy: { invoiceDate: 'desc' },
          include: { client: true }
        }),
        inputDetails: await getPrisma().expense.findMany({
          where: { gstin: { not: null } },
          take: 20,
          orderBy: { date: 'desc' }
        })
      },
      plReport
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const { range, breakdown } = req.query;
    const now = new Date();
    let months = 6;
    if (range === '1m') months = 1;
    if (range === '3m') months = 3;
    if (range === '1y') months = 12;

    const startDate = subMonths(now, months);

    // KPI 1: Revenue
    const revAgg = await getPrisma().invoice.aggregate({
      where: { invoiceDate: { gte: startDate } },
      _sum: { totalAmount: true }
    });

    // KPI 2: Active Campaigns
    const activeCampaignsCount = await getPrisma().campaign.count({
      where: { status: 'ACTIVE' }
    });

    // KPI 3: Outstanding
    const outstandingAgg = await getPrisma().invoice.aggregate({
      where: { status: { in: ['PENDING', 'OVERDUE'] } },
      _sum: { totalAmount: true }
    });

    // KPI 4: Expenses in range
    const expenseAgg = await getPrisma().expense.aggregate({
      where: { date: { gte: startDate } },
      _sum: { amount: true }
    });

    const totalRev = revAgg._sum.totalAmount || 0;
    const totalExp = expenseAgg._sum.amount || 0;

    // ── Real Revenue Trend (grouped by month) ────────────────────────────────
    const invoicesInRange = await getPrisma().invoice.findMany({
      where: { invoiceDate: { gte: startDate } },
      select: { invoiceDate: true, totalAmount: true, taxableAmount: true, cgstAmount: true, sgstAmount: true }
    });

    const expensesInRange = await getPrisma().expense.findMany({
      where: { date: { gte: startDate } },
      select: { date: true, amount: true }
    });

    const sitesInRange = await getPrisma().site.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true }
    });

    // Build a map of months in range
    const monthMap: Record<string, { name: string; revenue: number; expenses: number; profit: number; sites: number }> = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = subMonths(now, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = months > 6
        ? d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' })
        : d.toLocaleDateString('en-IN', { month: 'short' });
      monthMap[key] = { name: label, revenue: 0, expenses: 0, profit: 0, sites: 0 };
    }

    invoicesInRange.forEach(inv => {
      const d = new Date(inv.invoiceDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].revenue += (inv.totalAmount || 0) / 100000; // In Lakhs
      }
    });

    expensesInRange.forEach(exp => {
      const d = new Date(exp.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].expenses += (exp.amount || 0) / 100000;
      }
    });

    sitesInRange.forEach(site => {
      const d = new Date(site.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap[key]) {
        monthMap[key].sites += 1;
      }
    });

    const revenueTrend = Object.values(monthMap).map(m => ({
      ...m,
      revenue: parseFloat(m.revenue.toFixed(2)),
      expenses: parseFloat(m.expenses.toFixed(2)),
      profit: parseFloat((m.revenue - m.expenses).toFixed(2)),
    }));

    // ── Real Breakdown ────────────────────────────────────────────────────────
    let breakdownData: any[] = [];
    const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a78bfa', '#ec4899', '#6b7280'];

    if (breakdown === 'client') {
      const byClient = await getPrisma().invoice.groupBy({
        by: ['clientId'],
        where: { invoiceDate: { gte: startDate } },
        _sum: { totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 6
      });
      const clientIds = byClient.map(c => c.clientId);
      const clientNames = await getPrisma().client.findMany({ where: { id: { in: clientIds } }, select: { id: true, name: true } });
      const nameMap = Object.fromEntries(clientNames.map(c => [c.id, c.name]));
      breakdownData = byClient.map((c, i) => ({
        name: nameMap[c.clientId] || 'Unknown',
        value: c._sum.totalAmount || 0,
        color: COLORS[i % COLORS.length]
      }));
    } else if (breakdown === 'campaign') {
      const byCampaign = await getPrisma().invoice.groupBy({
        by: ['campaignId'],
        where: { invoiceDate: { gte: startDate }, campaignId: { not: null } },
        _sum: { totalAmount: true },
        orderBy: { _sum: { totalAmount: 'desc' } },
        take: 6
      });
      const campIds = byCampaign.filter(c => c.campaignId).map(c => c.campaignId as string);
      const campNames = await getPrisma().campaign.findMany({ where: { id: { in: campIds } }, select: { id: true, campaignName: true } });
      const campMap = Object.fromEntries(campNames.map(c => [c.id, c.campaignName]));
      breakdownData = byCampaign.map((c, i) => ({
        name: campMap[c.campaignId as string] || 'Direct',
        value: c._sum.totalAmount || 0,
        color: COLORS[i % COLORS.length]
      }));
    } else if (breakdown === 'site') {
      // Expense by category as proxy for site breakdown
      const byCategory = await getPrisma().expense.groupBy({
        by: ['category'],
        where: { date: { gte: startDate } },
        _sum: { amount: true },
        orderBy: { _sum: { amount: 'desc' } }
      });
      breakdownData = byCategory.map((c, i) => ({
        name: c.category,
        value: c._sum.amount || 0,
        color: COLORS[i % COLORS.length]
      }));
    }

    // ── Recent Invoices ───────────────────────────────────────────────────────
    const recentInvoices = await getPrisma().invoice.findMany({
      take: 5,
      orderBy: { invoiceDate: 'desc' },
      include: { client: true, campaign: true }
    });

    res.json({
      kpis: {
        revenue: `₹${(totalRev / 100000).toFixed(1)}L`,
        campaigns: activeCampaignsCount.toString(),
        outstanding: `₹${((outstandingAgg._sum.totalAmount || 0) / 100000).toFixed(1)}L`,
        profit: `₹${((totalRev - totalExp) / 100000).toFixed(1)}L`
      },
      revenue: revenueTrend,
      breakdown: breakdownData,
      invoices: recentInvoices
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
