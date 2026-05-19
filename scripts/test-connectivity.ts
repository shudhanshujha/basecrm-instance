
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('--- Database Connectivity Check ---');
  console.log('Database URL:', process.env.DATABASE_URL?.split('@')[1] || 'NOT FOUND');

  try {
    // 1. Basic Connection
    console.log('\n1. Testing Basic Connection...');
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Result:', result);
    console.log('✅ Connection successful');

    // 2. GST Billing Data Check
    console.log('\n2. Testing GST Billing Data (Invoices)...');
    const invoiceCount = await prisma.invoice.count();
    console.log(`Invoice count: ${invoiceCount}`);
    
    if (invoiceCount > 0) {
      const sampleInvoice = await prisma.invoice.findFirst({
        select: {
          invoiceNumber: true,
          cgstAmount: true,
          sgstAmount: true,
          igstAmount: true,
          taxableAmount: true,
          totalAmount: true
        }
      });
      console.log('Sample GST Data from Invoice:', sampleInvoice);
      console.log('✅ Invoice table accessible');
    } else {
      console.log('ℹ️ No invoices found, but table is accessible.');
    }

    // 3. P&L Data Check (Expenses & Payments)
    console.log('\n3. Testing P&L Data (Expenses & Payments)...');
    const expenseCount = await prisma.expense.count();
    const paymentCount = await prisma.payment.count();
    const vendorPaymentCount = await prisma.vendorPayment.count();

    console.log(`Expense count: ${expenseCount}`);
    console.log(`Payment count: ${paymentCount}`);
    console.log(`Vendor Payment count: ${vendorPaymentCount}`);

    console.log('✅ P&L related tables accessible');

    // 4. Analytics Summary (Simulation)
    console.log('\n4. Running Analytics Summary Simulation...');
    const revenue = await prisma.invoice.aggregate({
      _sum: { totalAmount: true }
    });
    const expenses = await prisma.expense.aggregate({
      _sum: { amount: true }
    });
    const vendorPayments = await prisma.vendorPayment.aggregate({
      _sum: { amount: true }
    });

    console.log('Summary:');
    console.log(`- Total Revenue: ${revenue._sum.totalAmount || 0}`);
    console.log(`- Total Expenses: ${expenses._sum.amount || 0}`);
    console.log(`- Total Vendor Payouts: ${vendorPayments._sum.amount || 0}`);
    console.log(`- Net Profit (Approx): ${(revenue._sum.totalAmount || 0) - ((expenses._sum.amount || 0) + (vendorPayments._sum.amount || 0))}`);

  } catch (error) {
    console.error('\n❌ Connectivity Check Failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
