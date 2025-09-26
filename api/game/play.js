import { createClient } from '@supabase/supabase-js';

// Client untuk serverless (pakai Service Role Key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ambil farcaster_id dari body
  const { farcaster_id } = req.body;

  if (!farcaster_id) {
    return res.status(400).json({ error: 'Missing farcaster_id' });
  }

  // Cari user di tabel users
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('farcaster_id', farcaster_id)
    .single();

  if (userError || !user) {
    return res.status(401).json({ error: 'User not found. Please login first.' });
  }

  // Hitung jumlah percobaan hari ini
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from('plays')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfDay.toISOString());

  if (countError) {
    return res.status(500).json({ error: countError.message });
  }

  if (count >= 5) {
    return res.status(403).json({ error: 'Daily attempts exhausted' });
  }

  // Contoh logic game: roll dadu 1–6, poin sama dengan roll
  const roll = Math.floor(Math.random() * 6) + 1;
  const awarded = roll;

  // Simpan play
  const { error: playError } = await supabase
    .from('plays')
    .insert([{ user_id: user.id, points_awarded: awarded, result: { roll } }]);

  if (playError) {
    return res.status(500).json({ error: playError.message });
  }

  // Simpan poin
  const { error: pointError } = await supabase
    .from('points')
    .insert([{ user_id: user.id, amount: awarded, reason: 'play' }]);

  if (pointError) {
    return res.status(500).json({ error: pointError.message });
  }

  const attemptsLeft = 5 - (count + 1);
  return res.status(200).json({ roll, awarded, attemptsLeft });
}