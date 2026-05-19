import { execSync } from 'child_process';

const env = {
  "NEXT_PUBLIC_SUPABASE_URL": "https://szqottgjdluhenzkqspi.supabase.co",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cW90dGdqZGx1aGVuemtxc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTA0ODEsImV4cCI6MjA5NDA2NjQ4MX0.q3Uzfj5XSxZzB6IvcZ4tci5it5c9Aydy_NQqpTuzX1Q",
  "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cW90dGdqZGx1aGVuemtxc3BpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ5MDQ4MSwiZXhwIjoyMDk0MDY2NDgxfQ.ut0DG0icDydQc3USOGUfMGM3HbKv7nkX0vBrY4BEwuM",
  "R2_ACCESS_KEY_ID": "0051d5efe7a49340000000001",
  "R2_SECRET_ACCESS_KEY": "K005WOYRFHRXthfXrz+uVeFBG7gh5io",
  "R2_ENDPOINT": "https://s3.us-east-005.backblazeb2.com",
  "R2_BUCKET_NAME": "drishtivision-crm-files",
  "DATABASE_URL": "postgresql://postgres.szqottgjdluhenzkqspi:Aditya%40Aditya123@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres",
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
