import fs from 'fs';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const env = dotenv.parse(fs.readFileSync('.env'));

for (const [key, value] of Object.entries(env)) {
  console.log(`Adding ${key} to Vercel...`);
  try {
    // Escape special characters for shell
    const escapedValue = value.replace(/"/g, '\\"');
    execSync(`npx vercel env add ${key} production "${escapedValue}" --yes`, { stdio: 'inherit' });
  } catch (err: any) {
    console.error(`Failed to add ${key}:`, err.message);
  }
}
