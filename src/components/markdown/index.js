import './index.css';
import { forwardRef, useImperativeHandle } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

function MarkdownComponent ({ markdown }, ref) {
  const contents = new Map();

  useImperativeHandle(ref, () => ({
    contents
  }));

  return (
    <Markdown
      children={markdown}
      remarkPlugins={[remarkGfm]}
      components={{
        code ({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className ?? '');
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              style={undefined}
              language={match[1]}
              PreTag='div'
              {...props}
            />
          ) : (
            <code className={`markdown-short-code ${className ?? ''}`} {...props}>
              {children}
            </code>
          )
        },
        a ({ node, inline, className, children, ...props }) {
          return (
            <a className={`markdown-link ${className ?? ''}`} {...props}>
              {children}
            </a>
          )
        },
        h1 ({ node, inline, className, children, ...props }) {
          const id = children.split(' ').join('-').toLowerCase();
          contents.set(id, {
            label: children,
            level: 1,
            node: null,
          });
          return (
            <h1
              ref={(node) => {
                contents.get(id).node = node;
              }}
              className={`markdown-h1 ${className ?? ''}`} {...props}
            >
              {children}
            </h1>
          )
        },
        h2 ({ node, inline, className, children, ...props }) {
          const id = children.split(' ').join('-').toLowerCase();
          contents.set(id, {
            label: children,
            level: 2,
            node: null,
          });
          return (
            <h2
              ref={(node) => {
                contents.get(id).node = node;
              }}
              className={`markdown-h2 ${className ?? ''}`} {...props}
            >
              {children}
            </h2>
          )
        },
      }}
    />
  )
}

export default forwardRef(MarkdownComponent);