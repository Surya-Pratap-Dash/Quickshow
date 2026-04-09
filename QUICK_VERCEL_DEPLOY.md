# 🚀 Quick Start: Deploy to Vercel in 10 Minutes

## ⚡ The Fastest Way

### Step 1: Push to GitHub (2 min)
```bash
cd QuickShow-main
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### Step 2: Create Vercel Project (3 min)
1. Go to **vercel.com**
2. Click **"Add New"** → **"Project"**
3. Select your GitHub repo
4. **Don't select a folder** (leave root)
5. Click **"Deploy"**

### Step 3: Add Environment Variables (5 min)

After deployment, go to **Settings** → **Environment Variables** and paste:

```
DB_HOST=quickshowdb-767-suryadashpratap-07e5.i.aivencloud.com
DB_USER=avnadmin
DB_PASS=YOUR_DB_PASSWORD
DB_NAME=quickshow_db
DB_PORT=23918
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-vercel-app.vercel.app
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
EMAIL_ID=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
TMDB_API_KEY=546a7d0aa815105bb8f0a988061183c1
INNGEST_EVENT_KEY=l0qvsNbE3SRKv6QEnEB7JiFo417GZVrOtqXDDODcZutBqiMkRJvH7dIttgxS_91PAnJLPIuu1Vg6dw2AuhX8tA
INNGEST_SIGNING_KEY=signkey-prod-b3262b2e7d19f0989734eb669c038d7ac2df8828697a25f8d39c71e0388463e8
JWT_SECRET=Surya_Pratap_B124139
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dG91Z2gtc2t1bmstNTUuY2xlcmsuYWNjb3VudHMuZGV2JA
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TIUPNDTC9R9dauOJ2UnovOarhzURjJaQ2XxqYyeILFQBUUIDmY1NkL0zoxvEpTT6EdZ0q77HnNQc2wf3JFW6g44007oHexW5G
VITE_CURRENCY=$
```

Click **"Save"**

### Step 4: Update Clerk Webhook (2 min)

1. Go to **https://dashboard.clerk.com**
2. **Webhooks** → Edit endpoint
3. Change URL to: `https://your-vercel-app.vercel.app/api/inngest`
4. Save

### Step 5: Trigger Redeploy (1 min)

```bash
# Make a small change to trigger redeploy
echo "# Deployed $(date)" >> README.md
git add README.md
git commit -m "Trigger Vercel redeploy"
git push origin main
```

---

## ✅ Done!

Your app is now live at: **https://your-vercel-app.vercel.app**

---

## 🔗 What You Get

| Path | What It Returns |
|------|-----------------|
| `/` | Your React app (client) |
| `/api/show` | Movie shows API |
| `/api/booking` | Booking API |
| `/api/admin` | Admin API |
| `/api/user` | User API |

---

## 📊 What's Deployed

- ✅ React client (Vite)
- ✅ Express server (API)
- ✅ All routes
- ✅ Clerk auth
- ✅ Stripe payments
- ✅ TMDB movies
- ✅ Inngest events
- ✅ Email notifications

---

## 🧪 Quick Tests

```bash
# Test if app is running
curl https://your-vercel-app.vercel.app/

# Test if API is working
curl https://your-vercel-app.vercel.app/api/test/all-users

# Test if webhooks are received
curl https://your-vercel-app.vercel.app/api/debug/clerk-webhooks
```

---

## 🆘 Troubleshooting

### Build Failed
- Check Vercel dashboard → Deployments → Logs
- Look for error messages
- Make sure all environment variables are set

### Website won't load
- Wait 2-3 minutes for build to complete
- Refresh browser
- Check browser console for errors

### API returns 404
- Make sure you're calling `/api/...` not `/...`
- Check if server is actually deployed

### Users not showing in database
- Check if Clerk webhook URL is correct
- Make sure `FRONTEND_URL` env var matches your domain
- Check `/api/debug/clerk-webhooks` for events

---

## 🎯 All Configuration Files Already Updated

✅ `vercel.json` - Root routing config  
✅ `server/vercel.json` - Server config  
✅ `client/vercel.json` - Client config  
✅ `package.json` - Build scripts  
✅ `server/server.js` - CORS setup  
✅ `client/.env` - API URL  
✅ `.vercelignore` - Ignore patterns  

**Everything is ready to deploy!**