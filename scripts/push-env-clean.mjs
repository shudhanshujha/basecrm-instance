import fs from 'fs';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';

// Parse .env manually to preserve actual values
const envFile = fs.readFileSync('.env', 'utf-8');
const env = dotenv.parse(envFile);

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

console.log('--- CLEAN VERCEL ENVIRONMENT PUSHER ---');

for (const key of keysToPush) {
  let value = env[key];
  if (!value) {
    console.warn(`⚠️ Key ${key} is missing in .env, skipping.`);
    continue;
  }
  
  // Clean value from trailing carriage returns, newlines, and quotes
  value = value.trim().replace(/^["']|["']$/g, '');

  console.log(`\nRemoving existing ${key} from Vercel...`);
  spawnSync('npx', ['vercel', 'env', 'rm', key, 'production', '--yes'], { shell: true, stdio: 'ignore' });

  console.log(`Pushing clean ${key} to Vercel...`);
  
  // Use Vercel's standard non-interactive value argument
  const child = spawnSync('npx', ['vercel', 'env', 'add', key, 'production', '--value', value, '--yes'], {
    encoding: 'utf-8',
    shell: true
  });
  
  if (child.status === 0) {
    console.log(`✅ ${key} pushed successfully!`);
  } else {
    console.error(`❌ Failed to push ${key}:`, child.stderr || child.stdout);
  }
}

console.log('\n--- ENVIRONMENT SYNC COMPLETE ---');
