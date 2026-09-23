import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import productsRouter from "./routes/v1/products";
import errorHandler from "./middleware/errorHandler";
const app = express();

const PORT = 4000;
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
// Security middleware
app.use(helmet());

// Parse JSON request body
app.use(express.json({ limit: "10kb" }));

// Parse URL-encoded data
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);
app.use("/api/v1/products", apiLimiter, productsRouter);
// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Product Catalog API is running",
  });
});
app.use(errorHandler);
// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});