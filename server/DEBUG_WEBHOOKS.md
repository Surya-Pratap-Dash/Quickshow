# 🔍 Webhook Debugging Guide

## Problem: Users Not Being Created After Login

If users successfully login via Clerk but don't appear in your database, the Clerk webhook events aren't reaching Inngest.

---

## 📋 Debugging Steps

### Step 1: Check if Webhooks are Configured in Clerk

1. Go to https://dashboard.clerk.com
2. Select your app
3. Go to **Webhooks** (left sidebar)
4. You should see an endpoint like: `http://localhost:3000/api/inngest` or your production URL
5. Status should show **Active** (green checkmark)

### Step 2: Monitor Webhook Endpoint

While your server is running, open a new terminal and check if webhooks are being received:

```bash
# Check webhook events (updates every time a Clerk event is received)
curl http://localhost:3000/api/debug/clerk-webhooks

# Example response:
{
  "total": 0,
  "events": [],
  "message": "These are all Clerk webhook events received since server started"
}
```

If `total` is 0, webhooks are NOT being received.

### Step 3: Test by Creating a Test User in Clerk

1. Go to https://dashboard.clerk.com
2. Go to **Users**
3. Create a test user with email
4. Check your webhook log again:
   ```bash
   curl http://localhost:3000/api/debug/clerk-webhooks
   ```
5. You should now see events

### Step 4: Check Webhook Delivery in Clerk Dashboard

1. Go to Webhooks in Clerk
2. Click on your endpoint
3. Go to **Logs** or **History**
4. Check if webhook deliveries are successful
5. If failed, check the error message

---

## 🔧 Common Issues & Solutions

### Issue 1: Webhooks Not Being Sent

**Symptoms:**
- `curl` shows `total: 0`
- No webhook events in Clerk dashboard logs

**Solutions:**
1. **Verify endpoint is configured correctly:**
   ```
   Local: http://localhost:3000/api/inngest
   Production: https://your-render-url.onrender.com/api/inngest
   ```

2. **Ensure webhook is ACTIVE:**
   - Go to Webhooks → Click your endpoint
   - Status should be green/active
   - If disabled, click enable

3. **Check if you're using the right event types:**
   - `user.created` - When user signs up
   - `user.updated` - When user updates profile
   - `user.deleted` - When user is deleted
   - Make sure at least `user.created` is checked

### Issue 2: Webhooks Sent But Users Not Created

**Symptoms:**
- `curl http://localhost:3000/api/debug/clerk-webhooks` shows events
- But `/api/test/all-users` doesn't show the user

**Cause:** Inngest is not processing the webhooks

**Solutions:**

#### For Local Development:

You need to run **Inngest Dev Server**:

```bash
# Install inngest CLI (one time)
npm install -g inngest-cli

# In another terminal, start Inngest dev server
inngest dev

# This creates a tunnel for local webhook testing
# You'll see output like:
# ✓ Ready! Inngest is listening at: http://localhost:8288
```

Then update your Webhook in Clerk to:
```
http://localhost:8288/api/inngest
```

#### For Production:

Inngest should work automatically. Just ensure:
- Server is deployed to Render
- Env variables are set correctly
- Webhook endpoint is: `https://your-render-url.onrender.com/api/inngest`

### Issue 3: Wrong Webhook Endpoint Format

**If using ngrok or Inngest Dev, your URL might be different:**

- **ngrok:** `https://abc123.ngrok.io/api/inngest`
- **Inngest Dev:** `http://localhost:8288/api/inngest`
- **Local Server:** `http://localhost:3000/api/inngest`
- **Production:** `https://your-render-app.onrender.com/api/inngest`

---

## 🧪 Complete Testing Workflow

### For Local Development:

1. **Start Inngest Dev Server:**
   ```bash
   inngest dev
   # Outputs: http://localhost:8288
   ```

2. **Start Your Server (in another terminal):**
   ```bash
   cd server
   npm start
   ```

3. **Update Clerk Webhook URL:**
   - Go to Clerk Dashboard → Webhooks
   - Change endpoint to: `http://localhost:8288/api/inngest`
   - Save

4. **Create Test User in Clerk:**
   - Go to Clerk Dashboard → Users → Create User
   - Use a test email like: `test-april-9@example.com`

5. **Check if User Was Created:**
   ```bash
   curl http://localhost:3000/api/test/all-users
   ```

6. **Check Webhook Events Received:**
   ```bash
   curl http://localhost:3000/api/debug/clerk-webhooks
   ```

---

## 🔍 Advanced Debugging

### View Webhook Event Payload

```bash
# See the full webhook event that was received
curl http://localhost:3000/api/debug/clerk-webhooks | jq '.events[0].fullPayload'
```

### Check Server Logs

Watch for logs like:
```
🔔 [Inngest] Received clerk/user.created event
📦 Event data: {...}
💾 [Inngest] Creating user with data: {...}
✅ [Inngest] User created successfully: {...}
```

If you don't see these logs, the webhook isn't reaching your Inngest function.

### Test Webhook Manually

```bash
# Send a test webhook directly to your server
curl -X POST http://localhost:3000/api/test/webhook-log \
  -H "Content-Type: application/json" \
  -d '{
    "type": "clerk/user.created",
    "data": {
      "id": "user_test123",
      "first_name": "Test",
      "last_name": "User",
      "email_addresses": [{"email_address": "test@example.com"}],
      "image_url": "https://via.placeholder.com/150"
    }
  }'
```

---

## ✅ Verification Checklist

- [ ] Inngest dev server running (local only): `inngest dev`
- [ ] Server running: `npm start`
- [ ] Clerk webhook endpoint configured correctly
- [ ] Webhook is ACTIVE/enabled in Clerk dashboard
- [ ] Events `user.created`, `user.updated`, `user.deleted` are checked
- [ ] Created a test user in Clerk dashboard
- [ ] User appears in `/api/test/all-users`
- [ ] Webhook events show in `/api/debug/clerk-webhooks`

---

## 📊 Useful Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/test/all-users` | GET | See all users in database |
| `/api/test/create-user` | POST | Manually create test user |
| `/api/debug/clerk-webhooks` | GET | View all webhook events received |
| `/api/debug/log-clerk-webhook` | POST | Log a webhook event |
| `/api/debug/clerk-webhook` | POST | Webhook receiver (logs to server console) |

---

## 🎓 Why This Matters

- **Locally:** Without Inngest Dev, the `/api/inngest` endpoint exists but Inngest functions don't actually execute
- **Production:** Inngest cloud handles everything automatically
- **Webhooks:** Clerk sends events, but something needs to listen and process them

This guide helps you verify the entire chain works before deploying to production.