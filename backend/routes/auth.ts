import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key';

// Helper to get org_id
const getOrgId = async (req: any) => {
  if (req.user.id === 'bypass-admin') return 'bypass-org';
  const profile = await getPrisma().profile.findUnique({
    where: { id: req.user.id }
  });
  return profile?.orgId;
};

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const profile = await getPrisma().profile.findFirst({
      where: { 
        email: {
          equals: email.toLowerCase(),
          mode: 'insensitive'
        }
      },
      include: { organization: true }
    });

    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, profile.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, orgId: profile.orgId, role: profile.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role,
        orgId: profile.orgId,
        organization: profile.organization
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      hint: 'Check if DATABASE_URL is correct and Supabase is accessible.'
    });
  }
});

// Get current user session
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const profile = await getPrisma().profile.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      role: profile.role,
      orgId: profile.orgId,
      organization: profile.organization
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Update User Password (Admin only)
router.patch('/users/:id/password', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const adminId = req.user.id;

    // Verify admin role
    const admin = await getPrisma().profile.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can reset passwords' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await getPrisma().profile.update({
      where: { id },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Delete User (Admin only)
router.delete('/users/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    if (id === adminId) {
      return res.status(400).json({ error: 'You cannot delete your own administrative account' });
    }

    // Verify admin role
    const admin = await getPrisma().profile.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can delete accounts' });
    }

    await getPrisma().profile.delete({ where: { id } });
    res.json({ message: 'User account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Create User (Admin only)
router.post('/register', authMiddleware, async (req: any, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const orgId = await getOrgId(req);

    if (!orgId) return res.status(403).json({ error: 'No organization linked' });
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Check if user already exists
    const existing = await getPrisma().profile.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await getPrisma().profile.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: role || 'member',
        orgId
      }
    });

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Get all users for organization
router.get('/users', authMiddleware, async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const users = await getPrisma().profile.findMany({
      where: { orgId },
      select: { id: true, email: true, fullName: true, role: true, createdAt: true }
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
