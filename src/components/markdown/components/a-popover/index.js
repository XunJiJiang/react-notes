import './index.css';
import { useRef } from 'react';

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
        setTimeout(() => {
          popoverRef.current.style.opacity = 1;
        }, 300);
      }}
      onMouseLeave={() => {
        popoverRef.current.style.opacity = 0;
        timeout.current = setTimeout(() => {
          popoverRef.current.style.display = 'none';
        }, 300);
      }}
    >
      {children}
      <div
        ref={popoverRef}
        className='a-popover'
      >{props.href}</div>
    </a>
  )
}