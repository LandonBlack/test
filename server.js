const express = require("express");
<<<<<<< HEAD
const mongoose = require("mongoose");
const NoteRoutes = require("./routes/NoteRoutes");
const taskRoutes = require("./routes/taskRoutes");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;

// ================= middleware (KEEP THIS ORDER) =================
app.use(express.json());

const logger = require("./middleware/logger");
app.use(logger);

const morgan = require("morgan");
app.use(morgan("dev"));

// ================= routes =================
app.use("/api/tasks", taskRoutes);
app.use("/notes", NoteRoutes);

// ================= MongoDB =================
const MONGO_URI = "mongodb+srv://trumpnowallplz_db_user:Bioshock3698@cluster0.tleq7gd.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ================= Notes schema (fine here) =================
const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true }
});

const Note = mongoose.model("Note", NoteSchema);

// ================= base route =================
app.get("/", (req, res) => {
  res.send("Week 3 Lab: MongoDB connection test");
});

// ================= auth routes =================
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
    res.status(500).json({ message: "Server error", details: err.message });
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

    const token = jwt.sign(
      { id: user._id },
      "your_jwt_secret_here"
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= 404 handler LAST =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// ================= start server LAST =================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
=======
const path = require("path");
const app = express();

// IMPORTANT: Use the port Render/host provides OR a default for local dev
const PORT = process.env.PORT || 3000;

// views + static
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// routes
app.get("/", (req, res) => {
  res.render("home", { pageTitle: "Deployed App", env: process.env.NODE_ENV || "development" });
});

// catch-all 404 (simple)
app.use((req, res) => {
  res.status(404).render("404", { pageTitle: "Not Found", url: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
>>>>>>> 49e6e07afbe2fae94c513f45008741e05d1eb818
