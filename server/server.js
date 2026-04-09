import express from "express";
import cors from "cors";
import "dotenv/config";
// FIX: Ensure the folder name (config vs configs) matches your Windows folder exactly
import { connectDB } from "./config/db.js"; 
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

// Routes
import showRouter from "./routes/showRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Controllers
import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

// Models
import User from "./models/User.js";

// FIX: If you use nodeMailer, import it with the .js extension
// import nodeMailer from "./configs/nodeMailer.js"; 

const app = express();

// FIX: Use process.env.PORT for Railway, default to 3000 for local
const port = process.env.PORT || 3000;

// Validate required environment variables for Aiven MySQL
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('📋 Please ensure your .env file contains:');
  console.error('  - DB_HOST=quickshowdb-767-suryadashpratap-07e5.i.aivencloud.com');
  console.error('  - DB_USER=avnadmin');
  console.error('  - DB_PASS=your_password');
  console.error('  - DB_NAME=quickshow_db');
  console.error('  - DB_PORT=23918');
  process.exit(1);
}

console.log('✓ Environment configuration loaded');
console.log(`📡 Connecting to MySQL at: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// Connect to Database
await connectDB();

// Stripe Webhooks (Must be BEFORE express.json())
app.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhooks
);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration for Vercel (both server and client on same domain)
const corsOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'localhost:5173',
  process.env.FRONTEND_URL || process.env.VERCEL_URL || 'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(clerkMiddleware());

// 🔔 CLERK WEBHOOK DEBUGGING ENDPOINT
// This captures all Clerk webhook events before Inngest processes them
app.post("/api/debug/clerk-webhook", (req, res) => {
  const event = req.body;
  console.log("\n🔔 [Clerk Webhook] Received event");
  console.log("📋 Event type:", event.type);
  console.log("📦 Full payload:", JSON.stringify(event, null, 2));
  console.log("✅ Webhook received and logged\n");
  res.json({ success: true, message: "Webhook logged" });
});

// Get Clerk webhook events log
let clerkWebhookLog = [];
app.post("/api/debug/log-clerk-webhook", (req, res) => {
  const event = req.body;
  clerkWebhookLog.push({
    timestamp: new Date().toISOString(),
    type: event.type,
    userId: event.data?.id,
    email: event.data?.email_addresses?.[0]?.email_address,
    firstName: event.data?.first_name,
    fullPayload: event
  });
  // Keep only last 50 events
  clerkWebhookLog = clerkWebhookLog.slice(-50);
  console.log(`📊 [Webhook Log] Event stored. Total: ${clerkWebhookLog.length}`);
  res.json({ success: true, logged: true });
});

// View all Clerk webhook events
app.get("/api/debug/clerk-webhooks", (req, res) => {
  console.log(`📊 [Webhook Log] Returning ${clerkWebhookLog.length} events`);
  res.json({
    total: clerkWebhookLog.length,
    events: clerkWebhookLog,
    message: "These are all Clerk webhook events received since server started"
  });
});

// 🧪 DIAGNOSTIC ENDPOINTS
// Test if database is working - manually create a test user
app.post("/api/test/create-user", async (req, res) => {
  try {
    console.log("🔬 [Test] Attempting manual user creation...");
    const testUser = await User.create({
      id: `test-user-${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      name: "Test User",
      image: "https://via.placeholder.com/150"
    });
    console.log("✅ [Test] User created successfully");
    res.json({ success: true, user: testUser.toJSON() });
  } catch (error) {
    console.error("❌ [Test] Failed to create user:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Check all users in database
app.get("/api/test/all-users", async (req, res) => {
  try {
    console.log("🔬 [Test] Fetching all users from database...");
    const users = await User.findAll();
    console.log(`✅ [Test] Found ${users.length} user(s)`);
    res.json({ 
      count: users.length, 
      users: users.map(u => u.toJSON())
    });
  } catch (error) {
    console.error("❌ [Test] Failed to fetch users:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Webhook event log (to see if webhooks are being received)
let webhookLog = [];
app.post("/api/test/webhook-log", (req, res) => {
  const event = req.body;
  console.log("🔔 [Webhook] Received event:", event.type || event.event);
  webhookLog.push({
    timestamp: new Date(),
    type: event.type || event.event,
    data: event.data || event
  });
  // Keep only last 20 events
  webhookLog = webhookLog.slice(-20);
  res.json({ logged: true });
});

// Get webhook log to see what events were received
app.get("/api/test/webhook-log", (req, res) => {
  res.json({ 
    totalReceived: webhookLog.length, 
    events: webhookLog 
  });
});

// API Routes
app.get("/", (req, res) => res.send("Server is Live!"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);