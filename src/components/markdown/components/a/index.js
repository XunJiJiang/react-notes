import './index.css';
import { useRef } from 'react';
import Icon from '@components/icon';

export default function APopover ({ node, inline, className, children, ...props }) {
  const aRef = useRef(null);
  const popoverRef = useRef(null);
  const timeout = useRef(null);
  return (
    <a
      ref={aRef}
      className={`${className} a-link`}
      {...props}
      onMouseEnter={() => {
        clearTimeout(timeout.current);
        popoverRef.current.style.display = 'block';
        const _ = popoverRef.current.offsetHeight;
        Promise.resolve(_).then(() => {
          popoverRef.current.classList.add('a-popover-show');
        });
      }}
      onMouseLeave={() => {
        popoverRef.current.classList.remove('a-popover-show');
        timeout.current = setTimeout(() => {
          popoverRef.current.style.display = 'none';
        }, 300);
      }}
    >
      {children}
      <Icon name='link' className='a-popover-icon' />
      <span
        ref={popoverRef}
        className='a-popover'
      >{props.href}</span>
    </a>
  )
}