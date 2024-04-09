import './index.css';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import Icon from '@components/icon/index';

export default forwardRef(function Button ({ title = '', tag, icon, isBranch = false, visible = false, onClick = () => {} }, ref) {

  const buttonRef = useRef(null);

  const _tag = ((() => {
    if (tag === null) return null;

    if (typeof tag === 'string') {
      return <i className='button-tag'>{tag}</i>;
    }

    if (typeof tag === 'object') {
      if (tag.icon) {
        return (
          <i className='button-tag'>
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
  })());

  /**
   * 修改按钮样式
   * @param {boolean | {
   *  expand: boolean,
   *  selected: boolean
   * }} isSelected 
   */
  function setSelectedStyle (isSelected = false) {
    if (typeof isSelected === 'boolean') {
      buttonRef.current.setAttribute('isExpand', isSelected);
      buttonRef.current.setAttribute('isSelected', isSelected);
    }

    if (typeof isSelected === 'object') {
      isSelected = {
        expand: isSelected.expand ?? false,
        selected: isSelected.selected ?? false
      };

      buttonRef.current.setAttribute('isExpand', isSelected.expand);
      buttonRef.current.setAttribute('isSelected', isSelected.selected);
    }
  }

  useImperativeHandle(ref, () => {
    return {
      setSelectedStyle,
      clientHeight: buttonRef.current.clientHeight
    }
  });

  return (
    <button
      ref={buttonRef}
      className={`content-button ${isBranch ? 'bold-button' : ''}`}
      tabIndex={visible ? 0 : -1}
      onClick={(e) => {
        e.setSelectedStyle = setSelectedStyle;
        onClick(e);
      }}
    >
      {icon && <>
        <Icon name={icon} className='button-left-icon' />
        <span className='button-left-icon-right-margin' />
      </>}
      <span className='button-main'>
        {title}
        {_tag}
      </span>
      {isBranch && <Icon name='right' className='button-right-icon' />}
    </button>
  );
});