const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const NoteRoutes = require("./routes/NoteRoutes");
const taskRoutes = require("./routes/taskRoutes");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const logger = require("./middleware/logger");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(logger);
app.use(morgan("dev"));

// view setup (KEEP if using EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// routes
app.use("/api/tasks", taskRoutes);
app.use("/notes", NoteRoutes);

// MongoDB
const MONGO_URI = "mongodb+srv://trumpnowallplz_db_user:Bioshock3698@cluster0.tleq7gd.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

// homepage (KEEP ONLY ONE)
app.get("/", (req, res) => {
  res.render("home", {
    pageTitle: "Deployed App",
    env: process.env.NODE_ENV || "development"
  });
});

// auth routes (unchanged)
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, passwordHash: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, "your_jwt_secret_here");

    res.json({ token, userId: user._id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 404 LAST
app.use((req, res) => {
  res.status(404).render("404", {
    pageTitle: "Not Found",
    url: req.originalUrl
  });
});

// start server ONCE
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});