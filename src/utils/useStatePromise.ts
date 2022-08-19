import { SetStateAction, useEffect, useState } from "react";

const useStatePromise = <T extends any>(init: T): [T, (value: SetStateAction<T>) => Promise<void>] => {
  const [cb, setCb] = useState<() => void>();
  const [state, _setState] = useState<T>(init);

  useEffect(() => {
    if(cb) cb();
    setCb(undefined);
  }, [state])

  const setState = (value: SetStateAction<T>) => {
    return new Promise<void>((resolve, reject) => {
      setCb(() => resolve());
      _setState(value);
    })
  }

  return [state, setState];
}

export default useStatePromise;
