require("dotenv").config();
const express = require("express");

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
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Epi Bet API is running",
  });
});

app.use("/auth", authRoutes);
app.use("/games", gamesRoutes);
app.use("/games", transactionsRoutes);
app.use("/public", publicRoutes);
app.use("/creator", creatorRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error",
  });
});

app.use(express.json());
app.use(globalLimiter);

app.use("/auth", authLimiter, authRoutes);
app.use("/games", transactionLimiter, transactionsRoutes);

app.use("/games", gamesRoutes);
app.use("/public", publicRoutes);
app.use("/creator", creatorRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});