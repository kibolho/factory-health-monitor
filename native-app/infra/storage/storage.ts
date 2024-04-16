import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageService } from './types';

class Storage implements StorageService {
  public async save<T = string>(key: string, value: T): Promise<void> {
    return await AsyncStorage.setItem(this.buildKey(key), JSON.stringify(value));
  }

  public async get<T = string>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(this.buildKey(key));
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  public async del(key: string): Promise<void> {
    return await AsyncStorage.removeItem(this.buildKey(key));
  }

  private buildKey(key: string): string {
    return key;
  }
}

export default Storage;
