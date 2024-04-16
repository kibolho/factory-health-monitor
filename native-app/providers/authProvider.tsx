import React, { PropsWithChildren, createContext, useContext } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import { IUser, StorageKeys, ITokens } from '../infra/storage/storageKeys';

const AuthContext = createContext<
  | {
      setUserInfo: React.Dispatch<IUser | null>;
      userInfo: IUser;
      setTokens: React.Dispatch<ITokens | null>;
      isAuthenticated: boolean;
    }
  | undefined
>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [userInfo, setUserInfo] = useLocalStorage<IUser>(StorageKeys.USER_INFO);
  const [tokens, setTokens] = useLocalStorage<ITokens>(StorageKeys.SAVED_TOKENS);

  return (
    <AuthContext.Provider
      value={{
        setTokens,
        isAuthenticated: !!tokens,
        setUserInfo,
        userInfo,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
