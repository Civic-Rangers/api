import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../interfaces/auth.interface";
import { NextFunction, Response } from "express";
import User, { IUser } from "../models/user.model";
import "dotenv/config";

interface IJwtData {
  _id: string;
}

export const createJwt = (data: IJwtData): string => {
  return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token)
    return res.status(401).json({ message: "Authorization token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };

    const user: IUser | null = await User.findById(decoded._id);

    if (!user)
      return res.status(401).json({
        message: "User belonging to this token is no longer registered",
      });
    req.user = user;
    next();
  } catch (error) {
    console.error("error", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
