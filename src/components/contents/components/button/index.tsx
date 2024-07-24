import type {
  SetSelectedStyleFunc,
  ButtonProps,
  ButtonRef,
  ButtonEventTarget
} from '@type/modules/comp-contents-comp-button';

import './index.css';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import Icon from '@components/icon/index';

const Button = forwardRef(function Button(
  {
    title = '',
    tag,
    icon,
    isBranch = false,
    visible = false,
    onClick = () => {}
  }: ButtonProps,
  ref: React.ForwardedRef<ButtonRef>
) {
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
        expand: isSelected.expand ?? false,
        selected: isSelected.selected ?? false
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

  return (
    <button
      ref={buttonRef}
      className={`content-button ${isBranch ? 'bold-button' : ''}`}
      tabIndex={visible ? 0 : -1}
      onClick={(e) => {
        const event: ButtonEventTarget = {
          ...e,
          setSelectedStyle
        };
        event.setSelectedStyle = setSelectedStyle;
        onClick(event);
      }}
    >
      {icon && (
        <>
          <Icon name={icon} className="contents-button-left-icon" />
          <span className="contents-button-left-icon-right-margin" />
        </>
      )}
      <span className="contents-button-main">
        {title}
        {_tag}
      </span>
      {isBranch && <Icon name="right" className="contents-button-right-icon" />}
    </button>
  );
});

export default Button;
