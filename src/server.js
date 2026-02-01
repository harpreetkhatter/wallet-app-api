import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import job from "./config/cron.js"
dotenv.config();

const app = express();



app.use(express.json());
app.use(rateLimiter);
if(process.env.NODE_ENV==="production") job.start()

const port = process.env.PORT;
app.get("/api/health",(req,res)=>{
  res.status(200).json({status:"ok"})
})

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