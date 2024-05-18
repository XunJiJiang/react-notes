import type {
  ChangeLocationFunc,
  ContentsINPageProps,
  ContentsINPageRef,
} from '@type/modules/comp-page-template-comp-contents.d.ts';

import './index.css';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

function createHref(label) {
  if (typeof label === 'string') {
    return label;
  }

  if (typeof label === 'object') {
    if (Array.isArray(label)) {
      return label.reduce((prev, current) => {
        return prev + createHref(current);
      }, '');
    } else {
      return label.props.children;
    }
  }

  throw new Error('createHref 发生未知错误');
}
function ContentsINPage({ contents }: ContentsINPageProps, ref: ContentsINPageRef) {
  const ulRef = useRef(null);

  const liList = useRef([]);

  const lastFocusLi = useRef(null);

  const changeLocation: ChangeLocationFunc = content => {
    const liNode = document.getElementById(`contents-in-page-${content.id}`) ?? content.node;
    lastFocusLi.current && lastFocusLi.current.setAttribute('data-active', false);
    liNode.setAttribute('data-active', true);
    lastFocusLi.current = liNode;
  };

  useEffect(() => {
    const viewHeight = window.innerHeight;
    if (liList.current[0] && contents[0].offsetTop <= viewHeight / 2) {
      liList.current[0].setAttribute('data-active', true);
    }
  });

  useImperativeHandle(ref, () => ({
    changeLocation,
  }));

  return (
    <nav className="contents-in-page">
      <span className="contents-in-page-title">目录</span>
      <ul ref={ulRef}>
        {contents
          .filter(content => {
            return content.level !== 1;
          })
          .map((content, index) => {
            return (
              <li
                id={`contents-in-page-${content.id}`}
                className="contents-in-page-item-box"
                ref={node => {
                  liList.current.push(node);
                }}
                key={index}
                onClick={() => {
                  const id = content.id;
                  const node = content.node;
                  if (id && node) {
                    node.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    console.warn('目录项对应的节点不存在');
                  }
                }}
              >
                <a
                  href={`#${createHref(content.label)}`}
                  className={`contents-in-page-item contents-in-page-item-${content.level}`}
                >
                  {content.label}
                </a>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export default forwardRef(ContentsINPage);
