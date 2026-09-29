import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import productsRouter from "./routes/v1/products";
import errorHandler from "./middleware/errorHandler";
import AppError from "./utils/AppError";
import morganStream from "./utils/morganStream";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = Number(process.env.PORT) || 4000;

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Security middleware
app.use(helmet());

// Parse request body
app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  }),
);

// Morgan HTTP request logging
app.use(morgan("dev", { stream: morganStream }));
//app.use(morgan("short", { stream: morganStream }));
//app.use(morgan("tiny", { stream: morganStream }));
// Apply rate limiter to all API routes
app.use("/api/v1", apiLimiter);

// Product routes
app.use("/api/v1/products", productsRouter);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Product Catalog API is running",
  });
});
// // Temporary 500 error test route
app.get("/test-error", (req, res, next) => {
  next(new Error("Test Internal Server Error"));
});

// Catch-all 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
