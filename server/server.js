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
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

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