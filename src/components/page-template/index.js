import './index.css';
import { useRef, useState } from 'react';
import MarkdownComponent from '../markdown';
import Contents from './components/contents';

let a = 1;

const scrollEvent = 'scroll';

export default function PageTemplate ({ children, markdown = '> 没有 markdown 文本' }) {

  const scrollRef = useRef(null);

  const markdownRef = useRef(null);

  const markdownContentsRef = useRef([]);

  const [markdownContents, setMarkdownContents] = useState([]);

  /**
   * 滚动事件处理
   */
  function scrollHandler () {
    if (markdownContentsRef.current && markdownContentsRef.current.changeLocation) {
      // 视口高度
      const viewHeight = window.innerHeight;
      const inView = [];
      for (let i = markdownContents.length - 1; i >= 0; i--) {
        const content = markdownContents[i]; 
        if (content.offsetTop <= scrollRef.current.scrollTop + viewHeight / 2 && 
          content.offsetTop >= scrollRef.current.scrollTop - 50) {
          inView.push(content);
        }
        if (content.offsetTop < scrollRef.current.scrollTop - 50) {
          if (inView.length === 0) {
            markdownContentsRef.current.changeLocation(content);
          } else {
            markdownContentsRef.current.changeLocation(inView.pop());
          }
          break;
        }
      }
    }
  }

  return (
    <div
      ref={(node) => {
        if (node) {
          node.removeEventListener(scrollEvent, scrollHandler);
          node.addEventListener(scrollEvent, scrollHandler);
        }
        scrollRef.current = node;
      }}
      className='page-template-box'
      id='page-template-box'
    >
      <div className='page-template'>
        <div className='page-template-markdown'>
          <MarkdownComponent
            ref={(node) => {
              console.log('渲染次数', a++);
              if (node && node.contents && markdownContents.length === 0) {
                setMarkdownContents(node.contents);
              }
              return markdownRef;
            }}
            markdown={markdown}
          />
        </div>
        {markdownContents.filter((c) => c.level !== 1).length > 0 && <div className='page-template-contents'>
          <Contents
            ref={markdownContentsRef}
            contents={markdownContents}
          />
        </div>}
        {children && <div className='page-template-render'>
          {children}
        </div>}
      </div>
    </div>
  )
}