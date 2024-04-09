// 记录每个标题的 id 的由空格分割的字符串对应的 key
const idSliceMap = new Map();
// 下一个分割字符串的 key
let keyIndex = 1;

function createIdSlices (children) {
  if (typeof children === 'string') return children.split(' ');
  if (typeof children === 'object') {
    if (Array.isArray(children)) {
      return children.map((item) => {
        if (typeof item === 'string') return item;
        else return createIdSlices(item.props.children);
      });
    } else {
      throw new Error('createIdSlices 函数可能存在问题');
    }
  }
  throw new Error('createIdSlices 函数可能存在问题');
}

/**
 * 创建标题的 id
 * @param {string} children 
 * @returns 
 */
export function createId (children) {
  const idSlices = createIdSlices(children);
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
