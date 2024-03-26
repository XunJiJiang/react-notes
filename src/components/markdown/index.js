import './index.css';
import { forwardRef, useImperativeHandle } from 'react';
import APopover from './components/a-popover';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as StyleHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
        pre ({ node, inline, className, children, ...props }) {
          return (
            <pre
              className={`markdown-pre ${className ?? ''}`}
              {...props}
            >
              {children}
            </pre>
          )
        },
        h1 ({ node, inline, className, children, id = children.split(' ').join('-').toLowerCase(), ...props }) {
          contents.set(id, { id, label: children, level: 1, node: null });
          return (
            <h1
              ref={(node) => (contents.get(id).node = node)}
              className={`markdown-h1 ${className ?? ''}`} {...props}
            >
              {children}
            </h1>
          )
        },
        h2 ({ node, inline, className, children, id = children.split(' ').join('-').toLowerCase(), ...props }) {
          contents.set(id, { id, label: children, level: 2, node: null });
          return (
            <h2
              ref={(node) => (contents.get(id).node = node)}
              className={`markdown-h2 ${className ?? ''}`} {...props}
            >
              {children}
            </h2>
          )
        },
        h3 ({ node, inline, className, children, id = children.split(' ').join('-').toLowerCase(), ...props }) {
          contents.set(id, { id, label: children, level: 3, node: null });
          return (
            <h3
              ref={(node) => (contents.get(id).node = node)}
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