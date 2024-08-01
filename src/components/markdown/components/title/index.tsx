import type {
  ContentNodeNullType,
  TitleProps
} from '@type/modules/comp-markdown-comp-title';
import type { ContentType } from '@type/modules/comp-markdown.d.ts';

import './index.css';
import { useId } from 'react';
import { Link } from 'react-router-dom';
import { createId, flatChild } from '../../utils/index.ts';

export function H1({
  className = '',
  children = '',
  setContents
  // ...props
}: TitleProps) {
  const id = createId(children) + useId();
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flatChild(children),
    level: 1,
    node: null
  };
  return (
    <h1
      ref={(node) => {
        if (!node) return;
        content.node = node;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h1 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-1`}
        to={encodeURI(content.hash)}
      >
        #
      </Link>
      {children}
    </h1>
  );
}

export function H2({
  className,
  children = '',
  setContents
  // ...props
}: TitleProps) {
  const id = createId(children) + useId();
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flatChild(children),
    level: 2,
    node: null
  };
  return (
    <h2
      ref={(node) => {
        if (!node) return;
        content.node = node;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h2 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-2`}
        to={encodeURI(content.hash)}
      >
        #
      </Link>
      {children}
    </h2>
  );
}

export function H3({
  className,
  children = '',
  setContents
  // ...props
}: TitleProps) {
  const id = createId(children) + useId();
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flatChild(children),
    level: 3,
    node: null
  };
  return (
    <h3
      ref={(node) => {
        if (!node) return;
        content.node = node;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h3 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-3`}
        to={encodeURI(content.hash)}
      >
        #
      </Link>
      {children}
    </h3>
  );
}
