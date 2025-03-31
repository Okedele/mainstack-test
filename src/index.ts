// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./config/db.config";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { AuthRoutes } from "./routes/auth.routes";
import { AccountRoutes } from "./routes/account.routes";
import { TransactionRoutes } from "./routes/transaction.routes";

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(ExpressMongoSanitize()); // Prevent NoSQL injection

//Connect to MongoDB database
connectDB();

AuthRoutes(app);
AccountRoutes(app);
TransactionRoutes(app);

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Banking Transactions API" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
