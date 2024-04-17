import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Alert, Button, StyleSheet } from "react-native";
import { MachineScore } from "../../components/MachineScore";
import { PartsOfMachine } from "../../components/PartsOfMachine";
import { Text, View } from "../../components/Themed";
import { API_ROUTES } from "../../constants";
import { httpClient } from "../../infra/http";
import { HttpStatusCode } from "../../infra/http/http-client";
import { queryClient } from "../../providers/reactQueryProvider";

export default function StateScreen() {
  const { data: machineData } = useQuery({
    queryKey: ["machineRecords"],
    queryFn: async () => {
      const { statusCode, body } = await httpClient.request({
        url: API_ROUTES.machine_record,
        method: "get",
      });
      if (statusCode === HttpStatusCode.ok) {
        return body;
      }
      throw new Error("Failed to retrieve machine records");
    },
  });
  const { mutate: resetMachineData } = useMutation({
    mutationFn: async () => {
      const { statusCode, body } = await httpClient.request({
        url: API_ROUTES.machine_record,
        method: "delete",
      });
      if (statusCode !== HttpStatusCode.accepted) {
        throw new Error("Failed to reset machine records");
      }
      queryClient.setQueryData(["machineRecords"], () => []);
      queryClient.setQueryData(["machineScore"], () => []);
      return body.message;
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
    onSuccess(data) {
      Alert.alert("Success", data);
    },
  });

  const { data: machineScore, mutate: calculateHealth } = useMutation({
    mutationKey: ["machineScore"],
    mutationFn: async () => {
      const { statusCode, body } = await httpClient.request({
        url: API_ROUTES.machine_calculate,
        method: "get",
      });
      if (statusCode === HttpStatusCode.ok) {
        return body;
      }
      throw new Error("Failed to calculate health");
    },
    onError: (error) => {
      Alert.alert("Error", error.message);
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      {!(machineData?.length > 0) && (
        <Link href="/two" style={styles.link}>
          <Text style={styles.linkText}>
            Please log a part to check machine health
          </Text>
        </Link>
      )}
      {machineData?.length > 0 && (
        <>
          <PartsOfMachine
            machineData={machineData}
          />
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Text style={styles.title}>Factory Health Score</Text>
          <Text style={styles.text}>
            {!!machineScore?.factory || machineScore?.factory === 0
              ? machineScore?.factory
              : "Not yet calculated"}
          </Text>
          {machineScore && (
            <>
              <Text style={styles.title2}>Machine Health Scores</Text>
              {Object.keys(machineScore?.machineScores)?.map((key) => (
                <MachineScore
                  key={key}
                  machineName={key}
                  score={machineScore?.machineScores[key]}
                />
              ))}
            </>
          )}
        </>
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Calculate Health" onPress={() => calculateHealth()} />
      <View style={styles.resetButton}>
        <Button
          title="Reset Machine Data"
          onPress={async () => await resetMachineData()}
          color="#FF0000"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 17,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  text: {},
  link: {
    paddingBottom: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  resetButton: {
    marginTop: 10,
  },
});
