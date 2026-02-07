import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { UserRole } from "./entity/User";

// Klucz pewnie trzeba będzie przenieść do zmiennych środowiskowych
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY as string;

export const generateJwt = (
  payload: object,
  expiresIn: string | number = "1h",
  type?: string
) => {
  if (type === "refresh") {
    return jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn } as any);
  } else {
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn } as any);
  }
};

export const verifyAccess = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No token provided" });
  }
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer") {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token format" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid token" });
  }
};

export const verifyRefresh = (token: string) => {
  return jwt.verify(token, JWT_REFRESH_KEY) as { sub: string };
};

// Przy podaniu parametru Customer to Customer ma dostep do endpointu
// Admin przy uzyciu tego middleware zawsze ma dostep
export const requireRole =
  (role: UserRole) => (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || user.role !== role) {
      if (user.role !== UserRole.Admin) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "Insufficient permissions" });
      }
    }
    next();
  };
