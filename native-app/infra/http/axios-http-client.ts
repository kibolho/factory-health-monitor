import axios, { AxiosError } from "axios";

import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from "./http-client";
import { Storage } from "../storage";
import { StorageKeys, ITokens } from "../storage/storageKeys";

import { API_ROUTES } from "../../constants";
import { logout } from "../../services/logout";

const AxiosInstance = axios.create({
  baseURL: API_ROUTES.API_BASE_URL,
});

let isRefreshing = false;
let failedRequestsQueue: any[] = [];

AxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const isUnauthorized =
      error.request &&
      [
        HttpStatusCode.unauthorized,
        HttpStatusCode.unprocessableContent,
      ].includes(error?.response?.status);
    const isTheRefreshTokenEndpoint = error.config?.url?.includes(
      API_ROUTES.refresh
    );
    const isToRefresh = isUnauthorized && !isTheRefreshTokenEndpoint;
    if (isToRefresh) {
      const originalConfig = error.config;

      if (!isRefreshing) {
        isRefreshing = true;
        const tokens = await Storage.get<ITokens>(StorageKeys.SAVED_TOKENS);
        httpClient
          .request({
            url: API_ROUTES.refresh,
            method: "post",
            body: {
              refreshToken: tokens?.refreshToken,
            },
          })
          .then(async (response) => {
            if(response.statusCode !== HttpStatusCode.ok) throw new Error("Failed to refresh token");
            const { accessToken, refreshToken } = response.body;

            await Storage.save(StorageKeys.SAVED_TOKENS, {
              accessToken,
              refreshToken,
            });

            AxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

            failedRequestsQueue.forEach((request) =>
              request.onSuccess(accessToken)
            );
            failedRequestsQueue = [];
          })
          .catch((err) => {
            failedRequestsQueue.forEach((request) => request.onFailure(err));
            failedRequestsQueue = [];
            
            logout({ httpClient });
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({
          onSuccess: (token: string) => {
            originalConfig.headers.Authorization = `Bearer ${token}`;

            resolve(AxiosInstance(originalConfig));
          },
          onFailure: (err: AxiosError) => {
            reject(err);
          },
        });
      });
    }
    return Promise.reject(error);
  }
);

export class AxiosHttpClient implements HttpClient {
  async request<T = any>({
    isAuthenticated = true,
    ...data
  }: HttpRequest): Promise<HttpResponse<T>> {
    if (isAuthenticated) {
      const tokens = await Storage.get<ITokens>(StorageKeys.SAVED_TOKENS);
      if (!tokens) return { statusCode: HttpStatusCode.unauthorized };
      data.headers = {
        ...data.headers,
        Authorization: `Bearer ${tokens.accessToken}`,
      };
    }
    data.params = {
      version: "1.0.0",
      ...data.params,
    };
    const response = await AxiosInstance.request({
      baseURL: data.baseURL,
      url: data.url,
      method: data.method,
      data: data.body,
      params: data.params,
      headers: data.headers,
    })
      .then((response) => {
        return {
          statusCode: response?.status ?? HttpStatusCode.badRequest,
          body: response?.data ?? null,
        };
      })
      .catch(async (error) => {
        return {
          statusCode: error?.response?.status ?? HttpStatusCode.badRequest,
          body: error?.response?.data ?? { message: "Erro desconhecido" },
        };
      });
    return response;
  }
}

export const httpClient = new AxiosHttpClient();
