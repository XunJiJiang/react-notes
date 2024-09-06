import './index.css';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import BasePopover from '@components/base-popover/index.tsx';
import {
  useWindowMouseEvent,
  TimeoutTaskQueue,
  AnyMap,
  hasValue
} from '@/utils/index.ts';

type Placement =
  // 有children时, popover的位置(相对于children), 默认为top
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  // 判断没有children时, popover的位置(相对于光标位置), 默认为bottom right, 当只传入一个值时, 另一个值默认
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'left-top'
  | 'left-bottom'
  | 'right-top'
  | 'right-bottom';

type CalculatePosition = (
  placement: Placement,
  hasChild: boolean
) => {
  position: (
    rect: DOMRect | { x: number; y: number },
    popRect: DOMRect
  ) => {
    top: string;
    left: string;
    arrowTop?: string;
    arrowLeft?: string;
  };
};

type Trigger = 'hover' | 'click' | 'focus' | 'contextmenu';

export interface TooltipProps {
  children?: React.ReactElement;
  title: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  placement?: Placement;
  visible?: boolean;
  showAfter?: number; // 显示延迟
  showArrow?: boolean; // 是否显示箭头
  hideAfter?: number; // 隐藏延迟
  popRootCls?: string;
  enterable?: boolean; // 鼠标是否可进入popover中
  trigger?: Trigger | Trigger[]; // 触发方式
  disabled?: boolean;
  popX?: number; // 没有children时, popover的x坐标
  popY?: number; // 没有children时, popover的y坐标
}

const directions = ['top', 'bottom', 'left', 'right'];

const positions = ['start', 'end', 'center'];

// 默认与窗口横边缘的最小距离
const minDistance = {
  top: 15,
  bottom: 15,
  left: 15,
  right: 15
};

