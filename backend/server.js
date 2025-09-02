const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const session = require('express-session');
const mongoDB = require('connect-mongodb-session')(session);
const User = require("./model/user");


const authRouter = require("./routes/authRouter");

const app = express();
const DB_PATH =
  "mongodb+srv://siddhant:test123@experiment.yyakj2d.mongodb.net/?retryWrites=true&w=majority";


  const store = new mongoDB({
  uri : DB_PATH,
  collection: "sessions"
})
// Middleware

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(
  session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true, // JS on frontend cannot access cookie
      secure: false,  // set true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);


app.use(async (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  try {
    // fetch fresh user from DB to keep data updated
    const user = await User.findById(req.session.user._id);
    req.user = user;   // ✅ now req.user is available
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
});

app.use((req, res, next) => {
  res.locals.user = req.user || null; // now `user` is available in every EJS file
  next();
});


app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session?.user ? true : false;
  next();
});


// Routes
app.use(authRouter);

// MongoDB connection

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));
