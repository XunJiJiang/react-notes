import './index.css';
import { useState, forwardRef, useImperativeHandle } from 'react';
import Button from '../button';
import NotFound from '../../../../pages/404';

/**
 * 寻找组件
 * 返回最上级存在的第一个的组件
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
    return content.component;
  } else if (Array.isArray(content.children) && content.children.length > 0) {
    return findComponent(content.children[0]);
  } else {
    return NotFound;
  }
}

const Content = forwardRef(({ contents = [], visible = false, onChange }, ref) => {
  const [stateList, setStateList] = useState(new Array(contents.length).fill(false));

  const buttonRefList = [];

  const contentRefList = [];

  useImperativeHandle(ref, () => {
    return {
      inVisible: () => {
        // 将全部的可见状态设置为false
        setStateList(new Array(contents.length).fill(false));
        // 将全部的按钮设置为未选中
        buttonRefList.forEach((button) => {
          button.setSelected(false);
        });
        // 递归调用，将全部的选项的子内容设置为不可见
        contentRefList.forEach((content) => {
          content && content.inVisible();
        });
      }
    }
  });

  return (
    <>
      {
        (Array.isArray(contents)) && contents.map((content, index) => {
          // 是否是有子目录
          const isBranch = Array.isArray(content.children);
          const hasChildren = isBranch && content.children.length > 0;
          // 本项的子项的可见状态
          const childVisible = stateList[index];
          return (
            <div
              className={`content ${visible ? 'visible' : 'invisible'}`}
              key={content.label + index}
            >
              <Button
                ref={(node) => {
                  buttonRefList[index] = node;
                }}
                title={content.label ?? '该子目录不存在'}
                tag={content.tag ?? null}
                icon={isBranch ? 'right' : null}
                onClick={({ setSelected }) => {
                  // 如果当前点击项已被选中且是有子目录的
                  if (childVisible && isBranch) {
                    // 将当前的可见状态设置为false
                    stateList[index] = false;
                    setStateList([...stateList]);
                    setSelected(false);
                    // 将当前的选项的子内容设置为不可见
                    contentRefList[index] && contentRefList[index].inVisible();
                  }
                  // 如果当前点击项未被选中
                  else if (!childVisible) {
                    stateList.forEach((_, i) => {
                      // 将全部的可见状态设置为false
                      stateList[i] = false;
                      // 将全部的按钮设置为未选中
                      buttonRefList[i].setSelected(false);
                      // 将全部的选项的子内容设置为不可见
                      contentRefList[i] && contentRefList[i].inVisible();
                    });
                    // 将当前的可见状态设置为true
                    stateList[index] = true;
                    setStateList([...stateList]);
                    // 将当前的按钮设置为选中
                    setSelected(true);
                    // 获取当前的组件
                    const Components = findComponent(content);
                    onChange({
                      content,
                      component: <Components />
                    })
                  }
                }}
              />
              {
                hasChildren &&
                <Content
                  ref={(node) => {
                    contentRefList[index] = node;
                  }}
                  contents={content.children}
                  visible={childVisible}
                  onChange={onChange}
                />
              }
            </div>
          )
        })
      }
    </>
  );
});

export default Content;