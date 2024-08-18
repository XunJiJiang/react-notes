import './index.css';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface MountToBodyProps {
  children: React.ReactNode;
  rootClass?: string;
  style?: React.CSSProperties;
}

const MountToBody = ({ children, rootClass, style = {} }: MountToBodyProps) => {
  const div = document.createElement('div');

  div.className = (rootClass + ' ' || '') + 'mount-in-body';

  const [container] = useState(div);

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(<div style={style}>{children}</div>, container);
};

export default MountToBody;