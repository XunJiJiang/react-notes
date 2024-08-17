import type { ContentLabelType } from '@type/modules/comp-markdown.d.ts';

/**
 * 将children扁平化为一个字符串
 */
const flatChildren = (
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
      return p + flatChildren(c);
    }, '');
  }

  if (typeof children === 'object' && 'props' in children) {
    return flatChildren(children.props.children);
  }

  throw console.error(
    `markdown.comp.title.utils flatChild 未知类型 ${typeof children}`
  );
};

export default flatChildren;
