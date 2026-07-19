import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { kidId } = req.body;
  await sb.from('kids').update({ paid_this_week: false, earned_amount: 0 }).eq('id', kidId);
  res.status(200).json({ ok: true });
}