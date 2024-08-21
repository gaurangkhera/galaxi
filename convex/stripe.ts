"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import Stripe from "stripe";
import { internal } from "./_generated/api";

export const pay = action({
  args: {
    priceId: v.string()
  },
  async handler(ctx, args) {
    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe('sk_test_51PpSY4SGnnk5ihT8oUq50Lcl6ikJ5Gv1odoJBLpNQhuZBDmlM16p9Q6f72pzCCu7W97fHMCYpzu6iVGJOd0R0sPe00IOFI1K0g', {
      apiVersion: "2024-06-20",
    });
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: args.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      billing_address_collection: "required",
      success_url: `${domain}`,
      cancel_url: `${domain}`,
    });

    await ctx.runMutation(internal.payments.markPending, {
      stripeId: session.id,
    });

    console.log(session.url)
    return session.url;

  },
})

export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async ({ runMutation }, { signature, payload }) => {
    const stripe = new Stripe('sk_test_51PpSY4SGnnk5ihT8oUq50Lcl6ikJ5Gv1odoJBLpNQhuZBDmlM16p9Q6f72pzCCu7W97fHMCYpzu6iVGJOd0R0sPe00IOFI1K0g', {
      apiVersion: "2024-06-20",
    });

    const webhookSecret = 'we_1PpSijSGnnk5ihT8iQtRFbwq';
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      if (event.type === "checkout.session.completed") {
        const stripeId = (event.data.object as { id: string }).id;
        await runMutation(internal.payments.fulfill, { stripeId });
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});