import './index.css';
import { useEffect, useRef } from 'react';
import MarkdownComponent from '../markdown';

export default function PageTemplate ({ children, markdown }) {
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
      <div className='page-template-render'>
        {children}
      </div>
    </div>
  )
}