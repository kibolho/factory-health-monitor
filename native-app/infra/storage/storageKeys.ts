export enum StorageKeys {
  SAVED_TOKENS = 'savedTokens',
  USER_INFO = 'userInfo',
}

export type ITokens = {
  accessToken: string;
  refreshToken: string;
}

export type IUser = {
  email: string;
};
