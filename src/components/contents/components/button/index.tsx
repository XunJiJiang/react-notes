import type {
  SetSelectedStyleFunc,
  ButtonProps,
  ButtonRef
} from '@type/modules/comp-contents-comp-button';

import './index.css';
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Icon from '@components/icon/index';
// import Tooltip from '@/components/tooltip';

const _Button = (
  {
    title = '',
    tag,
    icon,
    isBranch = false,
    visible = false,
    state = {
      isExpand: false,
      isSelected: false
    }
  }: ButtonProps,
  ref: React.ForwardedRef<ButtonRef>
) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const _tag = (() => {
    if (typeof tag === 'undefined') return null;

    if (tag === null) return null;

    if (typeof tag === 'string') {
      return <i className="contents-button-tag">{tag}</i>;
    }

    if (typeof tag === 'object') {
      if (tag.icon) {
        return (
          <i className="contents-button-tag">
            <Icon name={tag.icon} size={isBranch ? 16 : 14} />
          </i>
        );
      } else {
        return null;
      }
    }

    if (typeof tag === 'function') {
      // tag 此时应该是一个组件, 不过因为是小写开头, 不用jsx语法
      return tag();
    }

    return null;
  })();

  useEffect(() => {
    buttonRef.current?.setAttribute('isExpand', `${state.isExpand}`);
    buttonRef.current?.setAttribute('isSelected', `${state.isSelected}`);
  });

  /**
   * 修改按钮样式
   */
  const setSelectedStyle: SetSelectedStyleFunc = (isSelected = false) => {
    if (typeof isSelected === 'boolean' && buttonRef.current) {
      buttonRef.current.setAttribute('isExpand', `${isSelected}`);
      buttonRef.current.setAttribute('isSelected', `${isSelected}`);
    }

    if (typeof isSelected === 'object' && buttonRef.current) {
      const _isSelected = {
        expand:
          isSelected.expand ??
          buttonRef.current.getAttribute('isExpand') ??
          false,
        selected:
          isSelected.selected ??
          buttonRef.current.getAttribute('isSelected') ??
          false
      };

      buttonRef.current.setAttribute('isExpand', `${_isSelected.expand}`);
      buttonRef.current.setAttribute('isSelected', `${_isSelected.selected}`);
    }
  };

  useImperativeHandle(ref, () => {
    return {
      setSelectedStyle,
      clientHeight: buttonRef.current?.clientHeight ?? null
    };
  });
  // TODO: Tooltip写着玩的
  return (
    <>
      {/* <Tooltip
        title={
          <span
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </span>
        }
        placement="right"
      > */}
      <button
        ref={buttonRef}
        title={title}
        className={`content-button ${isBranch ? 'bold-button' : ''}`}
        tabIndex={visible ? 0 : -1}
      >
        <Icon
          name={
            isBranch
              ? state.isExpand
                ? 'folder-open'
                : 'folder'
              : 'file-markdown'
          }
          className="contents-button-left-icon"
        />
        <span className="contents-button-left-icon-right-margin" />

        <span className="contents-button-main">
          {title}
          {/* <wbr /> */}
          {_tag}
        </span>

        {icon && (
          <>
            <Icon name={icon} className="contents-button-right-icon" />
          </>
        )}
      </button>
      {/* </Tooltip> */}
    </>
  );
};

const Button = forwardRef(_Button);

export default Button;
