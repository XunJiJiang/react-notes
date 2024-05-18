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

  function _deepCopy(_obj: AllType): AllType {
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

    let result: { [key: string]: AllType } = {};

    map.set(_obj, result);

    for (let key in _obj) {
      if (_obj.hasOwnProperty(key)) {
        result[key] = _deepCopy((_obj as { [key: string]: AllType })[key]);
      }
    }

    return result;
  }

  return _deepCopy(obj);
};

export default deepCopy;
