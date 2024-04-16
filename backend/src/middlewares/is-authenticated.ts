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
    throw new Error("Token in authorization header is missing.");
  }

  try {
    const token = authorization.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);

    if(typeof payload === 'string'){
      res.status(401);
      throw new Error('JWT malformed.');
    }
    // @ts-ignore
    req.payload = payload;
  } catch (err) {
    console.error(err)
    res.status(401);
    const error = err as { name: string };
    if (error.name === "TokenExpiredError") {
      throw new Error(error.name);
    }
    throw new Error("🚫 Un-Authorized 🚫");
  }

  return next();
}
