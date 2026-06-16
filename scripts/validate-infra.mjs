import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function validate() {
  console.log('--- INFRASTRUCTURE VALIDATION ---');
  
  const tables = ['organizations', 'profiles', 'clients', 'vendors', 'assets', 'deals', 'activity_logs', 'invoices', 'invoice_items', 'payments', 'vendor_payments', 'expenses', 'files'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found", which is fine
      console.error(`❌ Table "${table}":`, error.message);
    } else {
      console.log(`✅ Table "${table}" exists.`);
    }
  }

  console.log('\nValidation Complete.');
}

validate();
