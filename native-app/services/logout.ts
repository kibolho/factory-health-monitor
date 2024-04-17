import { router } from "expo-router";

import { Storage } from "../infra/storage";
import { StorageKeys } from "../infra/storage/storageKeys";
import { API_ROUTES } from "../constants";
import { HttpClient } from "../infra/http/http-client";

export const logout = async ({ httpClient }: { httpClient: HttpClient }) => {
  await httpClient.request({
    url: API_ROUTES.logout,
    method: "post",
  });
  Storage.del(StorageKeys.SAVED_TOKENS);
  router.replace("/login");
};
