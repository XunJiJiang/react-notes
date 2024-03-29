import './index.css';
import { useEffect, useRef, useState } from 'react';
import MarkdownComponent from '../markdown';
import Contents from './components/contents';

export default function PageTemplate ({ children, markdown = '> 没有 markdown 文本' }) {
  const markdownRef = useRef(null);

  const [markdownContents, setMarkdownContents] = useState([]);

  useEffect(() => {
    // console.log(ref.current)
  }, []);
  return (
    <div className='page-template'>
      <div className='page-template-markdown'>
        <MarkdownComponent
          ref={(node) => {
            if (node && node.contents && markdownContents.length === 0) {
              setMarkdownContents(node.contents);
            }
            return markdownRef;
          }}
          markdown={markdown}
        />
      </div>
      <div className='page-template-contents'>
        <Contents contents={markdownContents} />
      </div>
      {children && <div className='page-template-render'>
        {children}
      </div>}
    </div>
  )
}