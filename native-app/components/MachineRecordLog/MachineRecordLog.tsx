import React, { useCallback, useState } from "react";
import { Alert, Button, StyleSheet, TextInput } from "react-native";

import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "../../constants";
import { MachineType, PartInfoName } from "../../data/types";
import { httpClient } from "../../infra/http";
import { HttpStatusCode } from "../../infra/http/http-client";
import Picker from "../Picker";
import { Text, View } from "../Themed";
import { machineNames, partNames } from "./utils";
import { queryClient } from "../../providers/reactQueryProvider";
import { MachineHealthRecord } from "../../../backend/src/modules/machines/schemas";

export function MachineRecordLog() {
  const [machineName, setMachineName] = useState("");
  const [partName, setPartName] = useState("");
  const [partValue, setPartValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: registerMachineRecord } = useMutation({
    mutationFn: async (data: {
      machine: MachineType;
      partType: PartInfoName;
      value: number;
    }) => {
      const { statusCode, body } = await httpClient.request({
        url: API_ROUTES.machine_record,
        method: "post",
        body: data,
      });
      if (statusCode !== HttpStatusCode.created) {
        throw new Error("Failed to create machine data");
      }
      queryClient.setQueryData<MachineHealthRecord[]>(["machineRecords"], (prev) => [...prev, body]);

      return body;
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
    onSuccess: () => {
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    },
  });

  const savePart = useCallback(async () => {
    registerMachineRecord({
      machine: machineName as MachineType,
      partType: partName as PartInfoName,
      value: Number(partValue),
    });
  }, [machineName, partName, partValue]);

  return (
    <View>
      <Text style={styles.label}>Machine Name</Text>
      <Picker
        value={machineName}
        onSetValue={setMachineName}
        items={machineNames}
      />

      <Text style={styles.label}>Part Name</Text>
      <Picker value={partName} onSetValue={setPartName} items={partNames} />

      <Text style={styles.label}>Part Value</Text>
      <TextInput
        style={styles.input}
        value={partValue}
        keyboardType="numeric"
        onChangeText={(text) => setPartValue(text)}
        placeholder="Enter part value"
      />

      <Button title="Save" onPress={savePart} />

      {isSaved && <Text style={styles.healthScore}>Saved ✔️</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  healthScore: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
});
