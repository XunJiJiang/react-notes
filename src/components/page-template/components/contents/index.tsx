import type {
  ChangeLocationFunc,
  ContentsINPageProps,
  ContentsINPageRef,
  ContentLabelType
} from '@type/modules/comp-page-template-comp-contents.d.ts';

import './index.css';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useForceReRendering } from '@utils/index.ts';

function createHref(label: ContentLabelType): string {
  if (typeof label === 'string') {
    return label;
  }

  if (typeof label === 'object' && label !== null) {
    if (Array.isArray(label)) {
      return label.reduce((prev: string, current: ContentLabelType) => {
        return prev + createHref(current);
      }, '');
    } else {
      if ('props' in label) return label!.props.children;
    }
  }

  throw new Error('createHref 发生未知错误');
}

const ContentsINPage = forwardRef(function _ContentsINPage(
  { contents }: ContentsINPageProps,
  ref: React.ForwardedRef<ContentsINPageRef>
) {
  const { hash = '' } = useLocation();

  const deHash = decodeURI(hash);

  const forceReRendering = useForceReRendering();

  useEffect(() => {
    const content = contents.find((v) => v.hash === deHash);
    if (!content) return;
    const id = content.id;
    const node = content.node;
    if (id && node) {
      node.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('目录项对应的节点不存在');
    }
  }, [deHash, contents, forceReRendering.value]);

  const ulRef = useRef<HTMLUListElement>(null);

  const liList = useRef<HTMLElement[]>([]);

  const lastFocusLi = useRef<HTMLElement | null>(null);

  const changeLocation: ChangeLocationFunc = (content) => {
    if (!content || content.level === 1) {
      ulRef.current?.classList.add('contents-in-page-hidden');
      ulRef.current?.style.setProperty('--side-indicates', '0');
      lastFocusLi.current &&
        lastFocusLi.current.setAttribute('data-active', `${false}`);
      lastFocusLi.current = null;
      return;
    }

    const index = contents
      .filter((item) => {
        return item.level !== 1;
      })
      .findIndex((item) => {
        return item.label === content.label;
      });
    if (index === -1) {
      ulRef.current?.classList.add('contents-in-page-hidden');
      ulRef.current?.style.setProperty('--side-indicates', '0');
      return;
    }

    ulRef.current?.classList.remove('contents-in-page-hidden');
    ulRef.current?.style.setProperty('--side-indicates', index + '');
    const liNode =
      document.getElementById(`contents-in-page-${content.id}`) ?? content.node;
    lastFocusLi.current &&
      lastFocusLi.current.setAttribute('data-active', `${false}`);
    liNode.setAttribute('data-active', `${true}`);
    lastFocusLi.current = liNode;
  };

  useImperativeHandle(ref, () => ({
    changeLocation
  }));

  return (
    <nav className="contents-in-page">
      <span className="contents-in-page-title">此页内</span>
      <ul ref={ulRef} className={'contents-in-page-hidden'}>
        {contents
          .filter((content) => {
            return content.level !== 1;
          })
          .map((content, index) => {
            return (
              <li
                id={`contents-in-page-${content.id}`}
                className="contents-in-page-item-box"
                ref={(node) => {
                  node && liList.current.push(node);
                }}
                key={index}
              >
                <Link
                  to={`#${createHref(content.label)}`}
                  className={`contents-in-page-item contents-in-page-item-${content.level}`}
                  onClick={forceReRendering}
                >
                  {content.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
});

export default ContentsINPage;
