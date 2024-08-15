import type { ImgProps } from '@type/modules/comp-markdown-comp-img.d.ts';

import './index.css';

const Img = ({ src = '', alt = '', className = '' }: ImgProps) => {
  return (
    <img
      className={`markdown-img ${className ?? ''}`}
      src={src}
      alt={alt}
      onError={(e) => {
        if (
          'setAttribute' in e.target &&
          typeof e.target.setAttribute === 'function'
        )
          e.target.setAttribute('data-img-is-error', true);
      }}
      onLoad={(e) => {
        if (
          'setAttribute' in e.target &&
          typeof e.target.setAttribute === 'function'
        )
          e.target.setAttribute('data-img-is-error', false);
      }}
    />
  );
};

export default Img;
