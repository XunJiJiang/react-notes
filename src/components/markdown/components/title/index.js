import { useId } from 'react';
import { createId } from '../../utils';

export function H1 ({ node, inline, className, children, setContents, getContent, ...props }) {
  const id = createId(children) + useId();
  const content = getContent(id) ?? { id, label: children, level: 1, node: null };
  return (
    <h1
      ref={(node) => {
        content.node = node;
        setContents(content);
      }}
      {...props}
      id={content.id}
      className={`markdown-h1 ${className ?? ''}`}
    >
      {children}
    </h1>
  )
}

export function H2 ({ node, inline, className, children, setContents, getContent, ...props }) {
  const id = createId(children) + useId();
  const content = getContent(id) ?? { id, label: children, level: 2, node: null };
  return (
    <h2
      ref={(node) => {
        content.node = node;
        setContents(content);
      }}
      {...props}
      id={content.id}
      className={`markdown-h2 ${className ?? ''}`}
    >
      {children}
    </h2>
  )
}

export function H3 ({ node, inline, className, children, setContents, getContent, ...props }) {
  const id = createId(children) + useId();
  const content = getContent(id) ?? { id, label: children, level: 3, node: null };
  return (
    <h3
      ref={(node) => {
        content.node = node;
        setContents(content);
      }}
      {...props}
      id={content.id}
      className={`markdown-h3 ${className ?? ''}`}
    >
      {children}
    </h3>
  )
}