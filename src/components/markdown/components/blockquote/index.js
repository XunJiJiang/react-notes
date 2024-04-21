import './index.css';

import Icon from '@components/icon';

const styleKeyList = ['success', 'warn', 'danger', 'info'];

function createChildren (children, tag, hasTitle = false, title = '', attributes = {}) {
  if (!styleKeyList.includes(tag)) return children;

  if (!hasTitle) {
    const _children = children.map((item, i) => {
      if (!('icon' in attributes) && (i === 0 || i === 1)) return false;
      if ('icon' in attributes && i === 1) {
        return (
          <p
            key={`markdown-blockquote-title-${tag}-icon`}
            className={`markdown-blockquote-title markdown-blockquote-title-${tag}`}
          >
            <Icon name={attributes.icon.value} />
          </p>
        )
      }
      return item;
    }).filter((item) => !!item);

    return _children;
  }

  if (hasTitle) {
    const _children = children.map((item, i) => {
      if (i === 1) {
        return (
          <p
            key={`markdown-blockquote-title-${tag}-title`}
            className={`markdown-blockquote-title markdown-blockquote-title-${tag}`}
          >
            {'icon' in attributes &&
              <>
                <Icon name={attributes.icon.value} className='markdown-blockquote-title-icon' />
                <span> </span>
              </>
            }
            {title}
          </p>
        );
      }
      return item;
    });
    return _children;
  }

  return children;
}

function getStyleProps (node) {
  if (!node) return [null, false, '', {}];

  let domText = '';
  const parser = new DOMParser();

  if ('value' in node) {
    domText += node.value;
  } else if ('children' in node) {
    if (Array.isArray(node.children)) {
      node.children.forEach((item) => {
        domText += item.value;
      });
    } else {
      throw new Error('getStyleProps函数问题 块引用的子节点是对象不是数组');
    }
  } else {
    throw new Error('getStyleProps函数问题 块引用的子节点存在未知数据类型或结构');
  }

  const doc = parser.parseFromString(domText, 'application/xml');

  if (doc.getElementsByTagName("parsererror").length > 0) return [null, false, '', {}];

  const tag = doc.childNodes[0].tagName;

  const title = doc.childNodes[0].innerHTML;

  const attributes = doc.childNodes[0].attributes;

  return [tag, title !== '', title, attributes]; 
}

export default function Blockquote ({ node, inline, className, children, ...props }) {
  const [_children, _className] = ((() => {
    if (node.children && node.children[1]) {
      const [key, hasTitle, title, attributes] = getStyleProps(node.children[1]);
      if (styleKeyList.includes(key)) {
        return [createChildren(children, key, hasTitle, title, attributes), `markdown-blockquote-${key}`];
      } else {
        return [children, 'markdown-blockquote-info'];
      }
    } else {
      const _children = ['\n', <p key='markdown-blockquote-blank-block' className='markdown-blockquote-blank-block'>空白的块引用</p>, '\n'];
      return [_children, 'markdown-blockquote-info'];
    }
  })());
  return (
    <blockquote
      key={node.key}
      className={`markdown-blockquote ${_className} ${className ?? ''}`}
      {...props}
    >
      {_children}
    </blockquote>
  )
}