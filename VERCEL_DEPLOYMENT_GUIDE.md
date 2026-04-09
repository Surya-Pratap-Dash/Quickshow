# 🚀 Deploy QuickShow to Vercel (Both Server & Client)

## ✨ Benefits of Using Vercel for Both

- ✅ **Simpler Setup** - No need for separate Render account
- ✅ **Same Domain** - Server & Client on same Vercel URL
- ✅ **Automatic CORS** - No cross-origin issues
- ✅ **Free Tier** - Both frontend and backend covered
- ✅ **Auto Deployments** - Deploys on every git push
- ✅ **Zero Config** - Vercel auto-detects your setup

---

## 📋 Prerequisites

Before deploying, you need:

1. **GitHub Account** - Push code to GitHub
2. **Vercel Account** - Free at vercel.com
3. **All Environment Variables Ready** - See `.env.example` files
4. **Aiven MySQL Database** - Already configured
5. **Clerk** - App configured
6. **Stripe** - Setup complete
7. **TMDB API Key** - Ready
8. **Inngest** - Project created

---

## 🎯 Step 1: Prepare Code for Deployment

### Clean Unnecessary Files

```bash
# Remove old Render config (no longer needed)
rm server/render.yaml

# Remove test files (optional - keeps them for debugging)
rm server/test-*.js
```

### Update Package.json

Everything is already configured. The root `package.json` has:
- `dev` - Runs both client and server locally
- `build` - Builds client for production
- `start` - Starts server

---

## 🔼 Step 2: Push Code to GitHub

```bash
# Navigate to project root
cd QuickShow-main

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment (both server and client)"

# Push to GitHub (main or master branch)
git push origin main
```

---

## 🌐 Step 3: Deploy to Vercel

### 3.1 Create Vercel Project (Server)

