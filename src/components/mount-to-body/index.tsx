import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface MountToBodyProps {
  children: React.ReactNode;
  rootClass?: string;
}

const MountToBody = ({ children, rootClass }: MountToBodyProps) => {
  const div = document.createElement('div');

  div.className = rootClass || '';

  const [container] = useState(div);

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return createPortal(children, container);
};

export default MountToBody;
