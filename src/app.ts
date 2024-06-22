import express, { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// Routes
app.get("/", (req, res, next) => {
  const error = createHttpError(400, "Something went wrong!!");
  throw error;
  res.json({ message: "Welcome to our first end point !" });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
