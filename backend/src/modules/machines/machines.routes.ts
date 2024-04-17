import express from "express";
import { DocVersionContainer } from "../../docs/doc-version-container";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { MiddlewareVersion } from "../../middlewares/version-middleware";
import { openAPIRoute } from "../../utils/express-zod-openapi-autogen/openAPIRoute";
import {
  createMachineHealthRecord,
  deleteAllMachineHealthRecords,
  factoryAllMachineHealthRecords,
  getAllMachineHealthRecords,
  getMachineHealthCalculation,
} from "./machines.services";
import {
  MachineHealthRecord,
  machineHealthRecordSchema,
  machineHealthScoreCalculationResponseSchema,
} from "./schemas";
import { z } from "zod";

@DocVersionContainer.register(["mobile"])
export class MakeRouters {
  static version: string | undefined;
  static filePath = __filename;

  register(router: express.Router): void {
    router.post(
      "/machine-health/record",
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
            res.status(201).json(result);
          }
        }
      )
    );

    router.get(
      "/machine-health/record",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Retrieve all machine health records",
          response: z.array(machineHealthRecordSchema),
        },
        async (_, res) => {
          const result = await getAllMachineHealthRecords();
          res.json(result as MachineHealthRecord[]);
        }
      )
    );

    router.delete(
      "/machine-health/record",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Delete all machine health records",
          response: z.object({
            message: z.string(),
          }),
        },
        async (_, res) => {
          const result = await deleteAllMachineHealthRecords();
          res.status(202).json({ message: `${result.count} records deleted` });
        }
      )
    );

    // Endpoint to get machine health score
    router.get(
      "/machine-health/calculate",
      isAuthenticated,
      MiddlewareVersion(MakeRouters.version),
      openAPIRoute(
        {
          tag: "Machine",
          summary: "Calculate machine and factory health score",
          response: machineHealthScoreCalculationResponseSchema,
        },
        async (_, res) => {
          const records = await getAllMachineHealthRecords();
          const factoryRecords = await factoryAllMachineHealthRecords(records)
          const result = getMachineHealthCalculation(factoryRecords);

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
