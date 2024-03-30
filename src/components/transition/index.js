import { useState, useRef, useEffect } from 'react';
import runAnimate, { _keyframes } from './hooks/useTransition';

export default function Transition ({
  mode = 'out-in',
  children,
  keyframe = _keyframes[mode],
  duration = 300,
  easing = 'ease-in-out'
}) {

  if (!children) {
    throw new Error('Transition 组件必须有一个子元素');
  };

  if (Array.isArray(children) && children.length > 1) {
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
    // 这里仅在 children 发生变化时执行动画逻辑
    // 但是编译器非要我把 mode, keyframe, duration, easing 放到依赖里
    // 但是这样会导致每次都会重新执行动画逻辑
    // 所以这里禁用 eslint 的 exhaustive-deps 规则
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  return (
    <>
      {nowChild}
    </>
  )
}