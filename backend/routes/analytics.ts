import { Router } from 'express';
import prisma from '../prismaClient';
import { subMonths } from 'date-fns';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const now = new Date();
    
    // Financial Analytics (3m, 6m, 1y)
    const getFinancials = async (months: number) => {
      const startDate = subMonths(now, months);
      
      const invoiceAgg = await prisma.invoice.aggregate({
        where: { invoiceDate: { gte: startDate } },
        _sum: { totalAmount: true }
      });
      
      const expenseAgg = await prisma.expense.aggregate({
        where: { date: { gte: startDate } },
        _sum: { amount: true }
      });

      const vendorAgg = await prisma.vendorPayment.aggregate({
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
    const invoiceGstAgg = await prisma.invoice.aggregate({
      _sum: { cgstAmount: true, sgstAmount: true, igstAmount: true, taxableAmount: true }
    });

    const expenseGstAgg = await prisma.expense.aggregate({
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
    
    // For P&L, we need all expenses, not just the ones with GST (Fixed bug)
    const allExpensesMin = await prisma.expense.findMany({
      select: { taxableAmount: true, amount: true }
    });
    const totalDirectExpenses = allExpensesMin.reduce((sum, exp) => sum + (exp.taxableAmount || exp.amount), 0);
    
    const allVendorPaymentsAgg = await prisma.vendorPayment.aggregate({
      _sum: { amount: true }
    });
    const totalVendorPayouts = allVendorPaymentsAgg._sum.amount || 0;

    const plReport = {
      income: totalRevenue,
      expenses: {
        direct: totalVendorPayouts,
        indirect: totalDirectExpenses,
        total: totalVendorPayouts + totalDirectExpenses
      },
      grossProfit: totalRevenue - totalVendorPayouts,
      netProfit: totalRevenue - (totalVendorPayouts + totalDirectExpenses)
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
        balance: gstBalance
      },
      plReport
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

export default router;
