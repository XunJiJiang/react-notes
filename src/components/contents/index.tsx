import type {
  GetDeepestLayerFunc,
  GetContentsWidthCacheFunc,
  _GetContentWidthFunc,
  ChangeEventMapType,
  On_ChangeFunc,
  ContentsProps
} from '@type/modules/comp-contents.d.ts';

import './index.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getStringWidth } from '@utils/index.ts';
import PathList from './context/pathList.ts';
import Content from './components/content/index.tsx';

/**
 * 获取目录的最深层级
 */
const getDeepestLayer: GetDeepestLayerFunc = (contents) => {
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
};

/**
 * 计算目录的宽度
 */
const getContentsWidthCache: GetContentsWidthCacheFunc = (
  contents,
  widthCache
) => {
  if (widthCache.current !== null) return widthCache.current;
  const maxDeepestLayer = getDeepestLayer(contents);
  let maxStringWidth: number = 0;
  const _getContentWidth: _GetContentWidthFunc = (content) => {
    const _deepestLayer = getDeepestLayer(content);
    const _stringWidth =
      getStringWidth(content.label, {
        fontSize: content.children ? 16 : 14,
        fontFamily: `Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑,
      Arial, sans-serif`
      }) +
      10 + // label冗余
      16 + // + 右侧箭头的宽度
      36 + // + 按钮左右侧padding
      (content.icon ? 30 : 0) + // + 图标宽度
      (content.tag
        ? typeof content.tag === 'object' && content.tag.icon
          ? 30
          : getStringWidth(content.tag as string, {
              fontSize: content.children ? 16 : 14,
              fontFamily: `Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 微软雅黑,
      Arial, sans-serif`
            })
        : 0) + // tag 宽度
      10 + // tag冗余
      8 * _deepestLayer + // + 深度缩进
      28; // + 预留冗余
    if (_stringWidth > maxStringWidth) {
      maxStringWidth = _stringWidth + 8 * (maxDeepestLayer - 1);
    }
    if (Array.isArray(content.children)) {
      content.children.forEach(_getContentWidth);
    }
  };
  contents.forEach(_getContentWidth);
  maxStringWidth = Math.min(maxStringWidth, 400);
  maxStringWidth = Math.max(maxStringWidth, 100);
  widthCache.current = `${maxStringWidth}px`;
  return widthCache.current;
};

const changeEventMap: ChangeEventMapType = {
  200: (e) => {
    return {
      ...e,
      path: e.path.reduce((p, c) => (c ? c + p : p), '') || '/'
    };
  },
  404: (e) => {
    if (e.content._mark_?.createNewContent) {
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

const Contents = ({
  contents = [],
  path = '',
  onChange = () => {},
  onWidthLoad = () => {}
}: ContentsProps) => {
  const widthCache = useRef(null);

  /** 目录的宽度 */
  const width = getContentsWidthCache(contents, widthCache);

  // (() => {
  //   // 每深一层, 增加28px
  //   return 150 + 44 + /* 28 * getDeepestLayer(contents) */ - 1 + 'px';
  // })();

  onWidthLoad(width);

  const _changeHandler: On_ChangeFunc = (e) => {
    onChange(
      e.content._mark_
        ? changeEventMap[e.content._mark_.code](e)
        : changeEventMap['200'](e)
    );
  };

  const deepestLayer = getDeepestLayer(contents) - 1;

  const isChildHeightChangeRun = useRef(false);

  const ulIndicatesIndex = useState(-1);

  const onChildHeightChange = useCallback(
    (_: number, index: number) => {
      ulIndicatesIndex[1](index);
      isChildHeightChangeRun.current = true;
    },
    [ulIndicatesIndex]
  );

  useEffect(() => {
    if (!isChildHeightChangeRun.current) {
      ulIndicatesIndex[1](-1);
      isChildHeightChangeRun.current = true;
    } else {
      isChildHeightChangeRun.current = false;
    }
  });

  return (
    <div
      className="contents"
      style={{
        width
      }}
      ref={(node) => {
        node?.style.setProperty('--leaveWidthBlank', width);
        return node;
      }}
    >
      <nav className="contents-body">
        <ul
          className="contents-body"
          ref={(node) => {
            if (node) {
              if (ulIndicatesIndex[0] === -1) {
                node.style.setProperty('--indicates-opacity', '0');
                node.style.setProperty('--indicates', '0');
              } else {
                node.style.setProperty('--indicates-opacity', '1');
                node.style.setProperty('--indicates', ulIndicatesIndex[0] + '');
              }
            }
          }}
        >
          <PathList.Provider value={path.split('/').slice(1)}>
            <Content
              contents={contents}
              visible={true}
              path={path.split('/').slice(1)}
              layer={deepestLayer}
              onChange={_changeHandler}
              onChildHeightChange={onChildHeightChange}
            />
          </PathList.Provider>
        </ul>
      </nav>
    </div>
  );
};

export default Contents;
