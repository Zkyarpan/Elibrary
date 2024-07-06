import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import userModel from "./userModel";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required.");
    return next(error);
  }

  try {
    // Check if user already exists
    const user = await userModel.findOne({ email });
    if (user) {
      const error = createHttpError(
        400,
        "User already exists with this email!"
      );
      return next(error);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    // Response
    res.status(201).json({ accessToken: token });
  } catch (error) {
    next(createHttpError(500, "Server Error while creating new user."));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(400, "All feilds are required."));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User not found."));
    }

    const matchPass = await bcrypt.compare(password, user.password);
    if (!matchPass) {
      return next(createHttpError(401, "Invalid email or password."));
    }

    // Generate JWT token for sign in user
    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
    });

    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Internal Server error while login."));
  }
};

export { createUser, loginUser };
