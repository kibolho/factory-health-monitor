export interface StorageService {
  save<T = string>(key: string, value: T): Promise<void>;
  get<T = string>(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
}
