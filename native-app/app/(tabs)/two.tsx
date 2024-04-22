import { Button } from "react-native";

import styled from "styled-components/native";
import { MachineRecordLog } from "../../components/MachineRecordLog/MachineRecordLog";
import { httpClient } from "../../infra/http";
import { logout } from "../../services/logout";

export default function TabTwoScreen() {
  return (
    <Container>
      <MachineRecordLog />
      <Button
        title="Logout"
        onPress={async () => logout({ httpClient: httpClient })}
        color="#FF0000"
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 24px;
  background-color: #fff;
`;