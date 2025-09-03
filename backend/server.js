// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import dotenv from "dotenv";

import User from "./model/user.js";
import authRouter from "./routes/authRouter.js";
import classifyRouter from "./routes/classifyRouter.js";
import { trainTextClassifier } from "./services/textClassifier.js";
import { loadImageModel } from "./services/imageClassifier.js";

dotenv.config();

const app = express();

// MongoDB session store
const MongoDBStore = connectMongoDBSession(session);
const DB_PATH = process.env.MONGO_URI || "mongodb+srv://..."; // replace with env
const store = new MongoDBStore({ uri: DB_PATH, collection: "sessions" });

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

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

// Routes
app.use(authRouter);
app.use("/api/classify", classifyRouter);

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
