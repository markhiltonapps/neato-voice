# Stripe Webhook Setup Guide for Neato Voice

## 📋 **Overview**
Webhooks allow Stripe to notify your application when important events happen (like successful payments, subscription cancellations, etc.). This guide will help you set them up step-by-step.

---

## 🔧 **Step 1: Add Missing Database Columns**

Before webhooks can work, we need to add two columns to store Stripe IDs in your Supabase database.

### **1.1 - Go to Supabase SQL Editor**
1. Open https://supabase.com
2. Select your **"neato-voice"** project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"+ New query"**

### **1.2 - Run This Migration**
Copy and paste this SQL and click **"Run"**:

```sql
-- Add Stripe customer and subscription IDs to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer 
ON profiles(stripe_customer_id);

-- Add comment for documentation
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe Customer ID (cus_...)';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe Subscription ID (sub_...)';
```

✅ **Verify:** You should see "Success. No rows returned"

---

## 🌐 **Step 2: Deploy Your App (Required for Webhooks)**

Webhooks need a **public URL** to send events to. You cannot test webhooks on `localhost` without additional tools.

### **Option A: Deploy to Netlify (Recommended)**
1. Make sure all changes are committed and pushed to GitHub (already done ✅)
2. Go to https://netlify.com
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub repo: `markhiltonapps/neato-voice`
5. Configure build settings:
   - **Base directory:** `web`
   - **Build command:** `npm run build`
   - **Publish directory:** `web/out`
6. Click **"Deploy site"**

Wait for deployment to finish (usually 2-3 minutes).

7. **Get your site URL** - it will look like: `https://your-site-name.netlify.app`

---

## 🔗 **Step 3: Configure Webhook in Stripe**

### **3.1 - Open Stripe Webhooks**
1. Go to https://dashboard.stripe.com
2. Make sure **Test Mode** is ON (toggle in top-right)
3. Click **"Developers"** → **"Webhooks"**
4. Click **"+ Add endpoint"**

### **3.2 - Enter Webhook Details**
Fill in:
- **Endpoint URL:** `https://your-deployed-site.netlify.app/api/webhooks/stripe`
  - ⚠️ **Replace** `your-deployed-site` with your actual Netlify domain!
  - Example: `https://neato-voice-app.netlify.app/api/webhooks/stripe`

### **3.3 - Select Events to Listen For**
Click **"Select events"** and choose these 5 events:

1. ✅ `checkout.session.completed` - When a user completes payment
2. ✅ `customer.subscription.created` - When a new subscription starts
3. ✅ `customer.subscription.updated` - When a subscription changes (upgrade/downgrade)
4. ✅ `customer.subscription.deleted` - When a user cancels
5. ✅ `invoice.payment_failed` - When a payment fails

Click **"Add events"** → **"Add endpoint"**

### **3.4 - Get Webhook Signing Secret**
1. After creating the endpoint, you'll see it in the list
2. Click on your new endpoint
3. Look for **"Signing secret"** and click **"Reveal"**
4. It will start with `whsec_...`
5. **Copy this secret** - you'll need it in the next step

---

## 🔑 **Step 4: Add Webhook Secret to Environment Variables**

### **4.1 - Update Local .env.local**
1. Open `web/.env.local` in VS Code
2. Find the line: `STRIPE_WEBHOOK_SECRET=`
3. Replace it with: `STRIPE_WEBHOOK_SECRET=whsec_your_secret_here`
   - ⚠️ Paste your actual secret from Step 3.4

### **4.2 - Update Netlify Environment Variables**
1. Go to Netlify Dashboard
2. Click on your deployed site
3. Go to **"Site configuration"** → **"Environment variables"**
4. Click **"Add a variable"** and add these:

| Key | Value |
|-----|-------|
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Step 3.4) |
| `SUPABASE_SERVICE_ROLE_KEY` | Get from Supabase Dashboard → Settings → API → service_role key |

5. Click **"Save"**
6. Go to **"Deploys"** → **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## ✅ **Step 5: Test Your Webhook**

### **5.1 - Send a Test Event from Stripe**
1. In Stripe Dashboard, go to **"Developers"** → **"Webhooks"**
2. Click on your endpoint
3. Click **"Send test webhook"**
4. Select event: `checkout.session.completed`
5. Click **"Send test webhook"**

### **5.2 - Verify in Stripe**
- You should see a ✅ green checkmark next to the test event
- Status should say **"200 OK"**

If you see a ❌ red X or error:
- Check that your Netlify deployment is live
- Verify the webhook URL is correct
- Check Netlify function logs for errors

### **5.3 - Test Real Payment Flow**
1. Go to your deployed site: `https://your-site.netlify.app`
2. Click **"Pricing"** → **"Start Pro Trial"**
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
   - Expiration: Any future date (e.g., 12/28)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
5. Complete checkout
6. You should be redirected back to your app

### **5.4 - Verify Database Update**
1. Go to Supabase Dashboard
2. Click **"Table Editor"** → **"profiles"**
3. Find your user
4. Verify:
   - `subscription_tier` = `'pro'`
   - `subscription_status` = `'active'`
   - `stripe_customer_id` is filled in
   - `stripe_subscription_id` is filled in

---

## 🎉 **You're Done!**

Your Stripe integration is now fully functional! Here's what happens now:

1. ✅ User clicks "Start Pro Trial" → Redirected to Stripe
2. ✅ User pays → Stripe processes payment
3. ✅ Stripe sends webhook to your app
4. ✅ Your app updates database automatically
5. ✅ User gets Pro features instantly

---

## 🐛 **Troubleshooting**

### **Webhook not receiving events:**
- Check Stripe Dashboard → Webhooks → Look for errors
- Verify endpoint URL is publicly accessible
- Make sure Netlify deployment succeeded

### **Database not updating:**
- Check if `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify
- Verify webhook secret matches
- Look at Netlify function logs for errors

### **Payment succeeds but webhook fails:**
- Temporarily check "Resend failed webhooks" in Stripe
- Manually update database via Supabase admin panel as workaround
- Fix webhook issue, then Stripe will auto-retry

---

## 📝 **Next Steps**

Once everything works in Test Mode:
1. Switch Stripe to **Live Mode**
2. Recreate products/prices
3. Create new webhook endpoint (live mode uses different secrets)
4. Update all environment variables with live keys
5. Redeploy!
