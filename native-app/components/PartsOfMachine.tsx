import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Text } from "./Themed";
import { MachineType, PartInfoName, machineNames } from "../data/types";

export const PartsOfMachine = ({
  machineData,
}: {
  machineData: {
    machine: MachineType;
    partType: PartInfoName;
    value: number;
  }[];
}) => {
  const factoryData = useMemo(() => {
    return Object.entries(
      machineData.reduce((acc, { machine, partType, value }) => {
        if (!acc[machine]) acc[machine] = {};
        acc[machine][partType] = value;
        return acc;
      }, {})
    );
  }, [machineData]);

  return factoryData.map(([machine, part],index) => (
    <View key={`${machine}${part}${index}`} style={styles.container}>
      <Text style={styles.title}>{machineNames[machine]}</Text>
      {Object.entries(part).map(([partName, value]) => (
        <Text key={partName} style={styles.label}>
          {partName}: {value}
        </Text>
      ))}
    </View>
  ));
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    textAlign: "center",
  },
});
