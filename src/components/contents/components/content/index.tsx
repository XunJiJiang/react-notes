import type {
  ContentTypeExtendForChange,
  FindComponentFunc,
  ContentProps,
  ContentRef,
} from '@type/modules/comp-contents-comp-content.d.ts';
import type { ButtonRef } from '@type/modules/comp-contents-comp-button.d.ts';

import './index.css';
import { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import PathList from '../../context/pathList';
import Button from '../button/index.tsx';
import NotFound from '@pages/404/index.tsx';

/**
 * 寻找组件
 * 返回最上级存在的最近的组件
 */
const findComponent: FindComponentFunc = content => {
  if (content.component) {
    return [content.component, content];
  } else if (Array.isArray(content.children) && content.children.length > 0) {
    return findComponent(content.children[0]);
  } else {
    return [
      NotFound,
      {
        ...content,
        _mark_: {
          code: '404',
          msg: '没有找到可用的组件',
        },
      },
    ];
  }
};

const Content = forwardRef(
  (
    { contents = [], visible = false, layer, onChange, changeFatherDeepList = () => {} }: ContentProps,
    ref: React.ForwardedRef<ContentRef>
  ) => {
    //  储存当前组件和每个子选项组件的路径信息. 下标高位为父组件的路径, 低位为子组件的路径.
    const pathList = useContext(PathList);

    /**
     * 存储每个选项的可见状态
     * 有子项的选项的可见状态表示子项的内容是否可见(不表示是否选中)
     * 没有子项的选项的可见状态表示选项是否被选中
     */
    const [visibleList, setVisibleList] = useState(new Array(contents.length).fill(false));

    // 记录上次展开(选中)的选项的索引, -1表示没有选中的选项
    const [lastIndex, setLastIndex] = useState(-1);

    // 存储每个选项的按钮的引用
    const buttonRefList: ButtonRef[] = [];

    // 存储每个选项的内容的引用
    const contentRefList: ContentRef[] = [];

    // 储存当前组件和每个子选项组件的深度展开的高度信息. 下标高位为父级的深度, 低位为子级的深度.
    const [deepHeightList, setDeepHeightList] = useState<number[]>(new Array(layer).fill(0));

    useImperativeHandle(ref, () => {
      return {
        inVisible: () => {
          // 将全部的可见状态设置为false
          setVisibleList(new Array(contents.length).fill(false));
          if (lastIndex !== -1) {
            // 将上次为选中状态的按钮设置为未选中
            buttonRefList[lastIndex].setSelectedStyle(false);
            // 递归调用, 将上次为选中状态的选项子内容设置为不可见
            contentRefList[lastIndex] && contentRefList[lastIndex].inVisible();
            setLastIndex(-1);
          }
        },
        // 当前组件全部直接子按钮的高度和
        buttonHeight: buttonRefList.reduce((accumulator, currentValue) => {
          return accumulator + (currentValue.clientHeight ?? 0);
        }, 0),
      };
    });

    /**
     * 给子菜单提供的函数修改父菜单组件的高度信息(deepHeightList)中子菜单的高度信息
     * @param {Array<number>} childList
     */
    function _changeFatherDeepList(childList: number[]) {
      childList.forEach((child, index) => {
        deepHeightList[index] = child;
      });
      setDeepHeightList([...deepHeightList]);
      // setLastIndex(-1);
      changeFatherDeepList([...deepHeightList]);
      buttonRefList[lastIndex] &&
        buttonRefList[lastIndex].setSelectedStyle &&
        buttonRefList[lastIndex].setSelectedStyle({
          expand: true,
          selected: false,
        });
    }

    return (
      <>
        {Array.isArray(contents) &&
          contents.map((content, index) => {
            // 是否是有子目录
            const isBranch = Array.isArray(content.children);
            const hasChildren = isBranch && content.children!.length > 0;
            // 有子项本项的子项的可见状态(不表示是否选中)
            // 没有子项则表示本项的是否选中
            const childVisible = visibleList[index];
            return (
              <li className={`content`} key={content.label + index}>
                <Button
                  ref={node => {
                    if (node) buttonRefList[index] = node;
                  }}
                  title={content.label ?? '该子目录不存在'}
                  tag={content.tag ?? null}
                  icon={content.icon ?? null}
                  isBranch={isBranch}
                  visible={visible}
                  onClick={({ setSelectedStyle }) => {
                    if (!pathList) {
                      throw new Error('The value of PathList.Provider must be set.');
                    }
                    // 点击项 已被选中, 无子目录的
                    // 目的行为: 不做任何操作
                    if (childVisible && !isBranch) {
                      return;
                    }
                    // 已展开(上次展开项与点击项相同), 有子目录
                    // 目的行为: 收回子目录
                    if (childVisible && isBranch) {
                      // 设置当前项 展开状态->false
                      visibleList[index] = false;
                      // 设置当前项 按钮样式->未展开, 已选中
                      setSelectedStyle({
                        expand: false,
                        selected: true,
                      });
                      // 设置当前的选项 子内容->不可见
                      contentRefList[index] && contentRefList[index].inVisible();
                      // 点击项子选项数量不为0
                      if (contentRefList[index]) {
                        // 修改当前深度的高度信息
                        deepHeightList.forEach((_, i) => (deepHeightList[i] = 0));
                      }
                      if (layer !== 0) {
                        // 设置低于当前层级的路径信息->置空
                        pathList.current.forEach((_, i) => (i < layer ? (pathList.current[i] = null) : null));
                      }
                    }
                    // 点击项 未被选中(有子目录且未展开)
                    if (!childVisible) {
                      if (lastIndex !== -1) {
                        // 设置上次选中的选项 可见状态->false
                        visibleList[lastIndex] = false;
                        // 设置上次选中的选项 按钮样式->未选中(能则未展开)
                        buttonRefList[lastIndex].setSelectedStyle(false);
                        // 设置上次选中的选项 子内容->不可见
                        contentRefList[lastIndex] && contentRefList[lastIndex].inVisible();
                      }
                      contentRefList.forEach(item => item && item.inVisible());
                      setLastIndex(index);
                      // 设置点击项 可见状态->true
                      visibleList[index] = true;
                      // 设置点击项 按钮样式->选中(能则展开)
                      setSelectedStyle(true);
                      // 点击项所处深度及其更深层的深度信息置零
                      deepHeightList.forEach((_, i) => (deepHeightList[i] = 0));
                      // 点击项有子选项
                      if (contentRefList[index]) {
                        // 当前层级的深度信息->当前组件的展开高度
                        deepHeightList[layer - 1] = contentRefList[index].buttonHeight;
                      }
                      // 为任意层, 当前组件没有子选项
                      else if (!contentRefList[index]) {
                      }
                      // 设置低于当前层级的路径信息->置空
                      pathList.current.forEach((_, i) => (i <= layer ? (pathList.current[i] = null) : null));
                      // 设置当前层级的路径信息->当前组件的路径
                      pathList.current[layer] = content.path;
                    }
                    // 将当前的高度信息传递给父组件
                    changeFatherDeepList([...deepHeightList]);
                    setDeepHeightList([...deepHeightList]);
                    setVisibleList([...visibleList]);
                    // 获取当前选中项对应的page组件
                    const [Components, _content] = findComponent(content);
                    onChange({
                      content: _content,
                      path: pathList.current,
                      component: <Components />,
                    });
                  }}
                />
                {isBranch && (
                  <ul
                    className="content-children"
                    style={{
                      height:
                        (childVisible
                          ? deepHeightList.reduce((previousValue, currentValue) => {
                              return previousValue + currentValue;
                            }, 0)
                          : 0) + 'px',
                    }}
                  >
                    {hasChildren ? (
                      <Content
                        ref={node => {
                          if (node) contentRefList[index] = node;
                        }}
                        contents={content.children as ContentTypeExtendForChange[]}
                        visible={childVisible}
                        layer={layer - 1}
                        onChange={onChange}
                        changeFatherDeepList={_changeFatherDeepList}
                      />
                    ) : (
                      <Content
                        ref={node => {
                          if (node) contentRefList[index] = node;
                        }}
                        contents={[
                          {
                            label: '子目录为空',
                            path: '/pageNotFound',
                            component: () => <NotFound info="当前目录菜单节点的子目录为空" />,
                            _mark_: {
                              code: '404',
                              msg: '当前目录菜单节点的子目录为空',
                              createNewContent: () => ({
                                label: '子目录为空',
                                path: '/pageNotFound',
                                component: null,
                              }),
                            },
                          },
                        ]}
                        visible={childVisible}
                        layer={layer - 1}
                        onChange={onChange}
                        changeFatherDeepList={_changeFatherDeepList}
                      />
                    )}
                  </ul>
                )}
              </li>
            );
          })}
      </>
    );
  }
);
export default Content;
