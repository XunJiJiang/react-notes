import './index.css';
import { useRef, forwardRef, useImperativeHandle } from 'react';
import Icon from '../icon';

export default forwardRef(function Button ({ title = '', tag, icon, onClick = () => {} }, ref) {
  const buttonRef = useRef(null);
  function setSelected (isSelected = false) {
    if (isSelected) {
      buttonRef.current.setAttribute('isSelected', 'true');
    } else {
      buttonRef.current.removeAttribute('isSelected');
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
      className='content-button'
      onClick={(e) => {
        e.setSelected = setSelected;
        onClick(e);
      }}
    >
      <span>{title}{tag ? <i className='button-tag'>{tag}</i> : null}</span>
      {icon && <Icon name={icon} />}
    </button>
  );
});