import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testProfiles() {
  const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' });
  console.log("Profiles check:", { data, error });

  const { data: enumData, error: enumError } = await supabase.rpc('get_user_role');
  console.log("Enum check:", { enumData, enumError });
}

testProfiles();
