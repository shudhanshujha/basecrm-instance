import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'super-secret-key';
const API_URL = 'https://drishtivision-crm.vercel.app/api';

async function test() {
  const profileId = 'ad480500-038d-4877-ab9e-026412ce33d3'; 
  const orgId = '315dfc7c-de74-4728-a96d-a9c20c3fecf5';

  const token = jwt.sign(
    { id: profileId, email: 'admin@test.com', orgId: orgId, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log(token);
}

test();
