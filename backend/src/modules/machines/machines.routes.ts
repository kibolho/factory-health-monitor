import express, { Request, Response } from "express";
import { getMachineHealth } from "./machines.services";
import { DocVersionContainer } from "../../docs/doc-version-container";
import { MiddlewareVersion } from "../../middlewares/version-middleware";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { openAPIRoute } from "../../utils/express-zod-openapi-autogen/openAPIRoute";

@DocVersionContainer.register(["mobile"])
export class MakeRouters {
  static version: string | undefined;
  static filePath = __filename;

  register(router: express.Router): void {
    // Endpoint to get machine health score
    router.post(
      "/machine-health/register",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Register a machine",

        },
        async (req: Request, res: Response) => {
          const result = getMachineHealth(req);
          if (result.error) {
            res.status(400).json(result);
          } else {
            res.json(result);
          }
        }
      )
    );
  }
}
