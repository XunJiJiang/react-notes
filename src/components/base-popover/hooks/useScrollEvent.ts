import React, { useEffect, useRef, useCallback } from 'react';

const isScrollable = (element: HTMLElement): boolean => {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
};

const getParent = (element: HTMLElement): HTMLElement | null => {
  if (element === document.documentElement) return null;

  return element.parentElement || (element.parentNode as HTMLElement);
};

type Callbacks = {
  onScroll: (event: Event) => void;
  onScrollStart: (event: Event) => void;
  onScrollEnd: (event: Event) => void;
};

const useScrollEvent = (
  ref: React.MutableRefObject<HTMLElement | null>,
  callbacks: Callbacks
) => {
  const hasChild = (ref.current && true) || false;
  const scrollDoms = useRef<HTMLElement[]>([]);
  const isScroll = useRef(false);

  const handleScroll = useCallback(
    (event: Event) => {
      if (!isScroll.current) {
        isScroll.current = true;
        callbacks.onScrollStart(event);
      }
      callbacks.onScroll(event);
    },
    [callbacks]
  );

  const handleScrollEnd = useCallback(
    (event: Event) => {
      isScroll.current = false;
      callbacks.onScrollEnd(event);
    },
    [callbacks]
  );

  useEffect(() => {
    if (!hasChild) {
      scrollDoms.current = [];
      return;
    }

    // 获取所有可滚动的父元素，不包括自身
    let parent = getParent(ref.current!);
    while (parent) {
      if (isScrollable(parent)) {
        scrollDoms.current.push(parent);
        parent.addEventListener('scroll', handleScroll);
        parent.addEventListener('scrollend', handleScrollEnd);
      }
      parent = getParent(parent);
    }

    return () => {
      scrollDoms.current.forEach((dom) => {
        dom.removeEventListener('scroll', handleScroll);
        dom.removeEventListener('scrollend', handleScrollEnd);
      });
      scrollDoms.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChild]);
};

export default useScrollEvent;
