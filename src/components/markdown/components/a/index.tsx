import type { AnchorPopoverProps } from '@type/modules/comp-markdown-comp-a.d.ts';

import './index.css';
import { useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@components/icon/index.tsx';
import Tooltip from '@/components/tooltip/index.tsx';
import { AppContext } from '@/contexts/index.ts';

const AnchorPopover = ({
  className = '',
  children,
  href = ''
}: AnchorPopoverProps) => {
  const { origin } = useContext(AppContext).setting.url;

  const aRef = useRef<HTMLAnchorElement>(null);

  const isHover = useRef(false);
  const isFocus = useRef(false);

  const [isVisible, setIsVis] = useState(false);

  const updateVisible = () => {
    setIsVis(isHover.current || isFocus.current);
  };

  // const { origin: hrefOrigin, pathname, search, hash } = new URL(href);

  const isFromThisSite = href.startsWith(origin);

  return (
    <>
      <Tooltip
        title={decodeURI(href)}
        backgroundColor="black"
        color="white"
        hideAfter={0}
        visible={isVisible}
      />
      <Link
        ref={aRef}
        className={`${className} a-link`}
        to={href}
        reloadDocument={!isFromThisSite}
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
      </Link>
    </>
  );
};

export default AnchorPopover;
