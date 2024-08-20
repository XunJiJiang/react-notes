import type {
  ChangeEventMapReturnContentType,
  ChangeEventMapReturnType
} from '@type/modules/comp-contents.d.ts';

import './index.css';
import { useRef } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router-dom';
// import Transition from './transition/index.tsx';
import contents from '../contents/index.tsx';
import Contents from './contents/index.tsx';

const Components = () => {
  // 当前展示的组件
  // const [mainNode, setMainNode] = useState<null | React.JSX.Element>(null);

  // 上一次点击的菜单上下文
  const lastContext = useRef<null | ChangeEventMapReturnContentType>(null);

  const contentsWidth = useRef(0);

  const navigation = useNavigation();

  const location = useLocation();

  const bodyRef = useRef<HTMLDivElement | null>(null);

  /**
   * 组件切换事件处理
   * @param {ContentsChangeHandlerType} context
   * @param {Content} context.content 当前点击的项目的菜单项
   * @param {React.JSX.Element} context.component 当前展示的组件
   */
  const changeHandler = (context: ChangeEventMapReturnType) => {
    if (context.content === lastContext.current) return;
    // setMainNode(context.component);
    lastContext.current = context.content;
  };

  return (
    <div
      ref={(node) => {
        if (!node) return;
        bodyRef.current = node;
        node.style.setProperty('--contentWidth', contentsWidth.current + 'px');
      }}
      className="body"
    >
      <div className="contents-box">
        <Contents
          title="React 笔记"
          contents={contents}
          onChange={changeHandler}
          path={location.pathname}
          onWidthLoad={(width) => {
            const widthNum = parseInt(width);
            contentsWidth.current = widthNum;
          }}
        />
      </div>
      {/* <Transition mode="out-in"> */}
      <div
        className={`main ${navigation.state === 'loading' ? 'main-loading' : ''}`}
        id="main-page"
        ref={(node) => {
          node?.style.setProperty(
            '--leaveWidthBlank',
            contentsWidth.current + 'px'
          );
          return node;
        }}
      >
        <Outlet />
      </div>
      {/* </Transition> */}
    </div>
  );
};

export default Components;
