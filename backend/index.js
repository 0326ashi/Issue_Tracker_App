const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: false }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
