import './index.css';
import { forwardRef, useImperativeHandle, useEffect } from 'react';
import APopover from './components/a-popover';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as StyleHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

function MarkdownComponent ({ markdown }, ref) {
  const contents = [];

  const contentsMap = new Map();

  useEffect(() => {
    contents.forEach((content) => {
      const { node, id } = content;
      if (!node) return;
      const offsetTop = node.offsetTop;
      content.offsetTop = offsetTop;
    });
  });

  /**
   * 设置 contentsMap
   * 检查 id 是否已存在，如果存在则将内容放入数组，同时警告
   * @param {Array} content 
   */
  function setContents (content) {
    contents.push(content);
    const id = content.id;
    if (contentsMap.has(id)) {
        console.warn(`id: ${id} 已存在`);
        const oldContent = contentsMap.get(id);
        if (Array.isArray(oldContent)) {
          oldContent.push(content);
        } else {
          contentsMap.set(id, [oldContent, content]);
        }
      } else {
        contentsMap.set(id, content);
      }
  }

  // 记录每个标题的 id 的，由空格分割的字符串对应的 key
  const idSliceMap = new Map();
  // 下一个分割字符串的 key
  let keyIndex = 1;

  /**
   * 创建标题的 id
   * @param {string} children 
   * @returns 
   */
  function createId (children) {
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
    return 'markdown-title' + id;
  }

  useImperativeHandle(ref, () => ({
    contents
  }));

  return (
    <Markdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      className='markdown'
      components={{
        code ({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '');
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              style={StyleHighlighter}
              className={`markdown-code markdown-long-code`}
              language={match[1]}
              PreTag='div'
              {...props}
            />
          ) : (
            <code className={`markdown-code markdown-short-code ${className ?? ''}`} {...props}>
              {children}
            </code>
          )
        },
        a ({ className, children, ...props }) {
          return (
            <APopover
              className={`markdown-link ${className ?? ''}`}
              {...props}
            >
              {children}
            </APopover>
          )
        },
        blockquote ({ node, inline, className, children, ...props }) {
          return (
            <blockquote
              className={`markdown-blockquote ${className ?? ''}`}
              {...props}
            >
              {children}
            </blockquote>
          )
        },
        pre ({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(children.props.className ?? '');
          return (
            <pre
              ref={(node) => {
                node && node.children && node.children[0] && node.children[0].setAttribute('data-language', match ? match[1] : '');
              }}
              className={`markdown-pre ${className ?? ''}`}
              {...props}
            >
              {children}
              <i
                className={`markdown-pre-copy`}
                onClick={(e) => {
                  const text = e.target.previousSibling.innerText;
                  navigator.clipboard.writeText(text).then(() => {
                    // console.log('copy success');
                  }).catch(() => {
                    console.warn('copy fail')
                  });
                }}
              >copy</i>
            </pre>
          )
        },
        h1 ({ node, inline, className, children, id = createId(children), ...props }) {
          const content = { id, label: children, level: 1, node: null };
          return (
            <h1
              ref={(node) => {
                content.node = node;
                node && setContents(content);
              }}
              id={id}
              className={`markdown-h1 ${className ?? ''}`} {...props}
            >
              {children}
            </h1>
          )
        },
        h2 ({ node, inline, className, children, id = createId(children), ...props }) {
          const content = { id, label: children, level: 2, node: null };
          return (
            <h2
              ref={(node) => {
                content.node = node;
                node && setContents(content);
              }}
              id={id}
              className={`markdown-h2 ${className ?? ''}`} {...props}
            >
              {children}
            </h2>
          )
        },
        h3 ({ node, inline, className, children, id = createId(children), ...props }) {
          const content = { id, label: children, level: 3, node: null };
          return (
            <h3
              ref={(node) => {
                content.node = node;
                node && setContents(content);
              }}
              id={id}
              className={`markdown-h3 ${className ?? ''}`} {...props}
            >
              {children}
            </h3>
          )
        }
      }}
    />
  )
}

export default forwardRef(MarkdownComponent);