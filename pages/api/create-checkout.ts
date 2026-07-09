import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { priceId, plan, email } = req.body;
  const resolvedPriceId = priceId || (plan === 'pro' ? 'price_1Tjlmz5T5WOtD5yfSDDkQofp' : null);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: resolvedPriceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
      },
      success_url: `https://seruchores.vercel.app/dashboard?success=true`,
      cancel_url: `https://seruchores.vercel.app/pricing`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
}