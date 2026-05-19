import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';

const router = Router();

// Get all vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await getPrisma().vendor.findMany({
      include: { sites: true, payments: true }
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getPrisma().vendor.findUnique({
      where: { id },
      include: { sites: true, payments: true }
    });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Create vendor
router.post('/', async (req, res) => {
  try {
    const vendor = await getPrisma().vendor.create({
      data: req.body
    });
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Update vendor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getPrisma().vendor.update({
      where: { id },
      data: req.body
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// Update vendor status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const vendor = await getPrisma().vendor.update({
      where: { id },
      data: { status }
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor status' });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await getPrisma().vendor.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

// Add vendor payment
router.post('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, month, year, paymentMode, referenceNumber, purpose, notes } = req.body;
    
    // Create VendorPayment
    const payment = await getPrisma().vendorPayment.create({
      data: {
        orgId: (req as any).user.orgId,
        vendorId: id,
        amount: parseFloat(amount),
        paymentDate: new Date(paymentDate),
        month: parseInt(month),
        year: parseInt(year),
        paymentMode,
        referenceNumber,
        purpose,
        notes
      }
    });

    // Automatically log it in general Expenses as well for the P&L
    await getPrisma().expense.create({
      data: {
        orgId: (req as any).user.orgId,
        date: new Date(paymentDate),
        category: 'VENDOR_PAYOUT',
        amount: parseFloat(amount),
        description: `Vendor Payout: ${purpose || 'Misc'}`,
        paymentMode,
        referenceNumber
      }
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Failed to add vendor payment:', error);
    res.status(500).json({ error: 'Failed to add vendor payment' });
  }
});

export default router;
