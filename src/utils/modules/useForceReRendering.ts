import { useState } from 'react';

interface UseForceReRendering {
  (): void;
  value: object;
}

const symbol = Symbol('useForceReRendering');

const useForceReRendering = () => {
  const [v_, set_] = useState({
    [symbol]: true
  });
  return new Proxy((() => {}) as UseForceReRendering, {
    apply() {
      set_({
        [symbol]: true
      });
    },
    get(_target, key) {
      if (key === 'value') {
        return v_;
      }
    }
  });
};

export default useForceReRendering;
