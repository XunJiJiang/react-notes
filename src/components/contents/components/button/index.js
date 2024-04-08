import './index.css';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import Icon from '@components/icon/index';

export default forwardRef(function Button ({ title = '', tag, icon, isBranch = false, visible = false, onClick = () => {} }, ref) {
  const buttonRef = useRef(null);
  /**
   * 修改按钮样式
   * @param {boolean | {
   *  expand: boolean,
   *  selected: boolean
   * }} isSelected 
   */
  function setSelected (isSelected = false) {
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
      setSelected,
      clientHeight: buttonRef.current.clientHeight
    }
  });
  return (
    <button
      ref={buttonRef}
      className={`content-button ${isBranch ? 'bold-button' : ''}`}
      tabIndex={visible ? 0 : -1}
      onClick={(e) => {
        e.setSelected = setSelected;
        onClick(e);
      }}
    >
      {icon && <>
        <Icon name={icon} className='button-left-icon' />
        <span className='button-left-icon-right-margin' />
      </>}
      <span className='button-main'>{title}{tag ? <i className='button-tag'>{tag}</i> : null}</span>
      {isBranch && <Icon name='right' className='button-right-icon' />}
    </button>
  );
});