/**
 * @example hasValue<[预期类型]>([值]): [值] is [预期类型] // 否则为false, [值] 不是 [预期类型]
 */
const hasValue = <T>(value: unknown): value is T => {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  return value !== null && value !== undefined;
};

export default hasValue;
