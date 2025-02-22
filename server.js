require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const limiter = require("./src/middlewares/rateLimiter");

const app = express();

// Middleware
// app.use(cors({ origin: "https://your-frontend.com", credentials: true }));
app.use(limiter);
app.use(express.json());
//by default cors for every origin
app.use(cors());
// app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
//     message: "Too many requests, please try again later.",
//   })
// );

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
