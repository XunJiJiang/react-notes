import type { AnchorPopoverProps } from '@type/modules/comp-markdown-comp-a.d.ts';

import './index.css';
import { useRef, useState } from 'react';
import Icon from '@components/icon/index.tsx';
import Tooltip from '@/components/tooltip/index.tsx';

const AnchorPopover = ({
  className = '',
  children,
  href = ''
}: AnchorPopoverProps) => {
  const aRef = useRef<HTMLAnchorElement>(null);

  const isHover = useRef(false);
  const isFocus = useRef(false);

  const [isVisible, setIsVis] = useState(false);

  const updateVisible = () => {
    setIsVis(isHover.current || isFocus.current);
  };

  return (
    <>
      <Tooltip
        title={decodeURI(href)}
        backgroundColor="black"
        color="white"
        hideAfter={0}
        visible={isVisible}
      />
      <a
        ref={aRef}
        className={`${className} a-link`}
        href={href}
        onMouseEnter={() => {
          isHover.current = true;
          updateVisible();
        }}
        onMouseLeave={() => {
          isHover.current = false;
          updateVisible();
        }}
        onFocus={() => {
          isFocus.current = true;
          updateVisible();
        }}
        onBlur={() => {
          isFocus.current = false;
          updateVisible();
        }}
      >
        {children}
        <Icon name="link" className="a-link-icon" />
      </a>
    </>
  );
};

export default AnchorPopover;
