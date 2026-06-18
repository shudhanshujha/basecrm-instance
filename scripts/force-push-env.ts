import { execSync } from 'child_process';

const env = {
  "NEXT_PUBLIC_SUPABASE_URL": "https://cyaznzqwpvurdfydzxxv.supabase.co",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YXpuenF3cHZ1cmRmeWR6eHh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2OTI2NjUsImV4cCI6MjA5NzI2ODY2NX0.WnD1zYLktRQtQBSLfz7tW0JNUwtg2HHPQfPZ_j0XQfo",
  "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5YXpuenF3cHZ1cmRmeWR6eHh2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY5MjY2NSwiZXhwIjoyMDk3MjY4NjY1fQ.some-key",
  "R2_ACCESS_KEY_ID": "005628a9b5421f60000000001",
  "R2_SECRET_ACCESS_KEY": "K005MvB8PFrpRPGJk2EHUi0CS4IT0s8",
  "R2_ENDPOINT": "https://s3.us-east-005.backblazeb2.com",
  "R2_BUCKET_NAME": "basecrm-files",
  "DATABASE_URL": "postgresql://postgres.cyaznzqwpvurdfydzxxv:7545006695%40Mayank@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres",
  "NEXTAUTH_SECRET": "7a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d"
};

for (const [key, value] of Object.entries(env)) {
  console.log(`Setting ${key} on Vercel...`);
  try {
    // Remove existing to avoid conflict
    execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'ignore' });
    // Add value
    execSync(`echo "${value}" | npx vercel env add ${key} production`, { stdio: 'ignore' });
    console.log(`✅ ${key} added.`);
  } catch (err) {
    console.log(`❌ Failed to add ${key}.`);
  }
}
