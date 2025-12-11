const express = require("express");
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
