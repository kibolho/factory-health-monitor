import express from "express";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { findUserById } from "./user.services";
import { DocVersionContainer } from "../../docs/doc-version-container";
import { MiddlewareVersion } from "../../middlewares/version-middleware";
import { openAPIRoute } from "../../utils/express-zod-openapi-autogen/openAPIRoute";

@DocVersionContainer.register(["mobile"])
export class MakeRouters {
  static version: string | undefined;
  static filePath = __filename;

  register(router: express.Router): void {
    router.get(
      "/users/profile",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "User",
          summary: "Registrar um usuário",
        },
        async (req, res, next) => {
          try {
            // @ts-ignore
            const { userId } = req.payload;
            const user = await findUserById(userId);
            res.json({
              id: user?.id,
              email: user?.email,
              createdAt: user?.createdAt,
              updatedAt: user?.updatedAt,
            });
          } catch (err) {
            next(err);
          }
        }
      )
    );
  }
}
