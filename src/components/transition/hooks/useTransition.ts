import type {
  KeyframeTypes,
  RunAnimateFunc
} from '@type/modules/comp-transition-hooks-useTransition';

import { flushSync } from 'react-dom';

export const _keyframes: KeyframeTypes = {
  'out-in': {
    out: [
      {
        opacity: 1
      },
      {
        opacity: 0
      }
    ],
    in: [
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    ]
  },
  in: {
    in: [
      {
        opacity: 0
      },
      {
        opacity: 1
      }
    ]
  },
  out: {
    out: [
      {
        opacity: 1
      },
      {
        opacity: 0
      }
    ]
  }
};

const runAnimate: RunAnimateFunc = (
  children,
  { mode, keyframe, duration, easing },
  setNowChild,
  isVisible
) => {
  const mainPage = document.getElementById(children.props.id);
  if (!mainPage) {
    Promise.resolve().then(() => {
      flushSync(() => {
        setNowChild(children);
      });
    });
    isVisible.current = children;
    return;
  }

  if (mode === 'out') {
    // 运行旧组件的动画
    mainPage.animate(keyframe.out ?? _keyframes.out.out, {
      duration: duration,
      easing: easing
    });
    // 延迟执行载入新组件如果已展示的组件为空则立即执行
    setTimeout(
      () => {
        flushSync(() => {
          setNowChild(children);
        });
        // 设置新组件 isVisible
        isVisible.current = children;
      },
      isVisible.current ? duration : 0
    );
  }

  if (mode === 'in') {
    // 将flushSync放入Promise中在下一次渲染前执行
    Promise.resolve().then(() => {
      flushSync(() => {
        setNowChild(children);
      });
      // 运行新组件的动画
      mainPage.animate(keyframe.in ?? _keyframes.in.in, {
        duration: duration,
        easing: easing
      });
      // 设置新组件 isVisible
      setTimeout(() => {
        isVisible.current = children;
      }, duration);
    });
  }

  if (mode === 'out-in') {
    // 1. 执行旧组件的动画
    mainPage.animate(keyframe.out ?? _keyframes['out-in'].out, {
      duration: duration,
      easing: easing
    });

    setTimeout(
      () => {
        // 2. 切换渲染的组件
        flushSync(() => {
          setNowChild(children);
        });
        // 3. 执行新组件的动画
        const mainPage = document.getElementById(children.props.id);
        mainPage &&
          mainPage.animate(keyframe.in ?? _keyframes['out-in'].in, {
            duration: duration,
            easing: easing
          });
        // 4. 设置新组件 isVisible
        setTimeout(() => {
          isVisible.current = children;
        }, duration);
      },
      isVisible.current ? duration - 10 : 0
    );
  }
};

export default runAnimate;
