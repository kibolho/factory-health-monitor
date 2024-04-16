import express from "express";
import { DocVersionContainer } from "../../docs/doc-version-container";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { MiddlewareVersion } from "../../middlewares/version-middleware";
import { openAPIRoute } from "../../utils/express-zod-openapi-autogen/openAPIRoute";
import {
  createMachineHealthRecord,
  getAllMachineHealthRecords,
  getMachineHealthCalculation
} from "./machines.services";
import {
  machineHealthRecordSchema,
  machineHealthScoreCalculationResponseSchema,
} from "./schemas";

@DocVersionContainer.register(["mobile"])
export class MakeRouters {
  static version: string | undefined;
  static filePath = __filename;

  register(router: express.Router): void {
    router.post(
      "/machine-health/register",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Register a machine health record",
          body: {
            description: "Machine health record",
            schema: machineHealthRecordSchema,
            type: "application/json",
          },
        },
        async (req, res) => {
          const result = await createMachineHealthRecord(req.body);
          if (!result.id) {
            res.status(400).json({ message: "Invalid data" });
          } else {
            res.json(result);
          }
        }
      )
    );
    // Endpoint to get machine health score
    router.post(
      "/machine-health/calculate",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Calculate machine and factory health score",
          response: machineHealthScoreCalculationResponseSchema,
        },
        async (req, res) => {
          const record = await getAllMachineHealthRecords()
          const result = getMachineHealthCalculation(record);
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
