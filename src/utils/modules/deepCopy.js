export default function deepCopy (obj) {
  const map = new WeakMap();

  function _deepCopy (_obj) {
    if (_obj && typeof _obj.nodeType === 'number' && _obj.nodeType === Node.ELEMENT_NODE) {
      return _obj;
    }

    if (typeof _obj !== 'object' || _obj === null) return _obj;
    if (map.has(_obj)) return map.get(_obj);

    let result = Array.isArray(_obj) ? [] : {};

    map.set(_obj, result);

    for (let key in _obj) {
      if (_obj.hasOwnProperty(key)) {
        result[key] = _deepCopy(_obj[key]);
      }
    }

    return result;
  }

  return _deepCopy(obj);
}