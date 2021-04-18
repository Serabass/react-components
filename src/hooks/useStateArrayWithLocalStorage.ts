import { useState } from 'react';

type ArrayLocalStorage<T> = [
  T[],
  (value: T[]) => void,
  (value: T) => void,
  (index: number) => void,
  (index: number, val: T) => void
];

export type UseArrayLocalStorage = <T>(
  key: string,
  initialState: T[]
) => ArrayLocalStorage<T>;

/**
 * Returns a hook for LocalStorage values
 *
 * @param prefix A prefix
 */
export function createArrayUseLocalStorage(
  prefix: string
): UseArrayLocalStorage {
  return <T>(key: string, initialState: T[]) =>
    useStateArrayWithLocalStorage(`${prefix}::${key}`, initialState);
}

/**
 * Use state value from LocalStorage
 * @param key
 * @param initialState initial state
 */
export function useStateArrayWithLocalStorage<T>(
  key: string,
  initialState: T[]
): ArrayLocalStorage<T> {
  let item = localStorage.getItem(key);
  let value: T[];
  if (!item) {
    value =
      typeof initialState === 'function' // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (initialState as any)()
        : initialState;
  } else {
    value = JSON.parse(item);
  }
  let [v, setV] = useState<T[]>(value);

  return [
    // value
    v,

    // set value
    (val: T[]) => {
      localStorage.setItem(key, JSON.stringify(val));
      setV(val);
    },

    // push value
    (val: T) => {
      setV((old: T[]) => {
        let result = [...old, val];
        localStorage.setItem(key, JSON.stringify(result));
        return result;
      });
    },

    // delete by index
    (index: number) => {
      let result = v.filter((item, itemIndex) => index !== itemIndex);
      localStorage.setItem(key, JSON.stringify(result));
      setV(result);
    },

    // set by index
    (index: number, val: T) => {
      let newArr = [...v];
      newArr[index] = val;
      localStorage.setItem(key, JSON.stringify(newArr));
      setV(newArr);
    },
  ];
}
