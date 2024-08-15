import type {
  CreateIdSlicesFunc,
  CreateIdFunc
} from '@type/modules/comp-markdown-utils.d.ts';
import type { ContentLabelType } from '@type/modules/comp-markdown.d.ts';

// 记录每个标题的 id 的由空格分割的字符串对应的 key
const idSliceMap = new Map();
// 下一个分割字符串的 key
let keyIndex = 1;

const createIdSlices: CreateIdSlicesFunc = (children) => {
  if (typeof children === 'string') return children.split(' ');
  if (typeof children === 'object' && children !== null) {
    if (Array.isArray(children)) {
      return children
        .map((item) => {
          if (typeof item === 'string') return item;
          else return createIdSlices(item.props.children);
        })
        .flat();
    } else
      return createIdSlices(
        'props' in children ? children.props.children : null
      );
  }
  throw new Error('createIdSlices 函数可能存在问题');
};

/**
 * 创建标题的 id
 */
export const createId: CreateIdFunc = (children) => {
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
};

/**
 * 将children扁平化为一个字符串
 */
export const flatChild = (
  children:
    | ContentLabelType
    | {
        props: {
          children: string;
        };
      }
): string => {
  if (children === null) {
    throw console.error('markdown.comp.title.utils flatChild 未知类型 null');
  }

  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.reduce((p: string, c) => {
      return p + flatChild(c);
    }, '');
  }

  if (typeof children === 'object' && 'props' in children) {
    return flatChild(children.props.children);
  }

  throw console.error(
    `markdown.comp.title.utils flatChild 未知类型 ${typeof children}`
  );
};
