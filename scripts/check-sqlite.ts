
import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./dev.db',
      },
    },
  });

  console.log('--- SQLite (dev.db) Content Check ---');

  try {
    const invoiceCount = await prisma.invoice.count();
    const expenseCount = await prisma.expense.count();
    const paymentCount = await prisma.payment.count();

    console.log(`Invoice count: ${invoiceCount}`);
    console.log(`Expense count: ${expenseCount}`);
    console.log(`Payment count: ${paymentCount}`);

    if (invoiceCount > 0) {
        const sample = await prisma.invoice.findFirst();
        console.log('Sample Invoice:', sample);
    }
  } catch (error) {
    console.error('Error reading dev.db:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
