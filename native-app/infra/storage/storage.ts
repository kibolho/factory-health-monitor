import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageKeys } from './storageKeys';
import { StorageService } from './types';

class Storage implements StorageService {
  public async save<T = string>(key: StorageKeys, value: T): Promise<void> {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  public async get<T = string>(key: StorageKeys): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  public async del(key: StorageKeys): Promise<void> {
    try {
      return await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error(e, { message: `error removing from AsyncStorage; name: ${key}` });
    }
  }
}

export default Storage;
