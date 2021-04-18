import { useState } from 'react';
// import debounce from 'lodash/debounce';

export type StateValue<T> = T | (() => T);
export type UseLocalStorage = <T>(
  key: string,
  initialState: StateValue<T>,
  deleteOn?: StateValue<T>
) => [T, (value: T) => void];

/**
 * Returns a hook for LocalStorage values
 *
 * @param prefix A prefix
 */
export function createUseLocalStorage(prefix: string): UseLocalStorage {
  return <T>(
    key: string,
    initialState: T | (() => T),
    deleteOn: T | (() => T) = initialState
  ) => useStateWithLocalStorage(`${prefix}::${key}`, initialState, deleteOn);
}

/**
 * Use state value from LocalStorage
 * @param key A key prefix
 * @param initialState initial state
 * @param deleteOn A value that handle deleting local storage key
 */
export function useStateWithLocalStorage<T>(
  key: string,
  initialState: StateValue<T>,
  deleteOn: StateValue<T> = initialState
): [T, (value: T) => void] {
  let item = localStorage.getItem(key);
  let value: T;
  if (!item) {
    value =
      typeof initialState === 'function'
        ? (initialState as () => T)()
        : initialState;
  } else {
    value = JSON.parse(item);
  }

  let [v, setV] = useState<T>(value);

  return [
    v,
    (val: T) => {
      if (val === deleteOn) {
        localStorage.removeItem(key);
      } else {
        // TODO найти способ использовать debounce
        localStorage.setItem(key, JSON.stringify(val));
      }
      setV(val);
    },
  ];
}
