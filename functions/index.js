/**
 * FlowRecover x Life Planner — Stripe Webhook (Firebase Cloud Functions v2)
 *
 * Handles:
 *  - checkout.session.completed      → users/{uid}.subscription_status = 'pro'
 *  - customer.subscription.deleted   → users/{uid}.subscription_status = 'canceled'
 *
 * Secrets (set once):
 *  firebase functions:secrets:set STRIPE_SECRET_KEY
 *  firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
 */
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const Stripe = require("stripe");

admin.initializeApp();
const db = admin.firestore();
const { FieldValue } = admin.firestore;

const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");
const REGION = "asia-southeast1";
const PASS_MS = 30 * 24 * 3600 * 1000; // PromptPay one-time payment = 30 days of PRO

async function findUserRef({ uid, email, customerId }) {
  if (uid) {
    const ref = db.collection("users").doc(uid);
    if ((await ref.get()).exists) return ref;
  }
  if (customerId) {
    const s = await db.collection("users").where("stripe_customer_id", "==", customerId).limit(1).get();
    if (!s.empty) return s.docs[0].ref;
  }
  if (email) {
    const s = await db.collection("users").where("email", "==", email.toLowerCase()).limit(1).get();
    if (!s.empty) return s.docs[0].ref;
  }
  return null;
}

exports.stripeWebhook = onRequest(
  { region: REGION, secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");
    const stripe = new Stripe(STRIPE_SECRET_KEY.value());
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, req.headers["stripe-signature"], STRIPE_WEBHOOK_SECRET.value());
    } catch (err) {
      console.error("Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const s = event.data.object;
          if (s.payment_status !== "paid") break; // async methods: wait for async_payment_succeeded
          const email = (s.customer_details?.email || s.customer_email || "").toLowerCase();
          const ref = await findUserRef({ uid: s.client_reference_id, email, customerId: s.customer });
          const data = {
            subscription_status: "pro",
            stripe_customer_id: s.customer || null,
            pro_since: FieldValue.serverTimestamp(),
          };
          if (s.mode === "subscription") {
            // 💳 Card subscription — auto-renews until customer.subscription.deleted
            data.plan = "card_subscription";
            data.stripe_subscription_id = s.subscription || null;
            data.pro_until = FieldValue.delete();
          } else {
            // 📱 PromptPay one-time payment — 30-day pass (extends any remaining time)
            const current = ref ? (await ref.get()).data()?.pro_until?.toMillis?.() : 0;
            const base = Math.max(Date.now(), current || 0);
            data.plan = "promptpay_30d";
            data.pro_until = admin.firestore.Timestamp.fromMillis(base + PASS_MS);
          }
          if (ref) await ref.set(data, { merge: true });
          else if (email) {
            if (data.plan === "card_subscription") delete data.pro_until;
            await db.collection("pending_subscriptions").doc(email).set(data); // user signs in later
          }
          break;
        }
        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const ref = await findUserRef({ customerId: sub.customer });
          if (ref) await ref.set({ subscription_status: "canceled", canceled_at: FieldValue.serverTimestamp() }, { merge: true });
          break;
        }
        default:
          break;
      }
      return res.json({ received: true });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Internal error");
    }
  }
);

/** If someone paid before their first Google sign-in, apply the pending PRO status. */
exports.applyPendingSubscription = onDocumentCreated({ region: REGION, document: "users/{uid}" }, async (event) => {
  const email = (event.data?.data()?.email || "").toLowerCase();
  if (!email) return;
  const pendingRef = db.collection("pending_subscriptions").doc(email);
  const pending = await pendingRef.get();
  if (!pending.exists) return;
  await event.data.ref.set(pending.data(), { merge: true });
  await pendingRef.delete();
});
