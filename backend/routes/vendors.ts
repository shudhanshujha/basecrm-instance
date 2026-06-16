import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Apply auth middleware
router.use(authMiddleware);

// Helper to get org_id
const getOrgId = async (req: any) => {
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

// Get all vendors
router.get('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const vendors = await getPrisma().vendor.findMany({
      where: { orgId },
      include: { vendorContracts: true, vendorPayments: true }
    });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// Get single vendor
router.get('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const vendor = await getPrisma().vendor.findFirst({
      where: { id, orgId },
      include: { vendorContracts: true, vendorPayments: true }
    });
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vendor' });
  }
});

// Create vendor
router.post('/', async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const vendor = await getPrisma().vendor.create({
      data: {
        ...req.body,
        orgId
      }
    });
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Create vendor error:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
});

// Update vendor
router.put('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const vendor = await getPrisma().vendor.update({
      where: { id, orgId },
      data: req.body
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// Update vendor status
router.patch('/:id/status', async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const vendor = await getPrisma().vendor.update({
      where: { id, orgId },
      data: { status }
    });
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vendor status' });
  }
});

// Delete vendor
router.delete('/:id', async (req: any, res) => {
  try {
    const { id } = req.params;
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const existing = await getPrisma().vendor.findFirst({ where: { id, orgId } });
    if (!existing) return res.status(404).json({ error: 'Vendor not found' });

    await getPrisma().$transaction(async (tx) => {
      // Delete vendor payments first
      await tx.vendorPayment.deleteMany({ where: { vendorId: id } });
      // Delete vendor contracts
      await tx.vendorContract.deleteMany({ where: { vendorId: id } });
      // Delete the vendor
      await tx.vendor.delete({ where: { id } });
    });

    res.status(204).send();
  } catch (error) {
    console.error(`[API ERROR] Failed to delete vendor ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
});

// Add vendor payment
router.post('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, paymentDate, month, year, paymentMode, referenceNumber, purpose, notes } = req.body;
    const orgId = await getOrgId(req);
    
    // Create VendorPayment
    const payment = await getPrisma().vendorPayment.create({
      data: {
        orgId: orgId!,
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
        orgId: orgId!,
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
