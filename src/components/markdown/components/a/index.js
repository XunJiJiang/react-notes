import './index.css';
import { useRef, useEffect } from 'react';
import Icon from '@components/icon';
import { getStringWidth } from '@utils/index.js';

export default function APopover ({ node, inline, className, children, ...props }) {
  const aRef = useRef(null);
  const popoverRef = useRef(null);
  const timeout = useRef(null);

  useEffect(() => {
    // 获取其距离父元素左侧的距离
    const aParentNodeLeft = aRef.current.parentNode.offsetLeft;
    const aParentNodeWidth = aRef.current.parentNode.offsetWidth;
    const aLift = aRef.current.offsetLeft - aParentNodeLeft;
    const aWidth = getStringWidth(aRef.current.innerText, { fontSize: 16 });
    const popoverWidth = getStringWidth(popoverRef.current.innerText, { fontSize: 16 }) + 20;
    if (popoverWidth > aParentNodeWidth) {
      // 以下分支的前提是popover的中心在a元素的中心
      // popover的宽度大于父元素的宽度, 设置popover的宽度为父元素的宽度
      popoverRef.current.style.width = aParentNodeWidth - 20 + 'px';
    } else if (aLift + aWidth / 2 + popoverWidth / 2 > aParentNodeWidth) {
      //  popover右侧超出父元素右侧, 设置popover右侧与父元素右侧对齐
      popoverRef.current.style.left = - (aLift + popoverWidth - aParentNodeWidth) + 'px';
      console.log(aLift, popoverWidth, aParentNodeWidth)
    } else if (aLift > (popoverWidth - aWidth) / 2) {
      // popover两侧均未超出父元素, 设置popover中心与a元素中心对齐
      popoverRef.current.style.left =  aWidth / 2 - popoverWidth / 2 + 'px';
    } else {
      // popover左侧超出父元素左侧, 设置popover左侧与父元素左侧对齐
      popoverRef.current.style.left = 'auto';
    }
  }, []);

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