import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const TIER_CONFIG = {
  FREE: { tier: 'FREE', credits: 10000 },
  PRO: { tier: 'PRO', credits: 100000 },
  STUDIO: { tier: 'STUDIO', credits: 500000 },
};

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription as string;
          const customerId = session.customer as string;

          const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
            expand: ['items.data.price'],
          });

          const priceId = subscription.items.data[0].price.id;
          const tier = getTierFromPriceId(priceId);

          await prisma.user.update({
            where: { stripeCustomerId: customerId },
            data: {
              stripeSubscriptionId: subscriptionId,
              subscriptionTier: tier.tier as any,
              subscriptionStatus: 'ACTIVE',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              creditsLimit: tier.credits,
              creditsUsed: 0,
            },
          });

          const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
          if (user) {
            await prisma.creditTransaction.create({
              data: {
                userId: user.id,
                amount: tier.credits,
                type: 'BONUS',
                description: `Subscribed to ${tier.tier}`,
                stripeEventId: event.id,
              },
            });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          await prisma.user.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              subscriptionStatus: 'ACTIVE',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;
        if (subscriptionId) {
          await prisma.user.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: 'PAST_DUE' },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            subscriptionTier: 'FREE',
            subscriptionStatus: 'CANCELED',
            stripeSubscriptionId: null,
            creditsLimit: 10000,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

function getTierFromPriceId(priceId: string) {
  const map: Record<string, keyof typeof TIER_CONFIG> = {
    [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: 'PRO',
    [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: 'PRO',
    [process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID!]: 'STUDIO',
    [process.env.STRIPE_STUDIO_YEARLY_PRICE_ID!]: 'STUDIO',
  };
  const tier = map[priceId] || 'FREE';
  return TIER_CONFIG[tier];
}