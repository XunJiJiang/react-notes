// 记录每个标题的 id 的，由空格分割的字符串对应的 key
const idSliceMap = new Map();
// 下一个分割字符串的 key
let keyIndex = 1;

/**
 * 创建标题的 id
 * @param {string} children 
 * @returns 
 */
export function createId (children) {
  const idSlices = children.split(' ');
  let id = '';
  idSlices.forEach((slice) => {
    const key = idSliceMap.get(slice);
    if (key) {
      id += `-${key}`;
    } else {
      id += `-${keyIndex}`;
      idSliceMap.set(slice, keyIndex++);
    }
  });
  return 'markdown-title' + id + '-';
  // + randomCharacters(20);
}
