import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { kidId, familyId, kidName, amount } = req.body;
  await supabase.from('kids').update({ paid_this_week: true, earned_amount: 0 }).eq('id', kidId);
  await supabase.from('payments').insert({ family_id: familyId, kid_id: kidId, kid_name: kidName, amount, paid_at: new Date().toISOString() });
  res.status(200).json({ ok: true });
}