import { router } from 'expo-router';

import { Storage } from '../infra/storage';
import { StorageKeys } from '../infra/storage/storageKeys';

export const logout = () => {
  Storage.del(StorageKeys.SAVED_TOKENS);
  router.replace('/login');
};
