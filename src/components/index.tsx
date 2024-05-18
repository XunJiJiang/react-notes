import type { ChangeEventMapReturnContentType, ChangeEventMapReturnType } from '@type/modules/comp-contents.d.ts';

import './index.css';
import { useState, useRef } from 'react';
import contents from '../contents/index.tsx';
import Contents from './contents/index.tsx';
import Transition from './transition/index.tsx';

export default function Components() {
  // 当前展示的组件
  const [mainNode, setMainNode] = useState<null | React.JSX.Element>(null);

  // 上一次点击的菜单上下文
  const lastContext = useRef<null | ChangeEventMapReturnContentType>(null);

  // 展示组件的ref
  const mainRef = useRef<null | HTMLDivElement>(null);

  /**
   * 组件切换事件处理
   * @param {ContentsChangeHandlerType} context
   * @param {Content} context.content 当前点击的项目的菜单项
   * @param {React.JSX.Element} context.component 当前展示的组件
   */
  function changeHandler(context: ChangeEventMapReturnType) {
    if (context.content === lastContext.current || !context.component) return;
    setMainNode(context.component);
    lastContext.current = context.content;
  }

  return (
    <div className="body">
      <Contents
        title="React"
        contents={contents}
        onChange={changeHandler}
        onWidthLoad={width => {
          if (mainRef.current) {
            const widthNum = parseInt(width);
            let _width = Math.min(widthNum, 1024);
            _width = Math.max(widthNum, 256);
            mainRef.current.style.setProperty('--leaveWidthBlank', _width + 'px');
          }
        }}
      />
      <Transition mode="out-in">
        <div className="main" id="main-page" ref={mainRef}>
          {mainNode}
        </div>
      </Transition>
    </div>
  );
}
