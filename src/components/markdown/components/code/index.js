import './index.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as StyleHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';

function FencedCodeBlocks ({ children, match, ...props }) {
  return (
    <SyntaxHighlighter
      children={children}
      style={StyleHighlighter}
      className={`markdown-code markdown-long-code`}
      language={match[1]}
      PreTag='div'
      showLineNumbers={true}
      showInlineLineNumbers={true}
      customStyle={{
        paddingLeft: '0'
      }}
      {...props}
    />
  )
}

const styleKeyList = ['success', 'warn', 'danger', 'info'];

function getShortCodeBlocksConfig (children) {

  if (!children) return {
    children: '',
    tag: 'info'
  };

  let domText = '';
  const parser = new DOMParser();

  if (typeof children === 'string') {
    domText = children;
  } else {
    throw new Error('getShortCodeBlocksConfig函数问题 块引用的子节点存在未知数据类型或结构');
  }

  const doc = parser.parseFromString(domText, 'application/xml');

  if (doc.getElementsByTagName("parsererror").length > 0) return {
    children,
    tag: 'info'
  };

  const tag = doc.childNodes[0].tagName;

  const content = doc.childNodes[0].innerHTML;

  // const attributes = doc.childNodes[0].attributes;

  if (styleKeyList.includes(tag)) return {
    children: content,
    tag,
  };

  return {
    children: content,
    tag: 'info'
  }

}

function ShortCodeBlocks ({ children, className, ...props }) {
  const { children: _children, tag } = getShortCodeBlocksConfig(children);
  return (
    <code className={`markdown-code markdown-short-code markdown-short-code-${tag} ${className ?? ''}`} {...props}>
      {_children}
    </code>
  )
}

function Code ({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className ?? '');
  const _children = children ? String(children).replace(/\n$/, '') : ' ';
  return !inline && match ? (
    <FencedCodeBlocks match={match} {...props}>
      {_children}
    </FencedCodeBlocks>
  ) : (
    <ShortCodeBlocks className={className} {...props}>
      {children}
    </ShortCodeBlocks>
  )
}

export default Code;
