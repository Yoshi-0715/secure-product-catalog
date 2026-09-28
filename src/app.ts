import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import productRouter from "./routes/product.routes";

const app = express();

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 50,
});

// Security
app.use(helmet());

// Request body limit
app.use(express.json({ limit: "10kb" }));

// Apply rate limiting
app.use(limiter);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Secure Product Catalog API is running",
  });
});

// Product routes
app.use("/api/v1/products", productRouter);

// Centralized Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    // Request body too large
    if (err.type === "entity.too.large") {
      return res.status(413).json({
        success: false,
        message: "Request body is too large",
      });
    }

    // Invalid JSON
    if (
      err instanceof SyntaxError &&
      "body" in err
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format",
      });
    }

    // Other errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

export default app;