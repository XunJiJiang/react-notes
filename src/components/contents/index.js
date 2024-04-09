import './index.css';
import { useRef } from 'react';
import { getStringWidth } from '@utils/index.js';
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
 * @returns {number}
 */
function getDeepestLayer (contents) {
  let layer = 1;
  const childLayers = [];
  if (Array.isArray(contents)) {
    contents.forEach((content) => {
      if (Array.isArray(content.children)) {
        childLayers.push(getDeepestLayer(content.children));
      } else {
        return layer;
      }
    });
  } else {
    if (Array.isArray(contents.children)) {
      childLayers.push(getDeepestLayer(contents.children));
    }
  }
  if (childLayers.length > 0) {
    layer = Math.max(...childLayers) + layer;
  }
  return layer;
}

/**
 * 计算目录的宽度
 * @param {{
 *   component: any | null | undefined,
 *   children: contents | undefined,
 *   label: string,
 *   tag: string | undefined
 * }[]} contents
 * @param {React.MutableRefObject<number>} widthCache 宽度缓存器
 * @returns {number}
 */
function getContentsWidthCache (contents, widthCache) {
  if (widthCache.current !== null) return widthCache.current;
  const maxDeepestLayer = getDeepestLayer(contents);
  let maxStringWidth = 0;
  function _getContentWidth (content) {
    const _deepestLayer = getDeepestLayer(content);
    const _stringWidth = getStringWidth(content.label, {
      fontSize: 14,
      fontFamily: `Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑,
      Arial, sans-serif`
    })
      + 16 // + 右侧箭头的宽度
      + 26 // + 按钮左右侧padding
      + (content.icon ? 30 : 0) // + 图标宽度
      + 8; // + 预留冗余
    if (_stringWidth > maxStringWidth) {
      maxStringWidth = _stringWidth + 5 * (maxDeepestLayer - _deepestLayer);
    }
    if (Array.isArray(content.children)) {
      content.children.forEach(_getContentWidth);
    }
  }
  contents.forEach(_getContentWidth);
  widthCache.current = maxStringWidth + 'px';
  return widthCache.current;
}

const changeEventMap = {
  200: (e) => {
    return {
      ...e,
      path: e.path.reduce((p, c) => c ? c + p : p, '')
    }
  },
  404: (e) => {
    if (e.content._mark_.createNewContent) {
      return {
        ...e,
        content: e.content._mark_.createNewContent(),
        path: '/pageNotFound'
      };
    } else {
      return {
        ...e,
        path: '/pageNotFound'
      };
    }
  }
};

export default function Contents ({ title = '目录', contents = [], onChange = () => {}, onWidthLoad = () => {} }) {

  const pathList = useRef(new Array(getDeepestLayer(contents)).fill(null));

  const widthCache = useRef(null);

  /** 目录的宽度 */
  const width = getContentsWidthCache(contents, widthCache);
    
    ((() => {
    // 每深一层, 增加28px
    return 150 + 44 + 28 * getDeepestLayer(contents) - 1 + 'px';
  })());

  onWidthLoad(width);

  function _changeHandler (e) {
    onChange(e.content._mark_ ? changeEventMap[e.content._mark_.code](e) : changeEventMap['200'](e));
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