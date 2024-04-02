import './index.css';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

function ContentsINPage ({ contents }, ref) {

  const ulRef = useRef(null);

  const liList = useRef([]);

  function changeLocation (content) {
    const liNode = document.getElementById(`contents-in-page-${content.id}`);
    const liNodes = ulRef.current.childNodes;
    for (let i = 0; i < liNodes.length; i++) {
      const li = liNodes[i];
      li.setAttribute('data-active', false);
    }
    liNode.setAttribute('data-active', true);
  }

  useEffect(() => {
    // changeLocation(contents[0])
    // console.log(contents[0]);
  });

  useImperativeHandle(ref, () => ({
    changeLocation
  }));

  return (
    <nav className='contents-in-page'>
      <span className='contents-in-page-title'>目录</span>
      <ul ref={ulRef}>
        {
          contents.filter((content) => {
            return content.level !== 1;
          }).map((content, index) => {
            return (
              <li
                id={`contents-in-page-${content.id}`}
                className='contents-in-page-item-box'
                ref={() => {
                  liList.current.push(index);
                }}
                key={index}
                onClick={() => {
                  const id = content.id;
                  console.log(content);
                  const node = content.node;
                  if (id && node) {
                    node.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    console.warn('目录项对应的节点不存在');
                  }
                }}
              >
                <a
                  href={`#${content.id}`}
                  className={`contents-in-page-item contents-in-page-item-${content.level}`}
                >
                  {content.label}
                </a>
              </li>
            )
          })
        }
      </ul>
    </nav>
  );
}

export default  forwardRef(ContentsINPage);