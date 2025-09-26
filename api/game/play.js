import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role key
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { farcaster_id } = req.body;

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('farcaster_id', farcaster_id)
    .single();

  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  const today = new Date().toISOString().split('T')[0];

  const { data: existing } = await supabase
    .from('checkins')
    .select('id')
    .eq('user_id', user.id)
    .eq('checked_at', today)
    .single();

  if (existing) {
    return res.status(200).json({ message: 'Already checked in today' });
  }

  await supabase.from('checkins').insert({
    user_id: user.id,
    checked_at: today,
  });

  await supabase.from('points').insert({
    user_id: user.id,
    amount: 10,
    reason: 'daily_checkin'
  });

  res.status(200).json({ message: 'Check-in successful, +10 points awarded!' });
}