import './index.css';
import { useState, useRef, useEffect } from 'react';

const _keyframe = {
  'out-in': {
    out: [{
      opacity: 1
    }, {
      opacity: 0
    }],
    in: [{
      opacity: 0
    }, {
      opacity: 1
    }]
  },
  'in': {
    in: [{
      opacity: 0
    }, {
      opacity: 1
    }]
  },
  'out': {
    out: [{
      opacity: 1
    }, {
      opacity: 0
    }]
  }
}

export default function Transition ({ mode = 'out-in', children, keyframe = _keyframe[mode], duration = 300 }) {
  if (Array.isArray(children)) {
    throw new Error('Transition 组件只能接收一个子元素');
  }

  const isVisible = useRef(children);

  const [nowChild, setNowChild] = useState(children);

  useEffect(() => {
    if (mode === 'out') return;
    const mainPage = document.getElementById(isVisible.current.props.id);
    mainPage.animate(keyframe.out, {
      duration: duration,
      easing: 'ease-in-out'
    });
    setTimeout(() => {
      setNowChild(children);
      const mainPage = document.getElementById(children.props.id);
      mainPage.animate(keyframe.in, {
      duration: duration,
      easing: 'ease-in-out'
      });
      setTimeout(() => {
        isVisible.current = children;
      }, duration);
    }, duration);
  }, [children]);

  return (
    <>
      {nowChild}
    </>
  )
}