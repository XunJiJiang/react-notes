import type { PreProps } from '@type/modules/comp-markdown-comp-pre.d.ts';

import './index.css';
import { useRef } from 'react';
import Icon from '@components/icon/index.tsx';
import { TimeoutTaskQueue } from '@utils/index.ts';

const Pre = ({ className = '', children }: PreProps) => {
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const taskQueue = new TimeoutTaskQueue();
  taskQueue
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--icon-opacity', '0');
      },
      delay: 0
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--svg-opacity', '1');
      },
      delay: 100
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--circle-stroke-dashoffset', '0');
      },
      delay: 300
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty(
          '--polyline-stroke-dashoffset',
          '0'
        );
      },
      delay: 300
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--svg-opacity', '0');
      },
      delay: 700
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--icon-opacity', '1');
      },
      delay: 300
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty(
          '--circle-stroke-dashoffset',
          '38'
        );
        buttonRef.current?.style.setProperty(
          '--polyline-stroke-dashoffset',
          '11'
        );
        buttonRef.current?.style.setProperty('--svg-transition', 'all 0s');
      },
      delay: 600
    })
    .addTask({
      callback: () => {
        buttonRef.current?.style.setProperty('--svg-transition', 'all 0.6s');
      },
      delay: 10
    });

  return (
    <pre
      ref={(node) => {
        if (node && node.children)
          node.setAttribute('data-language', match ? match[1] : '');
        preRef.current = node;
      }}
      className={`markdown-pre ${className ?? ''}`}
    >
      {children}
      <button
        ref={buttonRef}
        className={'markdown-pre-copy'}
        title="Copy code"
        onClick={() => {
          if (preRef.current === null) return;
          try {
            const text = preRef.current.innerText
              .replace('1', '')
              .replace(/\n(\d+)/g, '\n');

            navigator.clipboard
              .writeText(text)
              .then(() => {
                taskQueue.runOnce(false);
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
            points="4.6,8 6.6,11 10.6,6"
          />
        </svg>
      </button>
    </pre>
  );
};

export default Pre;
