import fs from 'fs';
import { spawnSync } from 'child_process';
import dotenv from 'dotenv';

if (!fs.existsSync('.env')) {
  console.error('.env file not found');
  process.exit(1);
}

const env = dotenv.parse(fs.readFileSync('.env'));

for (const [key, value] of Object.entries(env)) {
  if (!value) continue;
  
  console.log(`Setting ${key} on Vercel...`);
  
  // Use spawnSync to pass value via stdin to avoid shell escaping issues and visible secrets in process list
  const child = spawnSync('npx', ['vercel', 'env', 'add', key, 'production'], {
    input: value + '\n', // Vercel CLI expects value followed by newline if prompted, or we use --yes if it supports it
    encoding: 'utf-8',
    shell: true
  });

  if (child.status !== 0) {
    // If it failed, maybe it exists? Try to pull or check
    console.log(`Note: ${key} might already exist or had an issue.`);
  } else {
    console.log(`Successfully added ${key}`);
  }
}
