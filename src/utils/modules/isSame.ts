import type { AllType } from '@type/index.d.ts';

const isSame = (
  v1: AllType,
  v2: AllType,
  config?: {
    deep: boolean;
  }
): boolean => {
  if (typeof v1 !== typeof v2) return false;
  else if (
    typeof v1 !== 'object' ||
    typeof v2 !== 'object' ||
    v1 === null ||
    v2 === null
  )
    return Object.is(v1, v2);
  else if (config?.deep) {
    const keys1 = Object.keys(v1);
    const keys2 = Object.keys(v2);
    if (keys1.length !== keys2.length) return false;
    for (const key in v1) {
      if (
        !isSame(v1[key as keyof typeof v1], v2[key as keyof typeof v1], config)
      )
        return false;
    }
    return true;
  }
  throw new Error('isSame is not implemented. There may be unhandled types');
};

export default isSame;
