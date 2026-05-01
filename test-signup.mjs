import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testSignup() {
  const email = `test-${Date.now()}@test.com`;
  console.log(`Attempting to sign up ${email}...`);
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'password123',
    user_metadata: { role: 'seller', full_name: 'Test Seller' },
    email_confirm: true
  });

  if (error) {
    console.error("Signup failed:", error);
  } else {
    console.log("Signup successful:", data.user.id);
  }
}

testSignup();
