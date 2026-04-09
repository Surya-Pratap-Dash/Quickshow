# 🚀 QuickShow Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Repository for deployments
2. **Render Account** - For server deployment
3. **Vercel Account** - For client deployment
4. **Aiven MySQL Database** - Already configured
5. **Clerk Account** - Authentication
6. **Stripe Account** - Payments
7. **TMDB API Key** - Movie data

---

## 🖥️ Step 1: Prepare Your Repository

### 1.1 Push Code to GitHub
```bash
# In your project root
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Repository Structure
Ensure your GitHub repo has:
```
QuickShow-main/
├── server/          # Backend (Render)
├── client/          # Frontend (Vercel)
└── README.md
```

---

## 🏭 Step 2: Deploy Server to Render

### 2.1 Create Render Service
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `quickshow-server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Environment Variables
Add these in Render dashboard (Settings → Environment):

```bash
# Database (Aiven MySQL)
DB_HOST=quickshowdb-767-suryadashpratap-07e5.i.aivencloud.com
DB_USER=avnadmin
DB_PASS= # Your actual password
DB_NAME=quickshow_db
DB_PORT=23918

# Server Config
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app  # Will update later

# Clerk
CLERK_SECRET_KEY=sk_test_...  # From Clerk dashboard
CLERK_PUBLISHABLE_KEY=pk_test_...  # From Clerk dashboard

# Email
EMAIL_ID=suryapratapdash77@gmail.com
EMAIL_PASSWORD=blapkzqljwhnqlau  # Your app password

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

### 2.3 Deploy
- Click **"Create Web Service"**
- Wait for deployment (5-10 minutes)
- Note your Render URL: `https://quickshow-server.onrender.com`

---

## 🌐 Step 3: Deploy Client to Vercel

### 3.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Environment Variables
Add these in Vercel dashboard:

```bash
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_dG91Z2gtc2t1bmstNTUuY2xlcmsuYWNjb3VudHMuZGV2JA

# API URL (Your Render server)
VITE_BASE_URL=https://quickshow-server.onrender.com

# TMDB
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51TIUPNDTC9R9dauOJ2UnovOarhzURjJaQ2XxqYyeILFQBUUIDmY1NkL0zoxvEpTT6EdZ0q77HnNQc2wf3JFW6g44007oHexW5G

# Currency
VITE_CURRENCY=$
```

### 3.3 Deploy
- Click **"Deploy"**
- Wait for deployment (2-3 minutes)
- Note your Vercel URL: `https://quickshow-client.vercel.app`

---

## 🔄 Step 4: Update CORS and Webhooks

### 4.1 Update Server CORS
In Render dashboard, update `FRONTEND_URL`:
```
FRONTEND_URL=https://quickshow-client.vercel.app
```

### 4.2 Configure Clerk Webhooks
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your app
3. Go to **Webhooks**
4. Add endpoint: `https://quickshow-server.onrender.com/api/inngest`
5. Enable events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

### 4.3 Update Client API URL
In Vercel dashboard, update `VITE_BASE_URL`:
```
VITE_BASE_URL=https://quickshow-server.onrender.com
```

---

## ✅ Step 5: Test Deployment

### 5.1 Test Server Health
```bash
curl https://quickshow-server.onrender.com/
# Should return: "Server is Live!"
```

### 5.2 Test Client
- Visit: `https://quickshow-client.vercel.app`
- Try signing up/logging in
- Check if movies load

### 5.3 Test Database Connection
```bash
curl https://quickshow-server.onrender.com/api/test/all-users
# Should return user list
```

---

## 🔧 Troubleshooting

### Common Issues:

**1. CORS Errors**
- Check `FRONTEND_URL` in Render matches Vercel URL exactly
- Include `https://` protocol

**2. Database Connection**
- Verify Aiven credentials in Render environment
- Check Aiven firewall allows Render IPs

**3. Clerk Webhooks**
- Ensure webhook URL is correct
- Check Clerk dashboard for failed deliveries

**4. Environment Variables**
- All secrets must be set in respective dashboards
- No `.env` files in production

**5. Build Failures**
- Check build logs in Render/Vercel dashboards
- Ensure all dependencies are in `package.json`

---

## 📝 Post-Deployment Checklist

- [ ] Server deployed on Render
- [ ] Client deployed on Vercel
- [ ] CORS configured correctly
- [ ] Clerk webhooks configured
- [ ] Database connection working
- [ ] User signup/login working
- [ ] Movies loading from TMDB
- [ ] Payments working with Stripe
- [ ] Email notifications working

---

## 🎉 You're Done!

Your app is now live at:
- **Frontend**: `https://quickshow-client.vercel.app`
- **Backend**: `https://quickshow-server.onrender.com`