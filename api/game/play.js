import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { farcaster_id } = req.body;

    // cek user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    if (!user) {
      // kalau belum ada user → insert
      await supabase.from('users').insert({ farcaster_id });
    }

    // logika roll dadu
    const roll = Math.ceil(Math.random() * 6);
    const awarded = roll; // contoh: poin = angka dadu

    // simpan hasil main
    await supabase.from('games').insert({
      farcaster_id,
      roll,
      points: awarded,
    });

    return res.status(200).json({
      message: 'Play successful',
      roll,
      awarded,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}