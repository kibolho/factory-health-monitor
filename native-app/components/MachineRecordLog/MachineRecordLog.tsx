import React, { useCallback, useState } from "react";
import { Alert, Button } from "react-native";

import { useMutation } from "@tanstack/react-query";
import styled from "styled-components/native";
import { MachineHealthRecord } from "../../../backend/src/modules/machines/schemas";
import { API_ROUTES } from "../../constants";
import { MachineType, PartInfoName } from "../../data/types";
import { httpClient } from "../../infra/http";
import { HttpStatusCode } from "../../infra/http/http-client";
import { queryClient } from "../../providers/reactQueryProvider";
import Picker from "../Picker";
import { machineNames, partNames } from "./utils";

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
      queryClient.setQueryData<MachineHealthRecord[]>(
        ["machineRecords"],
        (prev) => [...prev, body]
      );

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
    <Container>
      <Label>Machine Name</Label>
      <Picker
        value={machineName}
        onSetValue={setMachineName}
        items={machineNames}
      />

      <Label>Part Name</Label>
      <Picker value={partName} onSetValue={setPartName} items={partNames} />

      <Label>Part Value</Label>
      <TextInput
        value={partValue}
        keyboardType="numeric"
        onChangeText={(text) => setPartValue(text)}
        placeholder="Enter part value"
      />

      <Button title="Save" onPress={savePart} />

      {isSaved && <SavedText>Saved ✔️</SavedText>}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  gap: 12px;
  padding: 20px;
  align-items: center;
`;

const Label = styled.Text`
  font-size: 18px;
  margin-bottom: 8px;
`;

const TextInput = styled.TextInput`
  font-size: 16px;
  border-radius: 4px;
  padding-vertical: 12px;
  padding-horizontal: 10px;
  width: 100%;
  border-color: gray;
  border-width: 1px;
  margin-bottom: 20px;
`;
const SavedText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
`;
