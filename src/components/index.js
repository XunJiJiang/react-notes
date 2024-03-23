import './index.css';
import { useState, useRef } from 'react';
import contents from './contents.js';
import Contents from './contents/index.js';
import Transition from './transition/index.js';

export default function Components () {
  // 当前展示的组件
  const [mainNode, setMainNode] = useState(null);

  const lastContext = useRef(null);

  /**
   * 组件切换事件处理
   * @param {object} context
   * @param {object} context.content 当前点击的项目的菜单项
   * @param {object} context.component 当前展示的组件
   */
  function changeHandler (context) {
    if (context.content === lastContext.current) return;
    setMainNode(context.component);
    lastContext.current = context.content;
  }

  return (
    <div className='body'>
      <Contents title="React" contents={contents} onChange={changeHandler} />
      <Transition mode='out-in'>
        <div className='main' id='main-page'>{mainNode}</div>
      </Transition>
    </div>
  );
}