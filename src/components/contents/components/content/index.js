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
  } else if (Array.isArray(content.children)) {
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
        setStateList(new Array(contents.length).fill(false));
        buttonRefList.forEach((button) => {
          button.setSelected(false);
        });
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
          const isBranch = Array.isArray(content.children);
          const childVisible = stateList[index];
          return (
            <div className={`content ${visible ? 'visible' : 'invisible'}`} key={content.label + index}>
              <Button
                ref={(node) => {
                  buttonRefList[index] = node;
                }}
                title={content.label ?? '该子目录不存在'}
                tag={content.tag ?? null}
                icon={content.children && Array.isArray(content.children) ? 'right' : null}
                onClick={({ setSelected }) => {
                  if (childVisible) {
                    stateList[index] = false;
                    isBranch && setStateList([...stateList]);
                    setSelected(false);
                    buttonRefList[index].setSelected(false);
                    contentRefList[index] && contentRefList[index].inVisible();
                  } else {
                    stateList.forEach((_, i) => {
                      stateList[i] = false;
                      buttonRefList[i].setSelected(false);
                      contentRefList[i] && contentRefList[i].inVisible();
                    });
                    stateList[index] = true;
                    setStateList([...stateList]);
                    setSelected(true);
                    const Components = findComponent(content);
                    onChange({
                      content,
                      component: <Components />
                    })
                  }
                }}
              />
              {
                Array.isArray(content.children) &&
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