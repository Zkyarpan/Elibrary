import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";

const app = express();
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  const error = createHttpError(400, "Something went wrong!!");
  throw error;
  res.json({ message: "Welcome to our first end point !" });
});

app.use("/api/users", userRouter);
// Global Error Handler
app.use(globalErrorHandler);

export default app;
