import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify, JwtPayload } from "jsonwebtoken";

import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId?: string;
}

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return next(createHttpError(401, "Authorization token is required."));
    }
    try {
      // Split the token from the "Bearer" part
      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return next(createHttpError(401, "Malformed authorization header."));
      }
      const token = tokenParts[1];
      const decoded = verify(token, config.jwtSecret as string) as JwtPayload;
      const _req = req as AuthRequest;
      _req.userId = decoded.sub as string;
      console.log("Decoded:", decoded);
      next();
    } catch (error) {
      return next(createHttpError(401, "Token Expired"));
    }
  } catch (error) {
    console.error("JWT verification error:");
    next(createHttpError(401, "Invalid token."));
  }
};

export default authenticate;
