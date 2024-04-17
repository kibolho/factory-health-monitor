import React from "react";
import { StyleSheet } from "react-native";

import { machineNames } from "../data/types";
import { Text } from "./Themed";

export const MachineScore = ({
  machineName,
  score,
}: {
  machineName: string;
  score: number;
}) => {
  return !!score || score === 0 ? (
    <Text style={styles.text}>{`${machineNames[machineName]}: ${score}`}</Text>
  ) : null;
};

const styles = StyleSheet.create({
  text: {},
});
