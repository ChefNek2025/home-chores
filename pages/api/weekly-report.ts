import Anthropic from '@anthropic-ai/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { familyId } = req.body;

  try {
    // Get family data
    const { data: family } = await supabase.from('families').select('*').eq('id', familyId).single();
    const { data: kids } = await supabase.from('kids').select('*').eq('family_id', familyId);
    const { data: chores } = await supabase.from('chores').select('*').eq('family_id', familyId);
    const { data: payments } = await supabase.from('payments').select('*').eq('family_id', familyId);

    // Build context for AI
    const context = `
Family: ${family?.name}
Kids: ${kids?.map(k => `${k.name} (age ${k.age})`).join(', ')}
Total chores assigned: ${chores?.length || 0}
Chores: ${chores?.map(c => `${c.name} ($${c.pay_per_completion})`).join(', ')}
Total paid out this month: $${payments?.reduce((a, p) => a + p.amount, 0).toFixed(2) || '0.00'}
    `;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `You are a friendly family assistant for Seru Chores app. Write a warm, encouraging weekly report for this family. Be specific, personal, and motivating. Use emojis. Keep it under 200 words.

${context}

Write the weekly report:`
      }]
    });

    const report = (message.content[0] as any).text;
    res.status(200).json({ report });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}