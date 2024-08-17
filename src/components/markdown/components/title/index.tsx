import type {
  ContentNodeNullType,
  TitleProps
} from '@type/modules/comp-markdown-comp-title';
import type { ContentType } from '@type/modules/comp-markdown.d.ts';

import './index.css';
import { useId } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@components/icon/index.tsx';
import { createId } from '../../utils/index.ts';
import { flatChildren } from '@utils/index.ts';

export const H1 = ({
  className = '',
  children = '',
  setContents
  // ...props
}: TitleProps) => {
  const id = createId(children) + useId();
  const flattedChild = flatChildren(children);
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flattedChild,
    level: 1,
    node: null
  };
  return (
    <h1
      ref={(node) => {
        if (!node) return;
        content.node = node;
        content.id = node.id;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h1 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-1`}
        to={encodeURI(content.hash)}
        title={flattedChild}
      >
        <Icon name="link" size={32} />
      </Link>
      {children}
    </h1>
  );
};

export const H2 = ({
  className,
  children = '',
  setContents
  // ...props
}: TitleProps) => {
  const id = createId(children) + useId();
  const flattedChild = flatChildren(children);
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flattedChild,
    level: 2,
    node: null
  };
  return (
    <h2
      ref={(node) => {
        if (!node) return;
        content.node = node;
        content.id = node.id;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h2 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-2`}
        to={encodeURI(content.hash)}
        title={flattedChild}
      >
        <Icon name="link" size={24} />
      </Link>
      {children}
    </h2>
  );
};

export const H3 = ({
  className,
  children = '',
  setContents
  // ...props
}: TitleProps) => {
  const id = createId(children) + useId();
  const flattedChild = flatChildren(children);
  const content: ContentNodeNullType = {
    id,
    label: children,
    hash: '#' + flattedChild,
    level: 3,
    node: null
  };
  return (
    <h3
      ref={(node) => {
        if (!node) return;
        content.node = node;
        content.id = node.id;
        setContents(content as ContentType);
      }}
      id={content.id}
      className={`markdown-title markdown-h3 ${className ?? ''}`}
    >
      <Link
        className={`markdown-title-a markdown-title-a-3`}
        to={encodeURI(content.hash)}
        title={flattedChild}
      >
        <Icon name="link" size={16} />
      </Link>
      {children}
    </h3>
  );
};

// export { H1, H2, H3 };
