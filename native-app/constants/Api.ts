import { Platform } from "react-native";

export const API_ROUTES = {
  API_BASE_URL: __DEV__
    ? `http://${Platform?.OS === "android" ? "10.0.2.2" : "localhost"}:3001`
    : "https://fancy-dolphin-65b07b.netlify.app",
  login: "/auth/login",
  logout: "/auth/logout",
  register: "/auth/register",
  refresh: "/auth/refresh",
  machine_calculate: "/machine-health/calculate",
  machine_record: "/machine-health/record",
};
