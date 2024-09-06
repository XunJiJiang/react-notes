import type { AnchorPopoverProps } from '@type/modules/comp-markdown-comp-a.d.ts';

import './index.css';
import { useRef, useContext } from 'react';
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

  // const { origin: hrefOrigin, pathname, search, hash } = new URL(href);

  const isFromThisSite =
    href.startsWith(origin) ||
    href.startsWith('/') ||
    href.startsWith('#') ||
    href.startsWith('.');

  const fullPath = href.startsWith('/')
    ? new URL('.' + href, origin).href
    : href.startsWith('.')
      ? new URL(href, origin).href
      : href;

  return (
    <>
      <Tooltip
        title={decodeURI(fullPath)}
        backgroundColor="black"
        color="white"
        placement="top"
        enterable
        trigger={['hover', 'focus']}
        showAfter={300}
        hideAfter={50}
      >
        <Link
          ref={aRef}
          className={`${className} a-link`}
          to={fullPath}
          reloadDocument={!isFromThisSite}
        >
          <span className="a-link-content">
            {children}
            <Icon name="link" className="a-link-icon" />
          </span>
        </Link>
      </Tooltip>
    </>
  );
};

export default AnchorPopover;
