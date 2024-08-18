import { useEffect } from 'react';

type Events = {
  click?: (e: MouseEvent) => void;
  dblclick?: (e: MouseEvent) => void;
  mousedown?: (e: MouseEvent) => void;
  mouseup?: (e: MouseEvent) => void;
  mousemove?: (e: MouseEvent) => void;
  mouseenter?: (e: MouseEvent) => void;
  mouseleave?: (e: MouseEvent) => void;
};

const useWindowMouseEvent = (events: Events) => {
  useEffect(() => {
    const {
      click,
      dblclick,
      mousedown,
      mouseup,
      mousemove,
      mouseenter,
      mouseleave
    } = events;
    if (click) window.addEventListener('click', click);
    if (dblclick) window.addEventListener('dblclick', dblclick);
    if (mousedown) window.addEventListener('mousedown', mousedown);
    if (mouseup) window.addEventListener('mouseup', mouseup);
    if (mousemove) window.addEventListener('mousemove', mousemove);
    if (mouseenter) window.addEventListener('mouseenter', mouseenter);
    if (mouseleave) window.addEventListener('mouseleave', mouseleave);

    return () => {
      if (click) window.removeEventListener('click', click);
      if (dblclick) window.removeEventListener('dblclick', dblclick);
      if (mousedown) window.removeEventListener('mousedown', mousedown);
      if (mouseup) window.removeEventListener('mouseup', mouseup);
      if (mousemove) window.removeEventListener('mousemove', mousemove);
      if (mouseenter) window.removeEventListener('mouseenter', mouseenter);
      if (mouseleave) window.removeEventListener('mouseleave', mouseleave);
    };
  }, [events]);
};

export default useWindowMouseEvent;
