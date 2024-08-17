import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface MountToBodyProps {
  children: React.ReactNode;
  rootClass?: string;
  style?: React.CSSProperties;
}

const MountToBody = ({ children, rootClass, style = {} }: MountToBodyProps) => {
  const div = document.createElement('div');

  div.className = rootClass || '';

  const [container] = useState(div);

  useEffect(() => {
    document.body.appendChild(container);
    Object.assign(container.style, style);
    return () => {
      document.body.removeChild(container);
    };
  }, [container, style]);

  return createPortal(children, container);
};

export default MountToBody;
