import { z } from "zod";
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
} from "../../../../native-app/data/types";

export const machineHealthRecordSchema = z
  .object({
    machine: z.nativeEnum(MachineType),
    partType: z.union([
      z.nativeEnum(WeldingRobotPart),
      z.nativeEnum(PaintingStationPart),
      z.nativeEnum(AssemblyLinePart),
      z.nativeEnum(QualityControlStationPart),
    ]),
    value: z.number().min(0).openapi({ example: 4.0 }),
  })
  .openapi({ description: "Machine health record data" });

export type MachineHealthRecord = z.infer<typeof machineHealthRecordSchema>;
export const machineHealthScoreCalculationResponseSchema = z
  .object({
    machineScores: z.record(
      z.nativeEnum(MachineType),
      z.number().openapi({ example: 90.0 })
    ),
    factory: z.number().openapi({ example: 90 }),
  })
  .openapi({ description: "Machine health response" });
