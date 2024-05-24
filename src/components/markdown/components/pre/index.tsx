import type { PreProps } from '@type/modules/comp-markdown-comp-pre.d.ts';

import './index.css';
import { useRef } from 'react';
import Icon from '@components/icon/index.tsx';
import { TimeoutTaskQueue } from '@utils/index.ts';

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
              .replace(/\n(\d+)/g, '\n');

            navigator.clipboard
              .writeText(text)
              .then(() => {
                if (isCopySuccess) return;
                const taskQueue = new TimeoutTaskQueue();
                taskQueue
                  .addTask({
                    callback: () => {
                      isCopySuccess = true;
                      iRef.current?.style.setProperty('--icon-opacity', '0');
                    },
                    timeout: 0,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty('--svg-opacity', '1');
                    },
                    timeout: 100,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty(
                        '--circle-stroke-dashoffset',
                        '0',
                      );
                    },
                    timeout: 300,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty(
                        '--polyline-stroke-dashoffset',
                        '0',
                      );
                    },
                    timeout: 300,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty('--svg-opacity', '0');
                    },
                    timeout: 700,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty('--icon-opacity', '1');
                    },
                    timeout: 300,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty(
                        '--circle-stroke-dashoffset',
                        '38',
                      );
                      iRef.current?.style.setProperty(
                        '--polyline-stroke-dashoffset',
                        '11',
                      );
                      iRef.current?.style.setProperty(
                        '--svg-transition',
                        'all 0s',
                      );
                    },
                    timeout: 600,
                  })
                  .addTask({
                    callback: () => {
                      iRef.current?.style.setProperty(
                        '--svg-transition',
                        'all 0.6s',
                      );
                    },
                    timeout: 0,
                  })
                  .finally(() => {
                    isCopySuccess = false;
                  })
                  .run();
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
      </i>
    </pre>
  );
}

export default Pre;
