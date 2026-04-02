require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games");
const transactionsRoutes = require("./routes/transactions");
const publicRoutes = require("./routes/public");
const creatorRoutes = require("./routes/creator");

const {
  globalLimiter,
  authLimiter,
  transactionLimiter,
} = require("./middleware/rateLimit");

const app = express();

/* IMPORTANT */
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

app.set('trust proxy', 1)

/* ---------- API ---------- */

app.get("/api/health", (req, res) => {
  res.json({ message: "Epi Bet API is running" });
});

app.use("/auth", authLimiter, authRoutes);
app.use("/games", gamesRoutes);
app.use("/games", transactionLimiter, transactionsRoutes);
app.use("/public", publicRoutes);
app.use("/creator", creatorRoutes);

/* ---------- FRONT ---------- */

const frontendPath = path.join(__dirname, "..", "public");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ---------- ERROR ---------- */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
  });
});

/* ---------- START ---------- */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});