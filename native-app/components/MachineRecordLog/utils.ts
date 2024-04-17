import { MachineType } from "~data/types";

export const machineNames = [
  { label: "Welding Robot", value: MachineType.WeldingRobot },
  { label: "PaintingStation", value: MachineType.PaintingStation },
  { label: "Assembly Line", value: MachineType.AssemblyLine },
  {
    label: "Quality Control Station",
    value: MachineType.QualityControlStation,
  },
];

export const partNames = [
  { value: "arcStability", label: "Arc Stability" },
  {
    value: "coolingEfficiency",
    label: "Cooling Efficiency",
  },
  { value: "electrodeWear", label: "Electrode Wear" },
  { value: "seamWidth", label: "Seam Width" },
  {
    value: "shieldingPressure",
    label: "Shielding Pressure",
  },
  { value: "vibrationLevel", label: "Vibration Level" },
  { value: "wireFeedRate", label: "Wire Feed Rate" },
  {
    value: "colorConsistency",
    label: "Color Consistency",
  },
  { value: "flowRate", label: "Flow Rate" },
  {
    value: "nozzleCondition",
    label: "Nozzle Condition",
  },
  { value: "pressure", label: "Pressure" },
  {
    value: "alignmentAccuracy",
    label: "Alignment Accuracy",
  },
  { value: "beltSpeed", label: "Belt Speed" },
  {
    value: "fittingTolerance",
    label: "Fitting Tolerance",
  },
  { value: "speed", label: "Speed" },
  {
    value: "cameraCalibration",
    label: "Camera Calibration",
  },
  {
    value: "criteriaSettings",
    label: "Criteria Settings",
  },
  {
    value: "lightIntensity",
    label: "Light Intensity",
  },
  {
    value: "softwareVersion",
    label: "Software Version",
  },
];