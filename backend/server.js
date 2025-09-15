// server.js
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import fetch from "node-fetch";   // 👈 for quotes API & chatbot proxy

import cloudinary from "./config/cloudinary.js";
import User from "./model/user.js";
import authRouter from "./routes/authRouter.js";
import classifyRouter from "./routes/classifyRouter.js";
import { trainTextClassifier } from "./services/textClassifier.js";
import { loadImageModel } from "./services/imageClassifier.js";
import userRoutes from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRouter.js";
import chatRoute from "./routes/chatRoute.js";   // 👈 NEW CHAT ROUTE

// Path setup for .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force-load .env from backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

// Debug print
console.log("DEBUG .env path:", path.join(__dirname, ".env"));
console.log("DEBUG ENV check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ loaded" : "❌ missing",
  openai: process.env.OPENAI_API_KEY ? "✅ loaded" : "❌ missing",   // 👈 check OpenAI
});

const app = express();

// MongoDB session store
const MongoDBStore = connectMongoDBSession(session);
const DB_PATH = process.env.MONGO_URI || "mongodb+srv://..."; // replace with env
const store = new MongoDBStore({ uri: DB_PATH, collection: "sessions" });

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://fixitnow-beta.vercel.app",   // your deployed frontend
  "https://fixitnoww.netlify.app"       // if you deploy on Netlify
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Attach logged-in user if exists
app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isLoggedIn = !!req.session?.user;
  next();
});

// ✅ Quotes Proxy
app.get("/api/quotes/random", async (req, res) => {
  try {
    const response = await fetch("https://indian-quotes-api.vercel.app/api/quotes/random");
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch quotes" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Cloudinary Test
app.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "sih_prototype" }
    );
    res.json(result);
  } catch (err) {
    console.error("Cloudinary test failed:", err);
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/classify", classifyRouter);
app.use("/api", userRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/chat", chatRoute);   // 👈 AI Chatbot route mounted

// MongoDB connection + start server
mongoose
  .connect(DB_PATH)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Initialize models (optional)
    await trainTextClassifier();
    await loadImageModel();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));
