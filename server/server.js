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

// FIX: If you use nodeMailer, import it with the .js extension
// import nodeMailer from "./configs/nodeMailer.js"; 

const app = express();

// FIX: Use process.env.PORT for Railway, default to 3000 for local
const port = process.env.PORT || 3000;

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