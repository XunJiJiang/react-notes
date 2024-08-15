type AllType =
  | Node
  | string
  | number
  | boolean
  | null
  | undefined
  | {
      [key: string]: AllType;
    };

const deepCopy = (obj: AllType): AllType => {
  const map = new WeakMap();

  const _deepCopy = (_obj: AllType): AllType => {
    if (
      _obj &&
      (_obj as Node).nodeType &&
      typeof (_obj as Node).nodeType === 'number' &&
      (_obj as Node).nodeType === Node.ELEMENT_NODE
    ) {
      return _obj;
    }

    if (typeof _obj !== 'object' || _obj === null) return _obj;
    if (map.has(_obj)) return map.get(_obj);

    const result: { [key: string]: AllType } = {};

    map.set(_obj, result);

    for (const key in _obj) {
      if (Object.prototype.hasOwnProperty.call(_obj, key)) {
        result[key] = _deepCopy((_obj as { [key: string]: AllType })[key]);
      }
    }

    return result;
  };

  return _deepCopy(obj);
};

export default deepCopy;
