import { useState } from 'react';

/**
 * Use state value from LocalStorage
 * @param initialState initial state
 */
export function useStateArray<T>(
  initialState: T[] | (() => T[])
): [T[], (value: T[]) => void, (value: T) => void, (index: number) => void, (index: number, val: T) => void] {
  let [v, setV] = useState<T[]>(initialState);

  return [
    // value
    v,

    // set value
    (val: T[]) => {
      setV(val);
    },

    // push value
    (val: T) => {
      setV((old: T[]) => [...old, val]);
    },

    // delete by index
    (index: number) => {
      setV(v.filter((item, itemIndex) => index !== itemIndex));
    },

    // set by index
    (index: number, val: T) => {
      let newArr = [...v];
      newArr[index] = val;
      setV(newArr);
    }
  ];
}
