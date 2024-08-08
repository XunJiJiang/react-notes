/** 一个可将字符串和对象用于key的map */
import type { AllType } from '@type/index.d.ts';

type WeakMapKey = object | ((...args: AllType[]) => AllType);

function isWeakMapKey(key: AllType): key is WeakMapKey {
  return ['object', 'function'].includes(typeof key);
}

function isSymbolKey(key: AllType): key is symbol {
  return typeof key === 'symbol';
}

type inferKeyType<T extends AllType> = T extends WeakMapKey ? 'weakMap' : 'map';

const unNeedReturnValue = ['object', 'function', 'symbol'];

function keyOfMap<T extends AllType>(key: T): inferKeyType<T> {
  if (isWeakMapKey(key)) {
    return 'weakMap' as inferKeyType<T>;
  }
  if (isSymbolKey(key)) {
    return (
      typeof Symbol.keyFor(key) !== 'string' ? 'weakMap' : 'map'
    ) as inferKeyType<T>;
  }
  return 'map' as inferKeyType<T>;
}

const insMap = new WeakMap<AnyMap, MapInstance>();

class MapInstance {
  public map = new Map();
  public weakMap = new WeakMap() as Map<unknown, AllType>;
}

class AnyMap {
  public get [Symbol.toStringTag]() {
    return 'AnyMap';
  }

  public constructor(iterable?: AllType) {
    insMap.set(this, new MapInstance());
    if (iterable === null || typeof iterable === 'undefined') return;
    const iterType = typeof iterable;
    try {
      for (const value of iterable as Iterable<[AllType, AllType]>) {
        if (!unNeedReturnValue.includes(typeof value))
          throw `Iterator value ${value} is not an entry`;
        const k = value[0];
        const v = value[1];
        this.set(k, v);
      }
    } catch (e) {
      if (typeof e === 'string') throw new TypeError(e);

      throw new TypeError(
        `${iterType}${unNeedReturnValue.includes(iterType) ? '' : ` ${String(iterable)}`} is not iterable (cannot read property Symbol(Symbol.iterator))`
      );
    }
  }

  public delete(key: AllType) {
    const mapKey = keyOfMap(key);
    return insMap.get(this)![mapKey].delete(key);
  }

  public get(key: AllType) {
    const mapKey = keyOfMap(key);
    return insMap.get(this)![mapKey].get(key);
  }

  public has(key: AllType) {
    const mapKey = keyOfMap(key);
    return insMap.get(this)![mapKey].has(key);
  }

  public set(key: AllType, value: AllType) {
    const mapKey = keyOfMap(key);
    return insMap.get(this)![mapKey].set(key, value);
  }
}

export default AnyMap;
