/*
GOOGLE OAUTH SETUP STEPS:
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Go to APIs & Services > OAuth consent screen
4. Set User Type to External, fill in app name and email
5. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
6. Application type: Web application
7. Authorised redirect URI: https://<your-supabase-project>.supabase.co/auth/v1/callback
8. Copy Client ID and Client Secret
9. In Supabase dashboard > Authentication > Providers > Google
10. Paste Client ID and Client Secret, enable the provider
11. In your app, call: supabase.auth.signInWithOAuth({ provider: 'google' })
*/

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from './supabase';

export async function getSession(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(req, res);
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  return data.user;
}

export async function requireAuth(req: NextApiRequest, res: NextApiResponse) {
  const user = await getSession(req, res);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    throw new Error('Unauthorized');
  }
  return user;
}
