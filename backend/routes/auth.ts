import { Router } from 'express';
import { getPrisma } from '../prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';
import { getOrgId } from '../middleware/org.js';

const router = Router();
const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key';

// Helper to build token payload
const buildToken = (profile: any) =>
  jwt.sign(
    { id: profile.id, email: profile.email, orgId: profile.orgId, role: profile.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

// Helper to build user response shape
const buildUserResponse = (profile: any) => ({
  id: profile.id,
  email: profile.email,
  fullName: profile.fullName,
  role: profile.role,
  orgId: profile.orgId,
  authProvider: profile.authProvider,
  onboardingCompleted: profile.onboardingCompleted,
  organization: profile.organization,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/login  — email + password login
// ─────────────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const profile = await getPrisma().profile.findFirst({
      where: { email: email.toLowerCase() },
      include: { organization: true }
    });

    if (!profile) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // OAuth-only accounts won't have a password
    if (!profile.password) {
      return res.status(401).json({ error: 'This account is not configured with a password. Please contact your administrator to set up password-based authentication.' });
    }

    const isPasswordValid = await bcrypt.compare(password, profile.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = buildToken(profile);

    res.status(200).json({
      token,
      needsOnboarding: !profile.onboardingCompleted,
      user: buildUserResponse(profile),
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

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/signup  — email + password self-service signup
// ─────────────────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, companyName } = req.body;

    if (!email || !password || !fullName || !companyName) {
      return res.status(400).json({ error: 'Email, password, full name, and company name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await getPrisma().profile.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await getPrisma().$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: companyName,
          slug,
          onboardingCompleted: false,
          onboardingStep: 0,
        }
      });

      const profile = await tx.profile.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          fullName,
          role: 'admin',
          orgId: org.id,
          authProvider: 'email',
          onboardingCompleted: false,
        },
        include: { organization: true }
      });

      return profile;
    });

    const token = buildToken(result);

    res.status(201).json({
      token,
      needsOnboarding: true,
      user: buildUserResponse(result),
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account', details: error.message });
  }
});



// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/me  — get current user session
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const profile = await getPrisma().profile.findUnique({
      where: { id: req.user.id },
      include: { organization: true }
    });

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(buildUserResponse(profile));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/onboarding/complete  — mark onboarding done + save org details
// ─────────────────────────────────────────────────────────────────────────────
router.post('/onboarding/complete', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const {
      orgName,
      phone,
      address,
      gstin,
      panNumber,
      taxMode,
      bankName,
      accountNumber,
      ifscCode,
      upiId,
    } = req.body;

    const profile = await getPrisma().profile.findUnique({
      where: { id: userId },
      include: { organization: true }
    });

    if (!profile) return res.status(404).json({ error: 'User not found' });

    // Update organization with the onboarding details
    const updatedOrg = await getPrisma().organization.update({
      where: { id: profile.orgId },
      data: {
        ...(orgName && { name: orgName }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(gstin && { gstin }),
        ...(panNumber && { panNumber }),
        ...(taxMode && { taxMode }),
        ...(bankName && { bankName }),
        ...(accountNumber && { accountNumber }),
        ...(ifscCode && { ifscCode }),
        ...(upiId && { upiId }),
        onboardingCompleted: true,
        onboardingStep: 999,
      }
    });

    // Mark the profile as onboarded too
    const updatedProfile = await getPrisma().profile.update({
      where: { id: userId },
      data: { onboardingCompleted: true },
      include: { organization: true }
    });

    const token = buildToken(updatedProfile);

    res.json({
      token,
      needsOnboarding: false,
      user: buildUserResponse(updatedProfile),
      organization: updatedOrg,
    });
  } catch (error: any) {
    console.error('Onboarding complete error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding', details: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /auth/organization/:id  — Update Organization Details
// ─────────────────────────────────────────────────────────────────────────────
router.put('/organization/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const profile = await getPrisma().profile.findUnique({
      where: { id: req.user.id }
    });

    if (!profile || profile.orgId !== id) {
      return res.status(403).json({ error: 'Unauthorized to update this organization' });
    }

    const updatedOrg = await getPrisma().organization.update({
      where: { id },
      data: {
        name: req.body.name,
        taxMode: req.body.taxMode,
        gstin: req.body.gstin,
        panNumber: req.body.panNumber,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        bankName: req.body.bankName,
        bankBranch: req.body.bankBranch,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        upiId: req.body.upiId,
        msmeRegNo: req.body.msmeRegNo,
        logoUrl: req.body.logoUrl,
        accentColor: req.body.accentColor
      }
    });

    res.json(updatedOrg);
  } catch (error) {
    console.error('Org update error:', error);
    res.status(500).json({ error: 'Failed to update organization' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /auth/password  — Change own password (requires current password)
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/password', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const profile = await getPrisma().profile.findUnique({ where: { id: userId } });
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!profile.password) {
      return res.status(400).json({ error: 'OAuth accounts cannot change password here. Use your provider.' });
    }

    const isValid = await bcrypt.compare(currentPassword, profile.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await getPrisma().profile.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /auth/users/:id/password  — Admin: reset any user's password
// ─────────────────────────────────────────────────────────────────────────────
router.patch('/users/:id/password', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const adminId = req.user.id;

    const admin = await getPrisma().profile.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can reset passwords' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const targetUser = await getPrisma().profile.findUnique({ where: { id } });
    if (!targetUser || targetUser.orgId !== admin.orgId) {
      return res.status(403).json({ error: 'User not found in your organization' });
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

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /auth/users/:id  — Admin: delete a user
// ─────────────────────────────────────────────────────────────────────────────
router.delete('/users/:id', authMiddleware, async (req: any, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    if (id === adminId) {
      return res.status(400).json({ error: 'You cannot delete your own administrative account' });
    }

    const admin = await getPrisma().profile.findUnique({ where: { id: adminId } });
    if (admin?.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can delete accounts' });
    }

    const targetUser = await getPrisma().profile.findUnique({ where: { id } });
    if (!targetUser || targetUser.orgId !== admin.orgId) {
      return res.status(403).json({ error: 'User not found in your organization' });
    }

    await getPrisma().profile.delete({ where: { id } });
    res.json({ message: 'User account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/register  — Admin: create a team member
// ─────────────────────────────────────────────────────────────────────────────
router.post('/register', authMiddleware, async (req: any, res) => {
  try {
    const { email, password, fullName, role } = req.body;
    const orgId = await getOrgId(req);

    if (!orgId) return res.status(403).json({ error: 'No organization linked' });
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const normalizedEmail = email.toLowerCase();
    const existing = await getPrisma().profile.findUnique({ where: { email: normalizedEmail } });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await getPrisma().profile.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        fullName,
        role: role || 'member',
        orgId,
        authProvider: 'email',
        onboardingCompleted: true, // team members skip onboarding
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

// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/users  — List organization users
// ─────────────────────────────────────────────────────────────────────────────
router.get('/users', authMiddleware, async (req: any, res) => {
  try {
    const orgId = await getOrgId(req);
    const userRole = req.user.role;

    if (!orgId) return res.status(403).json({ error: 'No organization linked' });

    const query: any = { 
      where: { 
        orgId,
        role: userRole === 'super_admin' ? undefined : { not: 'super_admin' }
      },
      select: { id: true, email: true, fullName: true, role: true, authProvider: true, createdAt: true }
    };

    const users = await getPrisma().profile.findMany(query);
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
