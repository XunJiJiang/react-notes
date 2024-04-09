function createChildren (children) {
  const _children = [];
  children.forEach((item, i) => {
    if (i === 0 || i === 1) return;
    _children.push(item);
  });
  console.log(_children)
  return _children;
}

const styleMap = new Map([
  ['<success/>', (children) => {
    createChildren(children)
    return [createChildren(children), 'markdown-blockquote-success']
  }],
  ['<warn/>', (children) => {
    return [createChildren(children), 'markdown-blockquote-warn']
  }],
  ['<danger/>', (children) => {
  return [createChildren(children), 'markdown-blockquote-danger']
  }],
  ['<info/>', (children) => {
  return [createChildren(children), 'markdown-blockquote-info']
  }]
]);

export default function Blockquote ({ node, inline, className, children, ...props }) {
  const [_children, styleClass] = ((() => {
    if (node.children && node.children[1]) {
      if (styleMap.has(node.children[1].value)) {
        return styleMap.get(node.children[1].value)(children);
      } else {
        return [children, 'markdown-blockquote-info'];
      }
    }
  })());
  return (
    <blockquote
      className={`markdown-blockquote ${styleClass} ${className ?? ''}`}
      {...props}
    >
      {_children}
    </blockquote>
  )
}