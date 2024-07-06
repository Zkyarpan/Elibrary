import express from "express";
import createHttpError from "http-errors";
import cors from "cors";

import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
import bookRouter from "./Book/bookRouter";
import { config } from "./config/config";

const app = express();
app.use(
  cors({
    origin: config.frontEndDomain,
  })
);
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  const error = createHttpError(400, "Something went wrong!!");
  throw error;
  res.json({ message: "Welcome to our first end point !" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
