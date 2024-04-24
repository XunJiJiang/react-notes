import './index.css';
import { useRef } from 'react';
import Icon from '@/components/icon';

function Pre ({ node, inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(children.props.className ?? '');
  const preRef = useRef(null);
  return (
    <pre
      ref={(node) => {
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
          try {
            const text = preRef.current.innerText.replace('1', '').replace(/\n(\d+)/g, '');

            navigator.clipboard.writeText(text).then(() => {
              // console.log('copy success');
            }).catch(() => {
              console.warn('copy fail');
            });
          } catch {
            throw new Error('markdown copy 未知错误');
          }
        }}
      >
        <Icon name='file-copy' className='markdown-pre-copy-icon'/>
      </i>
    </pre>
  )
}

export default Pre;
