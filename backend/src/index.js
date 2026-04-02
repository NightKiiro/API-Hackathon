require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games");
const transactionsRoutes = require("./routes/transactions");
const publicRoutes = require("./routes/public");
const creatorRoutes = require("./routes/creator");

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});