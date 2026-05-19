import fs from 'fs';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';

const env = dotenv.parse(fs.readFileSync('.env'));
const keysToPush = ['DATABASE_URL', 'NEXTAUTH_SECRET'];

for (const key of keysToPush) {
  const value = env[key];
  if (!value) continue;
  
  console.log(`Removing existing ${key}...`);
  spawnSync('npx', ['vercel', 'env', 'rm', key, 'production', '--yes'], { shell: true });

  console.log(`Adding ${key} to Vercel...`);
  // Use input to pass the value directly to stdin of the command
  const child = spawnSync('npx', ['vercel', 'env', 'add', key, 'production'], {
    input: value + '\n',
    encoding: 'utf-8',
    shell: true
  });
  
  if (child.status === 0) {
    console.log(`✅ ${key} added successfully.`);
  } else {
    console.error(`❌ Failed to add ${key}:`, child.stderr);
  }
}
