import {
  cloneElement,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useMemo
} from 'react';
import MountToBody from '@components/mount-to-body/index.tsx';
import useInheritProperty from './hooks/useInheritProperty';
import { hasValue, isNumber, isSame } from '@utils/index.ts';

type PopPosition = {
  top?: string | number | null;
  left?: string | number | null;
  bottom?: string | number | null;
  right?: string | number | null;
};

export interface BasePopoverProps<T> {
  children?: T;
  popRootCls?: string;
  popoverEle: React.ReactElement;
  popRootStyle?: React.CSSProperties;
  visible?: boolean;
  onPopup: (
    rect: T extends React.ReactElement ? DOMRect : undefined,
    popoverRect: DOMRect
  ) => PopPosition;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onClick?: (e: React.MouseEvent) => void;
  onMousedown?: (e: React.MouseEvent) => void;
  onMouseup?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export interface BasePopoverRef {
  childRef: HTMLElement | null;
  popoverRef: HTMLElement | null;
}

// const getRealEle = (ele?: React.ReactElement) => {
//   if (!ele) return ele;
//   if (Array.isArray(ele) || typeof ele.type === 'string') {
//     return ele;
//   }
//   console.log(ele);
//   return getRealEle(ele.props.children);
// };

const _BasePopover = <
  T extends React.ReactElement | undefined = React.ReactElement
>(
  {
    children,
    popRootCls = 'base-popover-root',
    popoverEle,
    popRootStyle = {},
    visible = false,
    onMouseEnter,
    onMouseLeave,
    onClick,
    onMousedown,
    onMouseup,
    onFocus,
    onBlur,
    onContextMenu,
    onPopup
  }: BasePopoverProps<T>,
  ref: React.ForwardedRef<BasePopoverRef>
) => {
  const childRef = useRef<HTMLElement | null>(null);

  const popoverRef = useRef<HTMLElement | null>(null);

  const _children = children; // getRealEle(children);

  const newProps = useInheritProperty(_children, {
    ref: (node: HTMLElement | null) => {
      if (!node) return;
      childRef.current = node;
    },
    onMouseEnter: (e: React.MouseEvent) => onMouseEnter?.(e),
    onMouseLeave: (e: React.MouseEvent) => onMouseLeave?.(e),
    onClick: (e: React.MouseEvent) => onClick?.(e),
    onMouseDown: (e: React.MouseEvent) => onMousedown?.(e),
    onMouseUp: (e: React.MouseEvent) => onMouseup?.(e),
    onFocus: (e: React.FocusEvent) => onFocus?.(e),
    onBlur: (e: React.FocusEvent) => onBlur?.(e),
    onContextMenu: (e: React.MouseEvent) => onContextMenu?.(e)
  });

  const child = _children ? cloneElement(_children, newProps) : null;

  const newPopoverProps = useInheritProperty(popoverEle, {
    ref: (node: HTMLElement | null) => {
      if (!node) return;
      popoverRef.current = node;
    }
  });

  const [popPosition, setPopPosition] = useState<PopPosition>({
    top: -1000,
    left: -1000,
    bottom: -1000,
    right: -1000
  });

  const computedStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (hasValue<string | number>(popPosition.top)) {
      style.top = isNumber(popPosition.top)
        ? `${popPosition.top}px`
        : popPosition.top;
    }
    if (hasValue<string | number>(popPosition.left)) {
      style.left = isNumber(popPosition.left)
        ? `${popPosition.left}px`
        : popPosition.left;
    }
    if (hasValue<string | number>(popPosition.bottom)) {
      style.bottom = isNumber(popPosition.bottom)
        ? `${popPosition.bottom}px`
        : popPosition.bottom;
    }
    if (hasValue<string | number>(popPosition.right)) {
      style.right = isNumber(popPosition.right)
        ? `${popPosition.right}px`
        : popPosition.right;
    }
    return style;
  }, [popPosition]);

  const popEle = cloneElement(popoverEle, newPopoverProps);

  useEffect(() => {
    const isVisible = visible;
    if (!isVisible) return;
    let _isRun = true;
    let _rect: DOMRect | null = null;
    let _popoverRect: DOMRect | null = null;
    const isRectChange = () => {
      const _newRect = childRef.current?.getBoundingClientRect();
      const _newPopoverRect = popoverRef.current?.getBoundingClientRect();
      if (!_rect && !_popoverRect && !_newRect && _newPopoverRect) return true;
      if ((!_rect || !_popoverRect) && _newRect && _newPopoverRect) {
        _rect = _newRect;
        _popoverRect = _newPopoverRect;
        return true;
      }
      if (!_rect || !_popoverRect || !_newRect || !_newPopoverRect)
        return false;
      if (
        !isSame(_rect, _newRect, {
          deep: true
        }) ||
        !isSame(_popoverRect, _newPopoverRect, {
          deep: true
        })
      ) {
        _rect = _newRect;
        _popoverRect = _newPopoverRect;
        return true;
      }
      return false;
    };
    const run = () => {
      if (!_isRun) return;
      if (!popoverRef.current) return;
      if (!isRectChange()) {
        requestAnimationFrame(run);
        return;
      }
      const _rect =
        childRef.current?.getBoundingClientRect() as T extends React.ReactElement
          ? DOMRect
          : undefined;
      const _popoverRect = popoverRef.current.getBoundingClientRect();
      const _popPosition = onPopup(_rect, _popoverRect);
      setPopPosition(_popPosition);
      requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
    return () => {
      _isRun = false;
    };
  }, [visible, popoverEle, popRootCls, onPopup]);

  useImperativeHandle(ref, () => {
    return {
      childRef: childRef.current,
      popoverRef: popoverRef.current
    };
  });

  const _child = (
    <>
      {child}
      {visible && (
        <MountToBody
          key="popover"
          style={{
            ...popRootStyle,
            position: 'absolute',
            ...computedStyle,
            display: 'visible',
            zIndex: 100
          }}
          rootClass={popRootCls}
        >
          {popEle}
        </MountToBody>
      )}
    </>
  );

  return _child;
};

const BasePopover = forwardRef(_BasePopover) as <
  T extends React.ReactElement | undefined = React.ReactElement
>(
  props: BasePopoverProps<T> & { ref?: React.Ref<BasePopoverRef> }
) => React.ReactElement;

export default BasePopover;
