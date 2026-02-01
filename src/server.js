import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config();

const app = express();

// Enable CORS for Expo web
app.use(cors({
  origin: ['http://localhost:8082', 'http://localhost:8081', 'http://localhost:3000', 'http://127.0.0.1:8082'],
  credentials: true
}));

app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT;

app.use("/api/transactions", transactionsRoute);

initDB()
  .catch((err) => {
    console.error("Database init failed, continuing without DB:", err);
  })
  .finally(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });