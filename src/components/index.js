import './index.css';
import { useState } from 'react';
import contents from './contents.js';
import Contents from './contents/index.js';
import Transition from './transition/index.js';

export default function Components () {
  // 当前展示的组件
  const [mainNode, setMainNode] = useState(null);

  /**
   * 组件切换事件处理
   * @param {object} context
   * @param {object} context.content 当前点击的项目的菜单项
   * @param {object} context.component 当前展示的组件
   */
  function changeHandler (context) {
    setMainNode(context.component);
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