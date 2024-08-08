export type AllType =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | object
  | null
  | undefined
  | ((...args: unknown[]) => unknown);
