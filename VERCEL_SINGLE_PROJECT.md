# ⚡ Single Vercel Deployment (Both on One Project)

## Alternative: Deploy Both Client & Server as One Vercel Project

Instead of two separate projects, you can deploy both as a **single mono-repo project** on Vercel.

**Benefits:**
- ✅ Same domain (no separate URLs needed)
- ✅ Simpler setup
- ✅ Better CORS handling
- ✅ Smaller number of projects

---

## 📋 Setup for Single Project

### Option 1: Using Vercel Mono-Repo (Recommended)

#### 1. Create Root Vercel Config

Your root `vercel.json` is already configured to handle both:
- Client builds to `/dist`
- Server runs on `/api`
- Static files served from `/dist`
- Everything on same domain

#### 2. One-Step Deployment

```bash
# Push to GitHub
git add .
git commit -m "Single Vercel deployment"
git push origin main
```

#### 3. Deploy on Vercel

1. Go to **[vercel.com](https://vercel.com/dashboard)**
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo
4. **Don't select root directory** (leave empty)
5. Click **"Deploy"**

#### 4. Add Environment Variables

Once deployed, go to **Settings** → **Environment Variables** and add ALL variables (from both client and server):

```bash
# Database
DB_HOST=...
DB_USER=...
DB_PASS=...
DB_NAME=...
DB_PORT=...

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-vercel-domain.vercel.app

# Clerk
CLERK_SECRET_KEY=...
CLERK_PUBLISHABLE_KEY=...

# Email, Stripe, TMDB, Inngest (all same as before)
EMAIL_ID=...
EMAIL_PASSWORD=...
STRIPE_SECRET_KEY=...
STRIPE_PUBLISHABLE_KEY=...
TMDB_API_KEY=...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...
JWT_SECRET=...

# Client-specific (with VITE_ prefix)
VITE_CLERK_PUBLISHABLE_KEY=...
VITE_TMDB_IMAGE_BASE_URL=...
VITE_STRIPE_PUBLISHABLE_KEY=...
VITE_CURRENCY=...
```

#### 5. Test

```bash
# Visit your Vercel domain (e.g., https://quickshow.vercel.app)
# Should load the client
# API calls automatically route to /api
```

---

## 🔧 Configuration Files Explained

### `vercel.json` (Root)

Handles routing:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/server.js"     // Route /api/* to server
    },
    {
      "src": "/(.*)",
      "dest": "client/dist/$1"        // Serve static files
    },
    {
      "src": "/(.*)",
      "dest": "client/index.html",    // SPA fallback
      "status": 200
    }
  ]
}
```

### `package.json` (Root)

Orchestrates builds:
```json
{
  "scripts": {
    "build": "npm --prefix client run build",  // Build only client
    "vercel-build": "npm --prefix client run build"
  }
}
```

---

## 📱 API Calls in Client

**Before (Separate Domains):**
```javascript
const baseURL = 'https://quickshow-server.vercel.app';
axios.get(`${baseURL}/api/shows`);
```

**After (Same Domain):**
```javascript
// Just use relative paths
axios.get('/api/shows');
```

This is already handled in your client code since `VITE_BASE_URL` is set to `/`.

---

## ✅ Comparison

| Aspect | Two Projects | One Project |
|--------|-------------|------------|
| **Client URL** | `https://client.vercel.app` | `https://app.vercel.app` |
| **Server URL** | `https://server.vercel.app` | `https://app.vercel.app/api` |
| **CORS Issues** | Possible | None |
| **Setup Complexity** | Medium | Simple |
| **Maintenance** | More projects | Single project |
| **Projects Count** | 2 | 1 |

---

## 🎯 Which Should You Use?

- **One Project:** Start here if new to Vercel (simpler)
- **Two Projects:** Better for separate scaling/monitoring

Currently, your setup is configured for **One Project** (recommended).

---

## 📝 Your Current Setup

✅ Already configured for single Vercel deployment:
- Root `vercel.json` handles routing
- Environment variables in one place
- Both client and server from same repo

Just deploy the entire project to Vercel once and you're done!