import './index.css';
import { useState, useRef, useEffect } from 'react';
import runAnimate, { _keyframes } from './hooks/useTransition';

export default function Transition ({ mode = 'out-in', children, keyframe = _keyframes[mode], duration = 300, easing = 'ease-in-out'}) {
  if (Array.isArray(children)) {
    throw new Error('Transition 组件只能接收一个子元素');
  }

  const isVisible = useRef(children);

  const [nowChild, setNowChild] = useState(children);

  useEffect(() => {
    // 当子元素发生变化时，执行动画逻辑
    runAnimate(
      children,
      { mode, keyframe, duration, easing },
      setNowChild,
      isVisible
    );
  }, [children]);

  return (
    <>
      {nowChild}
    </>
  )
}