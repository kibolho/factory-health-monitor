import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { hashToken } from "../../utils/hash-token";
import { generateTokens } from "../../utils/jwt";
import {
  createUserByEmailAndPassword,
  findUserByEmail,
  findUserById,
} from "../user/user.services";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
  revokeTokens,
} from "./auth.services";

import express from "express";
import { v4 as uuidv4 } from "uuid";
import { DocVersionContainer } from "../../docs/doc-version-container";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { MiddlewareVersion } from "../../middlewares/version-middleware";
import { openAPIRoute } from "../../utils/express-zod-openapi-autogen/openAPIRoute";
import { loginSchema, refreshSchema, registerSchema } from "./schemas";

@DocVersionContainer.register(["mobile"])
export class MakeRouters {
  static version: string | undefined;
  static filePath = __filename;

  register(router: express.Router): void {
    router.post(
      "/auth/register",
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Auth",
          summary: "Register an user",
          body: {
            description: "User model",
            schema: registerSchema,
            type: "application/json",
          },
        },
        async (req, res, next) => {
          try {
            const { email, password } = req.body;
            if (!email || !password) {
              res.status(400);
              throw new Error("You must provide an email and a password.");
            }

            const existingUser = await findUserByEmail(email);

            if (existingUser) {
              res.status(400);
              throw new Error("Email already in use.");
            }

            const user = await createUserByEmailAndPassword({
              email,
              password,
            });
            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(user, jti);
            await addRefreshTokenToWhitelist({
              jti,
              refreshToken,
              userId: user.id,
            });

            res.json({
              accessToken,
              refreshToken,
            });
          } catch (err) {
            next(err);
          }
        }
      )
    );

    router.post(
      "/auth/login",
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Auth",
          summary: "Login user",
          body: {
            description: "Login model",
            schema: loginSchema,
            type: "application/json",
          },
        },
        async (req, res, next) => {
          try {
            const { email, password } = req.body;
            if (!email || !password) {
              res.status(400);
              throw new Error("You must provide an email and a password.");
            }

            const existingUser = await findUserByEmail(email);

            if (!existingUser) {
              res.status(403);
              throw new Error("Invalid login credentials.");
            }

            const validPassword = await bcrypt.compare(
              password,
              existingUser.password
            );
            if (!validPassword) {
              res.status(403);
              throw new Error("Invalid login credentials.");
            }

            const jti = uuidv4();
            const { accessToken, refreshToken } = generateTokens(
              existingUser,
              jti
            );
            await addRefreshTokenToWhitelist({
              jti,
              refreshToken,
              userId: existingUser.id,
            });

            res.json({
              accessToken,
              refreshToken,
            });
          } catch (err) {
            next(err);
          }
        }
      )
    );

    router.post(
      "/auth/refresh",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Auth",
          summary: "Refresh Token from user",
          body: {
            description: "Refresh Token model",
            schema: refreshSchema,
            type: "application/json",
          },
        },
        async (req, res, next) => {
          try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
              res.status(400);
              throw new Error("Missing refresh token.");
            }
            const payload = jwt.verify(
              refreshToken,
              process.env.JWT_REFRESH_SECRET as string
            );
            if (typeof payload === "string" || !payload.jti) {
              res.status(401);
              throw new Error("JWT malformed.");
            }
            const savedRefreshToken = await findRefreshTokenById(payload.jti);

            if (!savedRefreshToken || savedRefreshToken.revoked === true) {
              res.status(401);
              throw new Error("Unauthorized");
            }

            const hashedToken = hashToken(refreshToken);
            if (hashedToken !== savedRefreshToken.hashedToken) {
              res.status(401);
              throw new Error("Unauthorized");
            }

            const user = await findUserById(payload.userId);
            if (!user) {
              res.status(401);
              throw new Error("Unauthorized");
            }

            await deleteRefreshToken(savedRefreshToken.id);
            const jti = uuidv4();
            const { accessToken, refreshToken: newRefreshToken } =
              generateTokens(user, jti);
            await addRefreshTokenToWhitelist({
              jti,
              refreshToken: newRefreshToken,
              userId: user.id,
            });

            res.json({
              accessToken,
              refreshToken: newRefreshToken,
            });
          } catch (err) {
            next(err);
          }
        }
      )
    );

    // This endpoint is only for demo purpose.
    // Move this logic where you need to revoke the tokens( for ex, on password reset)
    router.post(
      "/auth/logout",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Auth",
          summary: "Logout user",
        },
        async (req, res, next) => {
          try {
            // @ts-ignore
            const { userId } = req.payload;
            await revokeTokens(userId);
            res.json({ message: `Tokens revoked for user with id #${userId}` });
          } catch (err) {
            next(err);
          }
        }
      )
    );
  }
}
