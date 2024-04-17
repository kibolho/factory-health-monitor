import { db } from "../../utils/db";
import {
  AssemblyLinePart,
  MachineType,
  PaintingStationPart,
  QualityControlStationPart,
  WeldingRobotPart,
  partInfo,
} from "../../../../native-app/data/types";
import { calculateMachineHealth } from "./calculations";
import { MachineHealthRecord } from "./schemas";

export const getMachineHealthCalculation = (
  machines: Partial<
    Record<
      MachineType,
      Partial<
        Record<
          | WeldingRobotPart
          | AssemblyLinePart
          | PaintingStationPart
          | QualityControlStationPart,
          number
        >
      >
    >
  >
) => {
  if (!machines) {
    return { error: "Invalid input format" };
  }

  const machineScores: {
    [key in MachineType]?: number;
  } = {};
  let factoryScore = 0;
  let machineCount = 0;

  // Calculate scores for each machine
  for (const machineName in machines) {
    const machine = machines[machineName as MachineType] as Record<
      | WeldingRobotPart
      | AssemblyLinePart
      | PaintingStationPart
      | QualityControlStationPart,
      number
    >;
    const machineScore = calculateMachineHealth(
      machineName as MachineType,
      Object.keys(machine).reduce((parts: partInfo[], partName) => {
        const partNameTyped = partName as
          | WeldingRobotPart
          | AssemblyLinePart
          | PaintingStationPart
          | QualityControlStationPart;
        parts.push({
          name: partNameTyped,
          value: machine[partNameTyped],
        });
        return parts;
      }, [])
    );

    machineScores[machineName as MachineType] = Number(machineScore.toFixed(2));

    factoryScore += machineScore;
    machineCount++;
  }

  // Calculate the factory score (average of machine scores)
  factoryScore = machineCount > 0 ? factoryScore / machineCount : 0;

  return {
    factory: Number(factoryScore.toFixed(2)),
    machineScores,
  };
};

export const createMachineHealthRecord = async (
  record: MachineHealthRecord
) => {
  return db.machineHealthRecord.create({
    data: record,
  });
};

export const deleteAllMachineHealthRecords = async () => {
  return db.machineHealthRecord.deleteMany();
}


export const getAllMachineHealthRecords = async () => {
  return await db.machineHealthRecord.findMany();
}

export const factoryAllMachineHealthRecords = async (records: {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  machine: string;
  partType: string;
  value: number;
}[]) => {
  return records.reduce((result, record) => {
    const machineType = record.machine as MachineType;
    const partType = record.partType as
      | WeldingRobotPart
      | AssemblyLinePart
      | PaintingStationPart
      | QualityControlStationPart;

    if (!result[machineType]) {
      result[machineType] = {};
    }

    if (!!result[machineType][partType]) {
      result[machineType][partType] = Math.max(
        result[machineType][partType] as number,
        record.value
      );
    } else {
      result[machineType][partType] = record.value;
    }

    return result;
  }, {} as Record<MachineType, Partial<Record<WeldingRobotPart | AssemblyLinePart | PaintingStationPart | QualityControlStationPart, number>>>);
};
