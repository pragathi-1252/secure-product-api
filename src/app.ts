import mysql, { RowDataPacket } from "mysql2/promise";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import productsRouter from "./routes/v1/products";
import errorHandler from "./middleware/errorHandler";
import AppError from "./utils/AppError";
import morganStream from "./utils/morganStream";

const app = express();
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "student_ligin_db",
});

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
// Apply rate limiter to all API routes
app.use("/api/v1", apiLimiter);

// Login route
app.post("/api/v1/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const [rows] = await db.execute(
      "SELECT id, student_id, email, password, role FROM login WHERE email = ?",
      [email],
    );
    const users = rows as (RowDataPacket & {
      id: number;
      student_id: number;
      email: string;
      password: string;
      role: string;
    })[];
    if (users.length === 0 || users[0].password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = users[0];
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        student_id: user.student_id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Product routes
app.use("/api/v1/products", productsRouter);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Product Catalog API is running",
  });
});

// Temporary 500 error test route
app.get("/test-error", (req, res, next) => {
  next(new Error("Test Internal Server Error"));
});

// Catch-all 404 handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Centralized error handler
app.use(errorHandler);

export default app;