1. Go to **[vercel.com](https://vercel.com/dashboard)**
2. Click **"Add New..."** → **"Project"**
3. **Import Repository:**
   - Select your GitHub repo (QuickShow-main)
   - Click **"Import"**

4. **Configure Project:**
   - **Project Name:** `quickshow-server` (or similar)
   - **Framework Preset:** `Other`
   - **Root Directory:** `server`
   - **Build Command:** Leave empty (not needed for server)
   - **Output Directory:** Leave empty
   - Click **"Deploy"**

5. Wait for deployment (2-3 minutes)
6. Note your Vercel URL: `https://quickshow-server.vercel.app`

### 3.2 Create Vercel Project (Client)

1. Go back to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import Same Repository**
4. **Configure Project:**
   - **Project Name:** `quickshow-client`
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - Click **"Deploy"**

5. Wait for deployment (3-5 minutes)
6. Note your Vercel URL: `https://quickshow-client.vercel.app`

---

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Server Environment Variables

Go to Vercel Dashboard → `quickshow-server` → **Settings** → **Environment Variables**

Add the following variables:

```bash
# Database (Copy from your Aiven account)
DB_HOST=quickshowdb-767-suryadashpratap-07e5.i.aivencloud.com
DB_USER=avnadmin
DB_PASS=YOUR_DB_PASSWORD
DB_NAME=quickshow_db
DB_PORT=23918

# Server Config
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://quickshow-client.vercel.app

# Clerk (from your Clerk dashboard)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...

# Email
EMAIL_ID=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# TMDB
TMDB_API_KEY=546a7d0aa815105bb8f0a988061183c1

# Inngest
INNGEST_EVENT_KEY=l0qvsNbE3SRKv6QEnEB7JiFo417GZVrOtqXDDODcZutBqiMkRJvH7dIttgxS_91PAnJLPIuu1Vg6dw2AuhX8tA
INNGEST_SIGNING_KEY=signkey-prod-b3262b2e7d19f0989734eb669c038d7ac2df8828697a25f8d39c71e0388463e8

# JWT
JWT_SECRET=Surya_Pratap_B124139
```

**Click "Save" after each variable, or add all and save together.**

### 4.2 Client Environment Variables

Go to Vercel Dashboard → `quickshow-client` → **Settings** → **Environment Variables**

Add:

```bash
# API Base URL (Your server URL)
VITE_BASE_URL=https://quickshow-server.vercel.app

# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dG91Z2gtc2t1bmstNTUuY2xlcmsuYWNjb3VudHMuZGV2JA

# TMDB
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TIUPNDTC9R9dauOJ2UnovOarhzURjJaQ2XxqYyeILFQBUUIDmY1NkL0zoxvEpTT6EdZ0q77HnNQc2wf3JFW6g44007oHexW5G

# Currency
VITE_CURRENCY=$
```

---

## 🔗 Step 5: Update External Services

### 5.1 Update Clerk Webhook

1. Go to **[Clerk Dashboard](https://dashboard.clerk.com)**
2. Select your app
3. Go to **Webhooks** → Edit your endpoint
4. Change URL from old URL to:
   ```
   https://quickshow-server.vercel.app/api/inngest
   ```
5. Save

### 5.2 Update Stripe Webhook (Optional)

If you have Stripe webhooks configured, update them:
```
https://quickshow-server.vercel.app/api/stripe
```

---

## 🧪 Step 6: Test Everything

### Test Server API

```bash
# Check if server is running
curl https://quickshow-server.vercel.app/

# Should return: "Server is Live!"
```

### Test Client

```bash
# Visit in browser
https://quickshow-client.vercel.app

# Check browser console for any errors
```

### Test Database Connection

```bash
# Check if users endpoint works
curl https://quickshow-server.vercel.app/api/test/all-users
```

### Test Webhook Events

```bash
# Check if webhooks are being received
curl https://quickshow-server.vercel.app/api/debug/clerk-webhooks
```

---

## ✅ Verification Checklist

- [ ] Code pushed to GitHub
- [ ] Server deployed on Vercel
- [ ] Client deployed on Vercel
- [ ] All environment variables set on both projects
- [ ] Server returns "Server is Live!"
- [ ] Client loads without errors
- [ ] Database connection working
- [ ] Clerk webhook updated to new URL
- [ ] Can create users (check `/api/test/all-users`)

---

## 🔧 Troubleshooting

### Build Fails

**Check Vercel Logs:**
1. Go to your Vercel project
2. Click **"Deployments"**
3. Click on failed deployment
4. Check **"Build Logs"**
5. Look for error messages

**Common Issues:**
- Missing environment variables → Add them in Settings
- Wrong Node.js version → Vercel auto-detects, usually not an issue
- Dependencies missing → Check `package.json` files

### Client Can't Connect to Server

**Check:**
1. Is `VITE_BASE_URL` set correctly in client environment?
2. Is server environment variable `FRONTEND_URL` matching client URL?
3. Are CORS settings correct in `server.js`?

**Fix:**
```bash
# Update client VITE_BASE_URL
# Then redeploy by pushing to GitHub
git add client/.env
git commit -m "Update API URL"
git push origin main
```

### Users Not Being Created

**Check:**
1. Is Clerk webhook endpoint correct?
2. Is Inngest running? (check logs)
3. Do webhook events appear in `/api/debug/clerk-webhooks`?
4. Check Clerk dashboard → Webhooks → Logs

---

## 📊 Deployment URLs

Once deployed, you'll have:

- **Client:** `https://quickshow-client.vercel.app`
- **Server:** `https://quickshow-server.vercel.app`
- **API Calls:** Will go to `/api/*` on client domain

---

## 🚀 Auto-Deployments

After initial setup, pushing to GitHub automatically redeploys:

```bash
# Make changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically redeploys both projects
# Check status: https://vercel.com/dashboard
```

---

## 💡 Summary

| Aspect | Details |
|--------|---------|
| **Frontend** | Vercel (Static Site) |
| **Backend** | Vercel (Serverless) |
| **Database** | Aiven MySQL (External) |
| **Auth** | Clerk |
| **Payments** | Stripe |
| **Events** | Inngest |
| **Setup Time** | ~15-20 minutes |
| **Cost** | Free (both projects on free tier) |

---

## 🎉 You're Done!

Your QuickShow app is now live on Vercel! 🚀

- Visit: `https://quickshow-client.vercel.app`
- API: `https://quickshow-server.vercel.app`
- All features working: Clerk auth, Stripe payments, TMDB movies, Inngest events