import './index.css';
import { useState, useContext, forwardRef, useImperativeHandle } from 'react';
import PathList from '../../context/pathList';
import Button from '../button';
import NotFound from '@pages/404';

/**
 * 寻找组件
 * 返回最上级存在的最近的组件
 * @param {{
 *   component: any | null | undefined,
 *   children: content[] | undefined,
 *   label: string,
 *   tag: string | undefined
 * }} content 
 * @returns
 */
function findComponent (content) {
  if (content.component) {
    return [content.component, content];
  } else if (Array.isArray(content.children) && content.children.length > 0) {
    return findComponent(content.children[0]);
  } else {
    return [NotFound, {
      ...content,
      _mark_: {
        code: '404',
        msg: '没有找到可用的组件'
      }
    }];
  }
}

const Content = forwardRef(({
  contents = [],
  visible = false,
  layer,
  onChange,
  changeFatherDeepList = () => {}
}, ref) => {

  //  储存当前组件和每个子选项组件的路径信息. 下标高位为父组件的路径, 低位为子组件的路径.
  const pathList = useContext(PathList);

  // 存储每个选项的可见状态
  const [visibleList, setVisibleList] = useState(new Array(contents.length).fill(false));

  // 记录上次选中的选项的索引
  const [lastIndex, setLastIndex] = useState(-1);

  // 存储每个选项的按钮的引用
  const buttonRefList = [];

  // 存储每个选项的内容的引用
  const contentRefList = [];

  // 储存当前组件和每个子选项组件的深度展开的高度信息. 下标高位为父级的深度, 低位为子级的深度.
  const [deepHeightList, setDeepHeightList] = useState(new Array(layer).fill(0));

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
        return accumulator + currentValue.clientHeight;
      }, 0)
    }
  });

  /**
   * 给子菜单提供的函数修改父菜单组件的高度信息(deepHeightList)中子菜单的高度信息
   * @param {Array<number>} childList 
   */
  function _changeFatherDeepList (childList) {
    childList.forEach((child, index) => {
      deepHeightList[index] = child;
    })
    setDeepHeightList([...deepHeightList]);
    changeFatherDeepList([...deepHeightList]);
    buttonRefList[lastIndex].setSelectedStyle({
      expand: true,
      selected: false
    });
  }

  return (
    <>
      {
        (Array.isArray(contents)) && contents.map((content, index) => {
          // 是否是有子目录
          const isBranch = Array.isArray(content.children);
          const hasChildren = isBranch && content.children.length > 0;
          // 本项的子项的可见状态
          const childVisible = visibleList[index];
          return (
            <li
              className={`content`}
              key={content.label + index}
            >
              <Button
                ref={(node) => {
                  buttonRefList[index] = node;
                }}
                title={content.label ?? '该子目录不存在'}
                tag={content.tag ?? null}
                icon={content.icon ?? null}
                isBranch={isBranch}
                visible={visible}
                onClick={({ setSelectedStyle }) => {
                  // 如果当前点击项已被选中且是无子目录的
                  if (childVisible && !isBranch) {
                    return;
                  }
                  // 如果当前点击项已被选中且是有子目录的
                  if (childVisible && isBranch) {
                    // 将当前的可见状态设置为false
                    visibleList[index] = false;
                    setVisibleList([...visibleList]);
                    setSelectedStyle({
                      expand: false,
                      selected: true
                    });
                    // 将当前的选项的子内容设置为不可见
                    contentRefList[index] && contentRefList[index].inVisible();
                    if (layer !== 0 && contentRefList[index]) {
                      // 修改当前深度的高度信息
                      deepHeightList.forEach((_, i) => deepHeightList[i] = 0);
                    }
                    if (layer !== 0) {
                      pathList.current.forEach((_, i) => i < layer ? pathList.current[i] = null : null);
                    }
                  }
                  // 如果当前点击项未被选中
                  if (!childVisible) {
                    if (lastIndex !== -1) {
                      // 将上次选中的选项的可见状态设置为false
                      visibleList[lastIndex] = false;
                      // 将上次选中的选项的按钮设置为未选中
                      buttonRefList[lastIndex].setSelectedStyle(false);
                      // 将上次选中的选项的子内容设置为不可见
                      contentRefList[lastIndex] && contentRefList[lastIndex].inVisible();
                    }
                    setLastIndex(index);
                    // 将当前的可见状态设置为true
                    visibleList[index] = true;
                    setVisibleList([...visibleList]);
                    // 将当前的按钮设置为选中
                    setSelectedStyle(true);
                    // 获取当前的组件
                    // 修改当前深度的高度信息
                    // 当不为最深层, 且当前组件存在子选项
                    if (layer !== 0 && contentRefList[index]) {
                      deepHeightList.forEach((_, i) => deepHeightList[i] = 0);
                      deepHeightList[layer - 1] = contentRefList[index].buttonHeight;
                    }
                    // 当为任意层, 且当前组件不存在子选项
                    else if (!contentRefList[index]) {
                      deepHeightList.forEach((_, i) => deepHeightList[i] = 0);
                    }
                    pathList.current.forEach((_, i) => i <= layer ? pathList.current[i] = null : null);
                    pathList.current[layer] = content.path;
                  }
                  // 将当前的高度信息传递给父组件
                  changeFatherDeepList([...deepHeightList]);
                  setDeepHeightList([...deepHeightList]);
                  // 获取当前选中项对应的page组件
                  const [Components, _content] = findComponent(content);
                  onChange({
                    content: _content,
                    path: pathList.current,
                    component: <Components />
                  })
                }}
              />
              {
                isBranch &&
                <ul
                  className='content-children'
                  style={{
                    height: (childVisible ? deepHeightList.reduce((previousValue, currentValue) => {
                      return previousValue + currentValue;
                    }, 0) : 0) + 'px'
                  }}
                >
                  {
                    hasChildren ? (
                      <Content
                        ref={(node) => {
                          contentRefList[index] = node;
                        }}
                        contents={content.children}
                        visible={childVisible}
                        layer={layer - 1}
                        onChange={onChange}
                        changeFatherDeepList={_changeFatherDeepList}
                      />
                    ) : (
                      <Content
                        ref={(node) => {
                          contentRefList[index] = node;
                        }}
                        contents={[{
                          label: '子目录为空',
                          path: '/pageNotFound',
                          component: () => <NotFound info='当前目录菜单节点的子目录为空' />,
                          _mark_: {
                            code: '404',
                            msg: '当前目录菜单节点的子目录为空',
                            createNewContent: () => ({
                              label: '子目录为空',
                              path: '/pageNotFound',
                              component: null
                            })
                          }
                        }]}
                        visible={childVisible}
                        layer={layer - 1}
                        onChange={onChange}
                        changeFatherDeepList={_changeFatherDeepList}
                      />
                    )
                  }
                </ul>
              }
            </li>
          )
        })
      }
    </>
  );
});

export default Content;