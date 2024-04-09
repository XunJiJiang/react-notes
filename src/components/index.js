import './index.css';
import { useState, useRef } from 'react';
import contents from './contents.js';
import Contents from './contents/index.js';
import Transition from './transition/index.js';

export default function Components () {
  // 当前展示的组件
  const [mainNode, setMainNode] = useState(null);

  // 上一次点击的菜单上下文
  const lastContext = useRef(null);
  
  const mainRef = useRef(null);

  /**
   * 组件切换事件处理
   * @param {object} context
   * @param {object} context.content 当前点击的项目的菜单项
   * @param {object} context.component 当前展示的组件
   */
  function changeHandler (context) {
    if (context.content === lastContext.current || !context.component) return;
    setMainNode(context.component);
    lastContext.current = context.content;
  }

  return (
    <div className='body'>
      <Contents
        title="React"
        contents={contents}
        onChange={changeHandler}
        onWidthLoad={(width) => {
          if (mainRef.current) {
            const _width = parseInt(width);
            width = Math.min(_width, 1024);
            width = Math.max(_width, 256);
            mainRef.current.style.setProperty('--leaveWidthBlank', width + 'px');
          }
        }}
      />
      <Transition mode='out-in'>
        <div
          className='main'
          id='main-page'
          ref={mainRef}
        >{mainNode}</div>
      </Transition>
    </div>
  );
}