const calculatePosition: CalculatePosition = (placement, hasChild) => {
  const place = placement.split('-');
  if (place.length === 1) {
    place.push(
      hasChild
        ? 'center'
        : place[0] === 'top' || place[0] === 'bottom'
          ? 'right'
          : 'bottom'
    );
  }

  const [first, second] = place;
  // 当第一位为方向, 第二位为位置时, 为有children时的popover位置
  // 当都为方向时, 为没有children时的popover位置
  // 返回内容包括以下:
  // transform-origin: 用于设置popover .tooltip-box的transform-origin
  // arrow: 用于设置arrow的位置 { top: string; left: string; }
  const result = {} as ReturnType<CalculatePosition>;
  // 有children时的popover位置
  if (directions.includes(first) && positions.includes(second)) {
    result.position = (rect, popRect) => {
      if (rect instanceof DOMRect === false)
        throw new TypeError('Tooltip: 有children时, rect 需要为 DOMRect');
      const { top, left, width, height } = rect;
      const { width: popWidth, height: popHeight } = popRect;
      if (typeof top === 'undefined') throw new Error('top is undefined');

      if (first === 'top') {
        let _top = top - popHeight - 10;
        let _left =
          second === 'start'
            ? left
            : second === 'end'
              ? left + width - popWidth
              : left + width / 2 - popWidth / 2;
        let _arrowTop = 100;
        let _arrowLeft = 50;
        if (_top < minDistance.top) {
          _top = top + height + 10;
          _arrowTop = 0;
        }
        if (_left < minDistance.left) {
          if (minDistance.left > left + width - 16) {
            _left = left + width - 16; // arrow的宽度为14.1421, 为预留指向源组件的位置, 减去16
          } else {
            _left = minDistance.left;
          }
        } else if (_left + popWidth > window.innerWidth - minDistance.right) {
          if (
            window.innerWidth - popWidth - minDistance.right <
            left - popWidth + 16
          ) {
            _left = left - popWidth + 16;
          } else {
            _left = window.innerWidth - popWidth - minDistance.right;
          }
        }
        const right = left + width;
        const _right = _left + popWidth;
        if (_left < left || _right > right) {
          const arrowLeft = (left + width / 2 - _left) / popWidth;
          _arrowLeft = arrowLeft * 100;
          const leftDiff = Math.abs(left - _right);
          const rightDiff = Math.abs(right - _left);
          if (leftDiff < rightDiff) {
            _arrowLeft = _arrowLeft =
              100 -
              ((leftDiff * popWidth) / (width + popWidth) / popWidth) * 100;
          } else {
            _arrowLeft =
              ((rightDiff * popWidth) / (width + popWidth) / popWidth) * 100;
          }
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`,
          arrowTop: `${_arrowTop}%`,
          arrowLeft: `${_arrowLeft}%`
        };
      }

      if (first === 'bottom') {
        let _top = top + height + 10;
        let _left =
          second === 'start'
            ? left
            : second === 'end'
              ? left + width - popWidth
              : left + width / 2 - popWidth / 2;
        let _arrowTop = 0;
        let _arrowLeft = 50;
        if (_top + popHeight > window.innerHeight - minDistance.bottom) {
          _top = top - popHeight - 10;
          _arrowTop = 100;
        }
        if (_left < minDistance.left) {
          if (minDistance.left > left + width - 16) {
            _left = left + width - 16; // arrow的宽度为14.1421, 为预留指向源组件的位置, 减去16
          } else {
            _left = minDistance.left;
          }
        } else if (_left + popWidth > window.innerWidth - minDistance.right) {
          if (
            window.innerWidth - popWidth - minDistance.right <
            left - popWidth + 16
          ) {
            _left = left - popWidth + 16;
          } else {
            _left = window.innerWidth - popWidth - minDistance.right;
          }
        }
        const right = left + width;
        const _right = _left + popWidth;
        if (_left < left || _right > right) {
          const arrowLeft = (left + width / 2 - _left) / popWidth;
          _arrowLeft = arrowLeft * 100;
          const leftDiff = Math.abs(left - _right);
          const rightDiff = Math.abs(right - _left);
          if (leftDiff < rightDiff) {
            _arrowLeft =
              100 -
              ((leftDiff * popWidth) / (width + popWidth) / popWidth) * 100;
          } else {
            _arrowLeft =
              ((rightDiff * popWidth) / (width + popWidth) / popWidth) * 100;
          }
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`,
          arrowTop: `${_arrowTop}%`,
          arrowLeft: `${_arrowLeft}%`
        };
      }

      if (first === 'left') {
        let _left = left - popWidth - 10;
        let _top =
          second === 'start'
            ? top
            : second === 'end'
              ? top + height - popHeight
              : top + height / 2 - popHeight / 2;
        let _arrowTop = 50;
        let _arrowLeft = 100;
        if (_left < minDistance.left) {
          _left = left + width + 10;
          _arrowLeft = 0;
        }
        if (_top < minDistance.top) {
          if (minDistance.top > top + height - 16) {
            _top = top + height - 16;
          } else {
            _top = minDistance.top;
          }
        } else if (_top + popHeight > window.innerHeight - minDistance.bottom) {
          if (
            window.innerHeight - popHeight - minDistance.bottom <
            top - popHeight + 16
          ) {
            _top = top - popHeight + 16;
          } else {
            _top = window.innerHeight - popHeight - minDistance.bottom;
          }
        }
        const bottom = top + height;
        const _bottom = _top + popHeight;
        if (_top < top || _bottom > bottom) {
          const arrowTop = (top + height / 2 - _top) / popHeight;
          _arrowTop = arrowTop * 100;
          const topDiff = Math.abs(top - _bottom);
          const bottomDiff = Math.abs(bottom - _top);
          if (topDiff < bottomDiff) {
            _arrowTop =
              100 -
              ((topDiff * popHeight) / (height + popHeight) / popHeight) * 100;
          } else {
            _arrowTop =
              ((bottomDiff * popHeight) / (height + popHeight) / popHeight) *
              100;
          }
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`,
          arrowTop: `${_arrowTop}%`,
          arrowLeft: `${_arrowLeft}%`
        };
      }

      if (first === 'right') {
        let _left = left + width + 10;
        let _top =
          second === 'start'
            ? top
            : second === 'end'
              ? top + height - popHeight
              : top + height / 2 - popHeight / 2;
        let _arrowTop = 50;
        let _arrowLeft = 0;
        if (_left + popWidth > window.innerWidth - minDistance.left) {
          _left = left - popWidth - 10;
          _arrowLeft = 100;
        }
        if (_top < minDistance.top) {
          if (minDistance.top > top + height - 16) {
            _top = top + height - 16;
          } else {
            _top = minDistance.top;
          }
        } else if (_top + popHeight > window.innerHeight - minDistance.bottom) {
          if (
            window.innerHeight - popHeight - minDistance.bottom <
            top - popHeight + 16
          ) {
            _top = top - popHeight + 16;
          } else {
            _top = window.innerHeight - popHeight - minDistance.bottom;
          }
        }
        const bottom = top + height;
        const _bottom = _top + popHeight;
        if (_top < top || _bottom > bottom) {
          const arrowTop = (top + height / 2 - _top) / popHeight;
          _arrowTop = arrowTop * 100;
          const topDiff = Math.abs(top - _bottom);
          const bottomDiff = Math.abs(bottom - _top);
          if (topDiff < bottomDiff) {
            _arrowTop =
              100 -
              ((topDiff * popHeight) / (height + popHeight) / popHeight) * 100;
          } else {
            _arrowTop =
              ((bottomDiff * popHeight) / (height + popHeight) / popHeight) *
              100;
          }
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`,
          arrowTop: `${_arrowTop}%`,
          arrowLeft: `${_arrowLeft}%`
        };
      }

      throw new Error('Tooltip: 无效的 placement');
    };

    return result;
  }
  // 没有children时的popover位置
  else if (directions.includes(first) && directions.includes(second)) {
    const isTop = first === 'top' || second === 'top';
    const isLeft = first === 'left' || second === 'left';

    result.position = (pos, popover) => {
      if ('top' in pos)
        throw new TypeError(
          'Tooltip: 没有children时, rect 需要为 { x: number; y: number; }'
        );
      const { x, y } = pos;
      const { width, height } = popover;

      if (isTop) {
        let _top = y - height - 5;
        let _left = isLeft ? x - width - 5 : x + 10;
        if (_top < minDistance.top) _top = minDistance.top;
        if (isLeft) {
          if (_left < minDistance.left) _left = minDistance.left;
        } else {
          if (_left + width > window.innerWidth - minDistance.right)
            _left = window.innerWidth - width - minDistance.right;
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`
        };
      } else {
        let _top = y + 10;
        let _left = isLeft ? x - width - 5 : x + 10;
        if (_top + height > window.innerHeight - minDistance.bottom)
          _top = window.innerHeight - height - minDistance.bottom;
        if (isLeft) {
          if (_left < minDistance.left) _left = minDistance.left;
        } else {
          if (_left + width > window.innerWidth - minDistance.right)
            _left = window.innerWidth - width - minDistance.right;
        }
        return {
          top: `${_top}px`,
          left: `${_left}px`
        };
      }
    };
    return result;
  }

  throw new Error('Tooltip: 无效的 placement');
};

const Tooltip = ({
  children,
  title,
  backgroundColor = '#fff',
  color = '#333',
  placement = 'top',
  visible,
  showAfter = 0,
  showArrow = true,
  hideAfter = 300,
  popRootCls = 'tooltip-root',
  enterable = false,
  trigger = 'hover',
  disabled = false,
  popX,
  popY
}: TooltipProps) => {
  if (!children && typeof visible !== 'boolean')
    throw new Error('当 tooltip 没有 children 时, 必须传入 visible 以控制展示');

  const _trigger = useMemo(() => {
    if (typeof trigger === 'string') return [trigger];
    return trigger;
  }, [trigger]);

  /*@__PURE__*/ (() => {
    if (typeof visible === 'boolean' && disabled)
      console.warn('Tooltip: 当传入 visible 时, disabled 会被忽略');
    if (enterable && hideAfter <= 30)
      console.warn(
        'Tooltip: 当 enterable 为 true 时, 过低的hideAfter可能会导致闪动'
      );
  })();

  // 当前触发方式
  const nowTrigger = useRef<Trigger | ''>('');

  const place = useMemo(
    () => calculatePosition(placement, hasValue(children)),
    [children, placement]
  );

  const [arrowPos, setArrowPos] = useState({ top: '0', left: '0' });

  const mousePos = useRef({ x: -1000, y: -1000 });

  const childrenRef = useRef<HTMLElement | null>(null);

  /** popover实例根元素 */
  const popoverRef = useRef<HTMLDivElement | null>(null);

  /** popover内的箭头 */
  const arrowRef = useRef<HTMLSpanElement | null>(null);

  // 可见状态 表示预计的状态 需要等待延迟后实现, 当事件触发时, 会改变这个状态, 但是不会立即使用setShow
  const showState = useRef(false);

  useWindowMouseEvent({
    mousemove: !children
      ? (e) => (mousePos.current = { x: e.clientX, y: e.clientY })
      : undefined,
    click:
      _trigger.includes('click') || _trigger.includes('contextmenu')
        ? () => changeShow(false, '')
        : undefined
  });

  const showTaskQueue = useRef<TimeoutTaskQueue | null>(null);

  const taskQueueMap = useRef(new AnyMap());

  const setTaskQueue = useCallback(
    (show: boolean) => {
      if (showTaskQueue.current) {
        showTaskQueue.current.clear();
        taskQueueMap.current.delete(showTaskQueue.current);
      }
      const taskQueue = new TimeoutTaskQueue();
      taskQueueMap.current.set(taskQueue, show);
      showTaskQueue.current = taskQueue;
      if (show) {
        showTaskQueue.current
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              setShow(true);
            },
            delay: showAfter
          })
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              popoverRef.current?.style.setProperty('--show-transform', '1');
              popoverRef.current?.style.setProperty(
                '--cubic-bezier',
                'cubic-bezier(0.4, 0.52, 0, 1.5)'
              );
            },
            delay: 10
          });
      } else {
        showTaskQueue.current
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              popoverRef.current?.style.setProperty('--show-transform', '0');
              popoverRef.current?.style.setProperty(
                '--cubic-bezier',
                'cubic-bezier(0.42, 0, 0.58, 1)'
              );
            },
            delay: hideAfter
          })
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              setShow(false);
            },
            delay: 300
          });
      }
      showTaskQueue.current?.runOnce();
    },
    [hideAfter, showAfter]
  );

  const changeShow = useCallback(
    (show: boolean, trigger: Trigger | '') => {
      // if (nowTrigger.current === '') nowTrigger.current = trigger;
      // else if (nowTrigger.current !== trigger) return;

      // visible 为 boolean 时, 由外部控制
      if (typeof visible === 'boolean') {
        if (showState.current === visible) return;
        showState.current = visible;
      }
      // disabled 时, 不显示
      else if (disabled) {
        if (showState.current === false) return;
        showState.current = false;
      }
      // 最后由内部支持的状态控制
      else {
        if (showState.current === show) return;
        showState.current = show;
        nowTrigger.current = trigger;
      }
      setTaskQueue(showState.current);
    },
    [disabled, setTaskQueue, visible]
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof visible === 'boolean') {
      changeShow(visible, '');
    } else if (disabled) {
      changeShow(false, '');
    }
  }, [visible, disabled, changeShow]);

  const _onPopup = useCallback(
    (rect: DOMRect | undefined, popRect: DOMRect) => {
      if (!rect) {
        const _place = place.position(mousePos.current, popRect);
        return {
          top: popX ?? _place.top,
          left: popY ?? _place.left
        };
      }
      const _place = place.position(rect, popRect);
      setArrowPos({
        top: _place.arrowTop ?? '0',
        left: _place.arrowLeft ?? '0'
      });
      return {
        top: popX ?? _place.top,
        left: popY ?? _place.left
      };
    },
    [place, popX, popY]
  );

  return (
    <BasePopover<typeof children>
      ref={(nodes) => {
        if (!nodes) return;
        childrenRef.current = nodes.childRef;
        popoverRef.current = nodes.popoverRef as HTMLDivElement;
      }}
      popRootCls={popRootCls}
      popoverEle={
        <div className="tooltip-box">
          <span
            className="tooltip-content"
            style={{
              backgroundColor: backgroundColor ?? 'white',
              color: color ?? '#333',
              border: !showArrow ? '1px solid #e9e9e9' : 'none'
            }}
            onMouseEnter={
              enterable ? () => changeShow(true, 'hover') : undefined
            }
            onMouseLeave={
              enterable
                ? () => {
                    if (nowTrigger.current === 'hover') changeShow(false, '');
                  }
                : undefined
            }
            onMouseDown={
              enterable
                ? () => {
                    // 目标: 不论最开始由任何方式触发, 在点击过popover后都不会隐藏, 而是在鼠标离开时隐藏
                    // 原理:
                    // 鼠标按下时, 不隐藏, 会先触发其他触发方式的隐藏
                    // 此处延迟触发hover出现
                    // 于是不论最开始由任何方式触发, 都会在鼠标按下时, 触发方式变为hover
                    // 意味着上面的 onMouseLeave 会在离开时触发隐藏
                    setTimeout(() => {
                      changeShow(true, 'hover');
                    }, hideAfter);
                  }
                : undefined
            }
          >
            {title}
          </span>
          {children && showArrow && (
            <span
              ref={(node) => {
                if (!node) return;
                arrowRef.current = node;
              }}
              style={{
                top: arrowPos.top,
                left: arrowPos.left,
                backgroundColor: backgroundColor ?? 'white'
              }}
              className="tooltip-arrow"
            />
          )}
        </div>
      }
      onPopup={_onPopup}
      onMouseEnter={
        children && _trigger.includes('hover')
          ? () => changeShow(true, 'hover')
          : undefined
      }
      onMouseLeave={
        children && _trigger.includes('hover')
          ? () => changeShow(false, '')
          : undefined
      }
      onClick={
        children && _trigger.includes('click')
          ? () =>
              changeShow(!showState.current, !showState.current ? 'click' : '')
          : undefined
      }
      onFocus={
        children && _trigger.includes('focus')
          ? () => changeShow(true, 'focus')
          : undefined
      }
      onBlur={
        children && _trigger.includes('focus')
          ? () => changeShow(false, '')
          : undefined
      }
      onContextMenu={
        children && _trigger.includes('contextmenu')
          ? () => changeShow(true, 'contextmenu')
          : undefined
      }
      visible={show}
    >
      {children}
    </BasePopover>
  );
};

export default Tooltip;
