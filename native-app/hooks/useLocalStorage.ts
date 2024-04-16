import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { Storage } from '../infra/storage';

const getKeyValue = async (
  key: any,
  initialValue: any,
  setValue: (arg: any) => any,
  storageService = Storage
): Promise<void> => {
  try {
    const item = await storageService.get(key);
    setValue(item ?? null);
  } catch {
    await storageService.save(key, null);
    setValue(null);
  }
};

const useFetch = (key: any, initialValue: any, storageService = Storage): any => {
  const [value, setValue] = useState();

  const fetchValue = useCallback(() => {
    getKeyValue(key, initialValue, setValue, storageService);
  }, [key, initialValue, setValue, storageService]);

  useEffect(() => {
    fetchValue();
  }, [fetchValue]);

  return { value, fetchValue };
};

function useLocalStorage<T = any>(
  key: string,
  initialValue?: T,
  storageService = Storage
): [T, Dispatch<SetStateAction<T | null>>, () => void] {
  const { value: fetchedValue, fetchValue } = useFetch(key, initialValue, storageService);
  const [storedValue, setStoredValue] = useState(fetchedValue);

  useEffect(() => {
    setStoredValue(fetchedValue);
  }, [fetchedValue]);

  const setValue = useCallback(
    (value: any) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        storageService.save(key, valueToStore);
      } catch {}
    },
    [key, storedValue]
  );

  return [storedValue === undefined ? initialValue : storedValue, setValue, fetchValue];
}

export default useLocalStorage;
