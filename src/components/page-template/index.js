import './index.css';
import { useEffect, useRef } from 'react';
import MarkdownComponent from '../markdown';

export default function PageTemplate ({ children, markdown = '> 没有 markdown 文本' }) {
  const ref = useRef(null);
  useEffect(() => {
  }, []);
  return (
    <div className='page-template'>
      <div className='page-template-markdown'>
        <MarkdownComponent
          ref={ref}
          markdown={markdown}
        />
      </div>
      {children && <div className='page-template-render'>
        {children}
      </div>}
    </div>
  )
}