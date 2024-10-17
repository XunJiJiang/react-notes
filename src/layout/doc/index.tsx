import type {
  ChangeEventMapReturnContentType,
  ChangeEventMapReturnType
} from '@type/modules/comp-contents.d.ts';

import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { useLoaderDataWithType } from '@utils/index.ts';
import Loading from '@components/loading/index.tsx';

import './index.css';
import { useRef } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router-dom';
// import Transition from './transition/index.tsx';
import contents from '@/contents/index.tsx';
import Contents from '@components/contents/index.tsx';

const Doc = () => {
  const loaderData = useLoaderDataWithType<{
    data: {
      // TODO: 类型不能这么写，不过先凑合一下
      contents: typeof contents;
    };
  }>();

  // 当前展示的组件
  // const [mainNode, setMainNode] = useState<null | React.JSX.Element>(null);

  // 上一次点击的菜单上下文
  const lastContext = useRef<null | ChangeEventMapReturnContentType>(null);

  const contentsWidth = useRef(224);

  const navigation = useNavigation();

  const location = useLocation();

  const bodyRef = useRef<HTMLDivElement | null>(null);

  /**
   * 组件切换事件处理
   * @param {ChangeEventMapReturnType} context
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
        <Suspense fallback={<Loading size={0.7} />}>
          <Await resolve={loaderData.data}>
            {({ contents }) => (
              <Contents
                contents={contents}
                onChange={changeHandler}
                path={'/' + location.pathname.split('/').splice(2).join('/')}
                onWidthLoad={(width) => {
                  const widthNum = parseInt(width);
                  contentsWidth.current = widthNum;
                }}
              />
            )}
          </Await>
        </Suspense>
      </div>
      {/* <Transition mode="out-in"> */}
      <div
        className={`main${navigation.state === 'loading' ? '' /* main-loading */ : ''}`}
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

export default Doc;
