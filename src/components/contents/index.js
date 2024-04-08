import './index.css';
import { useRef } from 'react';
import PathList from './context/pathList';
import Content from './components/content';

/**
 * 获取目录的最深层级
 * @param {{
 *   component: any | null | undefined,
 *   children: contents | undefined,
 *   label: string,
 *   tag: string | undefined
 * }[]} contents
 * @returns 
 */
function getDeepestLayer (contents) {
  let layer = 1;
  const childLayers = [];
  contents.forEach((content) => {
    if (Array.isArray(content.children)) {
      childLayers.push(getDeepestLayer(content.children));
    } else {
      return layer;
    }
  });
  if (childLayers.length > 0) {
    layer = Math.max(...childLayers) + layer;
  }
  return layer;
}

export default function Contents ({ title = '目录', contents = [], onChange = () => {}, onWidthLoad = () => {} }) {

  const pathList = useRef(new Array(getDeepestLayer(contents)).fill(null));

  /** 目录的宽度 */
  const width = ((() => {
    // 每深一层,增加28px
    return 150 + 44 + 28 * getDeepestLayer(contents) - 1 + 'px';
  })());

  onWidthLoad(width);

  function _changeHandler (e) {
    const _e = {
      ...e,
      path: e.path.reduce((p, c) => c ? c + p : p, '')
    }
    onChange(_e);
  }

  return (
    <div
      className='contents'
      style={{
        width
      }}
    >
      <h1>{title}</h1>
      <nav>
        <ul>
          <PathList.Provider value={pathList}>
            <Content
              contents={contents}
              visible={true}
              layer={getDeepestLayer(contents) - 1}
              onChange={_changeHandler}
            />
          </PathList.Provider>
        </ul>
      </nav>
    </div>
  );
}