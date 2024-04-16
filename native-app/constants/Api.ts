import { Platform } from "react-native";

export const API_ROUTES = {
  API_BASE_URL: `http://${
    Platform?.OS === "android" ? "10.0.2.2" : "localhost"
  }:3001`,
  login: "/auth/login",
  register: "/auth/register",
  refresh: "/auth/refresh",
};
