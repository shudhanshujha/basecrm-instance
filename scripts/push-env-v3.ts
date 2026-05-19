import fs from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

if (!fs.existsSync('.env')) {
  console.error('.env file not found');
  process.exit(1);
}

const env = dotenv.parse(fs.readFileSync('.env'));
const keysToPush = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_ENDPOINT',
  'R2_BUCKET_NAME'
];

for (const key of keysToPush) {
  const value = env[key];
  if (!value) {
    console.log(`Skipping ${key} (no value found locally)`);
    continue;
  }
  
  console.log(`Adding ${key} to Vercel...`);
  try {
    // Pipe the value to avoid it being visible in the command line logs or history
    execSync(`echo "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} production`, { stdio: 'ignore' });
    console.log(`✅ ${key} added.`);
  } catch (err) {
    console.log(`❌ Failed to add ${key} (it might already exist).`);
  }
}
