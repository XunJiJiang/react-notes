import type { PreProps } from '@type/modules/comp-markdown-comp-pre.d.ts';

import './index.css';
import { useRef } from 'react';
import Icon from '@components/icon/index.tsx';

function Pre({ className = '', children, ...props }: PreProps) {
  if (typeof children === 'undefined' || children === null || typeof children !== 'object' || !('props' in children)) {
    throw new Error('markdown pre props.children 错误类型');
  }
  const match = /language-(\w+)/.exec(children.props.className ?? '');
  const preRef = useRef<HTMLPreElement | null>(null);
  return (
    <pre
      ref={node => {
        node && node.children && node.setAttribute('data-language', match ? match[1] : '');
        preRef.current = node;
      }}
      className={`markdown-pre ${className ?? ''}`}
      {...props}
    >
      {children}
      <i
        className={`markdown-pre-copy`}
        onClick={() => {
          if (preRef.current === null) return;
          try {
            const text = preRef.current.innerText.replace('1', '').replace(/\n(\d+)/g, '');

            navigator.clipboard
              .writeText(text)
              .then(() => {
                // console.log('copy success');
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
      </i>
    </pre>
  );
}

export default Pre;
