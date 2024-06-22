import express from "express";
import { createUser } from "./userController";

const userRouter = express.Router();

// Routes
userRouter.post("/register", createUser);

export default userRouter;
