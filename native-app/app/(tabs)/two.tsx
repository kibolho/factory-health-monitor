import { Button, StyleSheet } from "react-native";

import { MachineRecordLog } from "../../components/MachineRecordLog/MachineRecordLog";
import { View } from "../../components/Themed";
import { logout } from "../../services/logout";
import { httpClient } from "../../infra/http";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <MachineRecordLog />
      <View style={styles.separator} />
      <Button
        title="Logout"
        onPress={async () => logout({ httpClient: httpClient })}
        color="#FF0000"
      />
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
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
});
