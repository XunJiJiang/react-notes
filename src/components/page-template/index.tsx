import type { PageTemplateProps } from '@type/modules/comp-page-template.d.ts';
import type { ContentsINPageRef } from '@type/modules/comp-page-template-comp-contents.d.ts';
import type {
  ContentsType,
  ContentType,
  MarkdownComponentRef
} from '@type/modules/comp-markdown.d.ts';

import './index.css';
import { useCallback, useRef, useState } from 'react';
import MarkdownComponent from '../markdown/index.tsx';
import Contents from './components/contents/index.tsx';
import Pager from './components/pager/index.tsx';
import { debounce } from '@/utils/index.ts';

const scrollEvent = /* 'onscrollend' in window ? 'scrollend' : */ 'scroll';

const PageTemplate = ({
  children,
  markdown = '> 没有 markdown 文本'
}: PageTemplateProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const markdownRef = useRef<MarkdownComponentRef | null>(null);

  const markdownContentsRef = useRef<ContentsINPageRef | null>(null);

  const [markdownContents, setMarkdownContents] = useState<ContentsType>([]);

  /**
   * 滚动事件处理
   */
  const scrollHandler = useCallback(() => {
    if (
      markdownContentsRef.current &&
      markdownContentsRef.current.changeLocation
    ) {
      const viewHeight = window.innerHeight;
      const inView: ContentsType = [];
      // 从下至上遍历的情况下的第一个位于视图外侧上方的元素
      let firstOutView: ContentType | null = null;
      for (let i = markdownContents.length - 1; i >= 0; i--) {
        if (!scrollRef.current) return;
        const content = markdownContents[i];
        if (
          content.offsetTop <= scrollRef.current.scrollTop + viewHeight / 2 &&
          content.offsetTop >= scrollRef.current.scrollTop
        ) {
          inView.push(content);
        }
        if (content.offsetTop < scrollRef.current.scrollTop) {
          firstOutView = content;
          break;
        }
      }
      if (
        inView[0] &&
        scrollRef.current?.scrollTop &&
        inView[0].offsetTop < scrollRef.current.scrollTop + viewHeight / 2
      ) {
        const lastInView = inView.pop();
        if (lastInView) {
          markdownContentsRef.current.changeLocation(lastInView);
        }
      } else {
        markdownContentsRef.current.changeLocation(
          firstOutView || inView.pop() || null
        );
      }
    }
  }, [markdownContents]);

  const scrollHandlerDebounce = debounce(scrollHandler, 100);

  return (
    <div
      ref={(node) => {
        if (node) {
          node.removeEventListener(scrollEvent, scrollHandlerDebounce);
          node.addEventListener(scrollEvent, scrollHandlerDebounce);
        }
        scrollRef.current = node;
      }}
      className="page-box"
      id="page-box"
    >
      <div className="page">
        <main className="page-markdown">
          <MarkdownComponent
            ref={(node) => {
              if (
                node &&
                node.contents.current &&
                markdownContents.length === 0
              ) {
                setMarkdownContents(node.contents.current);
              }
              return markdownRef;
            }}
            markdown={markdown}
          />
          {children && <div className="page-render">{children}</div>}
        </main>
        <footer className="page-footer">
          <Pager />
        </footer>
        {markdownContents.filter((c) => c.level !== 1).length > 0 && (
          <aside className="page-contents">
            <Contents ref={markdownContentsRef} contents={markdownContents} />
          </aside>
        )}
      </div>
    </div>
  );
};

export default PageTemplate;
