const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const downloadRoute = require("./routes/download");

dotenv.config();
const app = express();

// CORS fix for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Vercel URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"), false);
    },
  })
);

app.use(express.json());
app.use("/api", downloadRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
