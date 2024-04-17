import { InvalidTokenError } from "../exceptions/invalid-token-error";
import { ValidationError } from "../exceptions/validation-error";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401);
    throw new ValidationError("Token in authorization header is missing.");
  }

  try {
    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if(typeof payload === 'string'){
      res.status(401);
      throw new ValidationError('JWT malformed.');
    }
    // @ts-ignore
    req.payload = payload;
  } catch (err) {
    throw new InvalidTokenError("🚫 Un-Authorized 🚫");
  }

  return next();
}
