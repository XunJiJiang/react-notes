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
  transformOrigin: string;
  arrow: { top: string; left: string } | null;
  position: (
    rect: DOMRect | { x: number; y: number },
    popRect: DOMRect
  ) => { top: string; left: string };
};

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
  trigger?: 'hover' | 'click' | 'focus' | 'contextmenu';
  disabled?: boolean;
}

const directions = ['top', 'bottom', 'left', 'right'];

const positions = ['start', 'end', 'center'];

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
    const _first =
      first === 'top'
        ? 'bottom'
        : first === 'bottom'
          ? 'top'
          : first === 'left'
            ? 'right'
            : 'left';
    const _second = 'center';
    result.transformOrigin = `${_first} ${_second}`;

    result.arrow = {
      top: first === 'top' ? '100%' : first === 'bottom' ? '0' : '50%',
      left: first === 'left' ? '100%' : first === 'right' ? '0' : '50%'
    };

    result.position = (rect, popRect) => {
      if (rect instanceof DOMRect === false)
        throw new TypeError('Tooltip: 有children时, rect 需要为 DOMRect');
      const { top, left, width, height } = rect;
      const { width: popWidth, height: popHeight } = popRect;
      if (typeof top === 'undefined') throw new Error('top is undefined');
      if (first === 'top') {
        return {
          top: `${top - popHeight - 10}px`,
          left:
            second === 'start'
              ? `${left}px`
              : second === 'end'
                ? `${left + width - popWidth}px`
                : `${left + width / 2 - popWidth / 2}px`
        };
      }
      if (first === 'bottom') {
        return {
          top: `${top + height + 10}px`,
          left:
            second === 'start'
              ? `${left}px`
              : second === 'end'
                ? `${left + width - popWidth}px`
                : `${left + width / 2 - popWidth / 2}px`
        };
      }
      if (first === 'left') {
        return {
          top:
            second === 'start'
              ? `${top}px`
              : second === 'end'
                ? `${top + height - popHeight}px`
                : `${top + height / 2 - popHeight / 2}px`,
          left: `${left - popWidth - 10}px`
        };
      }
      return {
        top:
          second === 'start'
            ? `${top}px`
            : second === 'end'
              ? `${top + height - popHeight}px`
              : `${top + height / 2 - popHeight / 2}px`,
        left: `${left + width + 10}px`
      };
    };

    return result;
  } else if (directions.includes(first) && directions.includes(second)) {
    const _y =
      first === 'top'
        ? 'bottom'
        : first === 'bottom'
          ? 'top'
          : second === 'top'
            ? 'bottom'
            : 'top';
    const _x =
      first === 'left'
        ? 'right'
        : first === 'right'
          ? 'left'
          : second === 'left'
            ? 'right'
            : 'left';
    result.transformOrigin = `${_y} ${_x}`;

    result.arrow = null;

    result.position = (pos, popover) => {
      if ('top' in pos)
        throw new TypeError(
          'Tooltip: 没有children时, rect 需要为 { x: number; y: number; }'
        );
      const { x, y } = pos;
      const { width, height } = popover;

      if (first === 'top' || second === 'top') {
        return {
          top: `${y - height - 5}px`,
          left:
            first === 'left' || second === 'left'
              ? `${x - width - 5}px`
              : `${x + 10}px`
        };
      } else if (first === 'bottom' || second === 'bottom') {
        return {
          top: `${y + 10}px`,
          left:
            first === 'left' || second === 'left'
              ? `${x - width - 5}px`
              : `${x + 10}px`
        };
      }

      throw new Error('Tooltip: 无效的 placement');
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
  disabled = false
}: TooltipProps) => {
  if (!children && typeof visible !== 'boolean')
    throw new Error('当 tooltip 没有 children 时, 必须传入 visible 以控制展示');

  /*@__PURE__*/ (() => {
    if (typeof visible === 'boolean' && disabled)
      console.warn('Tooltip: 当传入 visible 时, disabled 会被忽略');
    if (enterable && trigger !== 'hover')
      console.warn('Tooltip: 当 trigger 不为 hover 时, enterable 会被忽略');
    if (enterable && hideAfter <= 30)
      console.warn(
        'Tooltip: 当 enterable 为 true 时, 过低的hideAfter可能会导致闪动'
      );
  })();

  const place = useMemo(
    () => calculatePosition(placement, hasValue(children)),
    [children, placement]
  );

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
      trigger === 'click' || trigger === 'contextmenu'
        ? () => changeShow(false)
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
            },
            delay: 10
          });
      } else {
        showTaskQueue.current
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              popoverRef.current?.style.setProperty('--show-transform', '0');
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
    (show: boolean) => {
      if (typeof visible === 'boolean') {
        if (showState.current === visible) return;
        showState.current = visible;
      } else if (disabled) {
        if (showState.current === false) return;
        showState.current = false;
      } else {
        if (showState.current === show) return;
        showState.current = show;
      }
      setTaskQueue(showState.current);
    },
    [disabled, setTaskQueue, visible]
  );

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof visible === 'boolean') {
      changeShow(visible);
    } else if (disabled) {
      changeShow(false);
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
              enterable && trigger === 'hover'
                ? () => {
                    changeShow(true);
                  }
                : undefined
            }
            onMouseLeave={
              enterable && trigger === 'hover'
                ? () => {
                    changeShow(false);
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
                top: place.arrow?.top,
                left: place.arrow?.left,
                backgroundColor: backgroundColor ?? 'white'
              }}
              className="tooltip-arrow"
            />
          )}
        </div>
      }
      onPopup={_onPopup}
      onMouseEnter={
        children && trigger === 'hover' ? () => changeShow(true) : undefined
      }
      onMouseLeave={
        children && trigger === 'hover' ? () => changeShow(false) : undefined
      }
      onClick={
        children && trigger === 'click'
          ? () => changeShow(!showState.current)
          : undefined
      }
      onFocus={
        children && trigger === 'focus' ? () => changeShow(true) : undefined
      }
      onBlur={
        children && trigger === 'focus' ? () => changeShow(false) : undefined
      }
      onContextMenu={
        children && trigger === 'contextmenu'
          ? () => changeShow(true)
          : undefined
      }
      visible={show}
    >
      {children}
    </BasePopover>
  );
};

export default Tooltip;
