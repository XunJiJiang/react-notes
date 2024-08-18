import './index.css';
import { useEffect, useRef, useState, useCallback } from 'react';
import BasePopover from '@components/base-popover/index.tsx';
import {
  useWindowMouseEvent,
  TimeoutTaskQueue,
  AnyMap
} from '@/utils/index.ts';

interface TooltipProps {
  children?: React.ReactElement;
  title: React.ReactNode;
  backgroundColor?: string;
  color?: string;
  placement?:
    | 'top'
    // 用于跟踪鼠标的位置
    | 'top-left'
    | 'top-right'
    // | 'top-start'
    // | 'top-end'
    | 'bottom'
    // 用于跟踪鼠标的位置
    | 'bottom-left'
    | 'bottom-right'
    // | 'bottom-start'
    // | 'bottom-end'
    | 'left'
    // | 'left-start'
    // | 'left-end'
    | 'right';
  // | 'right-start'
  // | 'right-end';
  visible?: boolean;
  showAfter?: number; // 显示延迟
  showArrow?: boolean; // 是否显示箭头
  hideAfter?: number; // 隐藏延迟
  popRootCls?: string;
  enterable?: boolean; // 鼠标是否可进入popover中
  trigger?: 'hover' | 'click' | 'focus' | 'contextmenu';
  disabled?: boolean;
}

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

  const mousePos = useRef({ x: -1000, y: -1000 });

  const childrenRef = useRef<HTMLElement | null>(null);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  const arrowRef = useRef<HTMLSpanElement | null>(null);

  // 可见状态 表示预计的状态 需要等待延迟后实现, 当事件触发时, 会改变这个状态, 但是不会立即使用setShow
  const showState = useRef(false);

  useWindowMouseEvent({
    mousemove: !children
      ? (e) => {
          mousePos.current = { x: e.clientX, y: e.clientY };
        }
      : undefined,
    click:
      trigger === 'click' || trigger === 'contextmenu'
        ? () => {
            changeShow(false);
          }
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
      if (show) {
        showTaskQueue.current = taskQueue;
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
              popoverRef.current?.style.setProperty('opacity', '1');
            },
            delay: 10
          });
      } else {
        showTaskQueue.current = taskQueue;
        showTaskQueue.current
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              popoverRef.current?.style.setProperty('opacity', '0');
            },
            delay: hideAfter + 10
          })
          .addTask({
            callback: () => {
              if (!taskQueueMap.current.has(taskQueue)) return;
              setShow(false);
            },
            delay: 310
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
                top: (() => {
                  if (!showArrow) return;
                  if (placement === 'top') return '100%';
                  if (placement === 'bottom') return '0';
                  return '50%';
                })(),
                left: (() => {
                  if (!showArrow) return;
                  if (placement === 'top' || placement === 'bottom')
                    return '50%';
                  if (placement === 'left') return '100%';
                  if (placement === 'right') return '0';
                  return '50%';
                })(),
                backgroundColor: backgroundColor ?? 'white'
              }}
              className="tooltip-arrow"
            />
          )}
        </div>
      }
      onPopup={(rect, popRect) => {
        if (!rect) {
          return {
            left: mousePos.current.x + 10,
            top: mousePos.current.y + 10
          };
        }
        return {
          top: rect.top - popRect.height - 10,
          left: rect.left + rect.width / 2 - popRect.width / 2
        };
      }}
      onMouseEnter={
        children && trigger === 'hover'
          ? () => {
              changeShow(true);
            }
          : undefined
      }
      onMouseLeave={
        children && trigger === 'hover'
          ? () => {
              changeShow(false);
            }
          : undefined
      }
      onClick={
        children && trigger === 'click'
          ? () => {
              changeShow(!showState.current);
            }
          : undefined
      }
      onFocus={
        children && trigger === 'focus'
          ? () => {
              changeShow(true);
            }
          : undefined
      }
      onBlur={
        children && trigger === 'focus'
          ? () => {
              changeShow(false);
            }
          : undefined
      }
      onContextMenu={
        children && trigger === 'contextmenu'
          ? () => {
              changeShow(true);
            }
          : undefined
      }
      visible={show}
    >
      {children}
    </BasePopover>
  );
};

export default Tooltip;
