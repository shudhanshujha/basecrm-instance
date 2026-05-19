import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function validate() {
  console.log('--- INFRASTRUCTURE VALIDATION ---');
  
  const tables = ['organizations', 'profiles', 'clients', 'vendors', 'sites', 'campaigns', 'campaign_sites', 'invoices', 'invoice_items', 'payments', 'vendor_payments', 'expenses', 'files'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found", which is fine
      console.error(`❌ Table "${table}":`, error.message);
    } else {
      console.log(`✅ Table "${table}" exists.`);
    }
  }

  // Check RLS on files table
  console.log('\nChecking RLS on "files" table...');
  const { data: rlsCheck, error: rlsError } = await supabase.rpc('get_my_org_id');
  // Since we are using service role, we can't easily check RLS visibility without a user token,
  // but we can check if policies exist in information_schema.
  
  const { data: policies, error: polError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'files');
    
  if (polError) {
    // If pg_policies is restricted, try another way or just rely on the migration success
    console.log('Unable to query pg_policies directly via API. Relying on migration success.');
  } else if (policies && policies.length > 0) {
    console.log(`✅ ${policies.length} RLS policies found on "files" table.`);
  } else {
    console.warn('⚠️ No RLS policies found on "files" table via direct query.');
  }

  console.log('\nValidation Complete.');
}

validate();
