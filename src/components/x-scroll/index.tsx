// 用于宽度超出屏幕的组件, 使鼠标滚轮默认为横向滚动
import type { XScrollProps } from '@/types/modules/comp-x-scroll.d.ts';

import './index.css';
import { useEffect, useRef } from 'react';

const XScroll = ({ children /*, scrollStyle */ }: XScrollProps) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    let left = 0;
    const handleWheel = (e: WheelEvent) => {
      if (!spanRef.current) return;
      e.preventDefault();
      const _left =
        left + e.deltaY < 0
          ? 0
          : left + e.deltaY >
              spanRef.current.scrollWidth - spanRef.current.offsetWidth
            ? spanRef.current.scrollWidth - spanRef.current.offsetWidth
            : left + e.deltaY;
      spanRef.current.scroll({
        left: _left,
        behavior: 'smooth'
      });
      left = _left;
    };
    spanRef.current.addEventListener('wheel', handleWheel);
    return () => {
      if (!spanRef.current) return;
      spanRef.current.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <span
      className="x-scroll"
      ref={(node) => {
        if (!node) return;
        spanRef.current = node;
      }}
    >
      <span className="x-scroll-inner">{children}</span>
    </span>
  );
};

export default XScroll;
