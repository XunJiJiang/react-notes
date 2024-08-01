import type {
  ContentTypeExtendForChange,
  ContentProps,
  ContentRef
} from '@type/modules/comp-contents-comp-content.d.ts';
import type { ButtonRef } from '@type/modules/comp-contents-comp-button.d.ts';

import './index.css';
import {
  useRef,
  // useContext,
  forwardRef,
  useImperativeHandle
} from 'react';
import { Link } from 'react-router-dom';
// import PathList from '../../context/pathList';
import Button from '../button/index.tsx';
import NotFound from '@pages/404/index.tsx';

const Content = forwardRef(function _Content(
  {
    contents = [],
    fatherPath = '',
    visible = false,
    layer,
    path = [],
    onChange
  }: ContentProps,
  ref: React.ForwardedRef<ContentRef>
) {
  //  储存当前组件和每个子选项组件的路径信息. 下标高位为父组件的路径, 低位为子组件的路径.
  // const pathList = useContext(PathList);

  // 存储每个选项的按钮的引用
  const buttonRefList: ButtonRef[] = [];

  // 存储每个选项的内容的引用
  const contentRefList = useRef<ContentRef[]>([]);

  /** 当前指定的子组件的下标 */
  const visibleIndex = useRef(-1);

  /** 指定的子组件状态 */
  const buttonState = useRef({
    isExpand: false,
    isSelected: false
  });

  // const ulHeightList = useRef<number[]>([]);
  const ulRefList = useRef<HTMLUListElement[]>([]);

  if (path.length > 0) {
    const _path = path[0];
    const _index = contents.findIndex((item) => {
      return item.path === '/' + _path;
    });

    visibleIndex.current = _index;

    if (_index === visibleIndex.current) {
      buttonState.current.isExpand = true;
    }

    if (path.length === 1) {
      if (_path !== '')
        onChange({
          content: contents[_index] ?? {},
          path
        });
      buttonState.current.isSelected = true;
    } else {
      buttonState.current.isSelected = false;
      buttonState.current.isExpand = true;
    }
  } else {
    visibleIndex.current = -1;
    buttonState.current = {
      isExpand: false,
      isSelected: false
    };
  }

  useImperativeHandle(ref, () => {
    return {
      // 当前组件全部直接子按钮的高度和
      buttonHeight: buttonRefList.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.clientHeight ?? 0);
      }, 0)
    };
  });

  return (
    <>
      {Array.isArray(contents) &&
        contents.map((content, index) => {
          // 是否是有子目录
          const isBranch = Array.isArray(content.children);
          const hasChildren = isBranch && content.children!.length > 0;
          // 有子项本项的子项的可见状态(不表示是否选中)
          // 没有子项则表示本项的是否选中
          const childVisible = visibleIndex.current === index;
          const _path = fatherPath + content.path.slice(1);
          return (
            <li className={`content`} key={'' + content.label + index}>
              <Link
                to={_path}
                tabIndex={-1}
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Button
                  ref={(ref) => {
                    if (ref) {
                      buttonRefList[index] = ref;
                    }
                  }}
                  title={content.label ?? '该子目录不存在'}
                  tag={content.tag ?? null}
                  icon={content.icon ?? null}
                  isBranch={isBranch}
                  state={
                    childVisible
                      ? buttonState.current
                      : {
                          isExpand: false,
                          isSelected: false
                        }
                  }
                  visible={visible}
                />
              </Link>
              {isBranch && (
                <ul
                  ref={(node) => {
                    if (!node) return;
                    ulRefList.current[index] = node;
                  }}
                  className="content-children"
                  style={{
                    height: childVisible ? 'auto' : '0'
                  }}
                >
                  {hasChildren ? (
                    <Content
                      ref={(node: ContentRef) => {
                        if (!node) return;
                        contentRefList.current[index] = node;
                      }}
                      contents={
                        content.children as ContentTypeExtendForChange[]
                      }
                      visible={childVisible}
                      layer={layer - 1}
                      fatherPath={_path + '/'}
                      path={path.slice(1)}
                      onChange={onChange}
                    />
                  ) : (
                    <Content
                      ref={(node: ContentRef) => {
                        if (!node) return;
                        contentRefList.current[index] = node;
                      }}
                      contents={[
                        {
                          label: '子目录为空',
                          path: '/pageNotFound',
                          component: () => (
                            <NotFound info="当前目录菜单节点的子目录为空" />
                          ),
                          _mark_: {
                            code: '404',
                            msg: '当前目录菜单节点的子目录为空',
                            createNewContent: () => ({
                              label: '子目录为空',
                              path: '/pageNotFound',
                              component: null
                            })
                          }
                        }
                      ]}
                      visible={childVisible}
                      layer={layer - 1}
                      fatherPath={_path + '/'}
                      path={path.slice(1)}
                      onChange={onChange}
                    />
                  )}
                </ul>
              )}
            </li>
          );
        })}
    </>
  );
});
export default Content;
