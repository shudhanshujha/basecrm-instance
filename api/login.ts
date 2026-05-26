import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key';
const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  console.log('Login handler called');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const profile = await prisma.profile.findUnique({
      where: { email: email.toLowerCase() },
      include: { organization: true }
    });

    if (!profile) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, profile.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, orgId: profile.orgId, role: profile.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful');
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
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Login error details:', err);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message,
      hint: 'Check DATABASE_URL and Prisma connection.' 
    });
  }
}
