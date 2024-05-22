import type { PreProps } from '@type/modules/comp-markdown-comp-pre.d.ts';

import './index.css';
import { useRef } from 'react';
import Icon from '@components/icon/index.tsx';

function Pre({ className = '', children, ...props }: PreProps) {
  if (
    typeof children === 'undefined' ||
    children === null ||
    typeof children !== 'object' ||
    !('props' in children)
  ) {
    throw new Error('markdown pre props.children 错误类型');
  }
  const match = /language-(\w+)/.exec(children.props.className ?? '');
  const preRef = useRef<HTMLPreElement | null>(null);
  const iRef = useRef<HTMLElement | null>(null);
  let isCopySuccess = false;
  return (
    <pre
      ref={(node) => {
        node &&
          node.children &&
          node.setAttribute('data-language', match ? match[1] : '');
        preRef.current = node;
      }}
      className={`markdown-pre ${className ?? ''}`}
      {...props}
    >
      {children}
      <i
        ref={iRef}
        className={'markdown-pre-copy'}
        onClick={() => {
          if (preRef.current === null) return;
          try {
            const text = preRef.current.innerText
              .replace('1', '')
              .replace(/\n(\d+)/g, '');

            navigator.clipboard
              .writeText(text)
              .then(() => {
              })
              .catch(() => {
                console.warn('copy fail');
              });
          } catch {
            throw new Error('markdown copy 未知错误');
          }
        }}
      >
        <Icon name="file-copy" className="markdown-pre-copy-icon" />
        <svg className="markdown-pre-copy-svg">
          <circle
            className="markdown-pre-copy-svg-circle"
            cx="8"
            cy="8"
            r="6"
            transform="rotate(-90 8 8)"
          />
          <polyline
            className="markdown-pre-copy-svg-polyline"
            points="5,8 7,11 11,6"
          />
        </svg>
      </i>
    </pre>
  );
}

export default Pre;
