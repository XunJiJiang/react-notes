import type { IconProps } from '@type/modules/comp-icon.d.ts';

import './index.css';
import '@/assets/font/iconfont.css';

export default function Icon({ name = '', className = '', size }: IconProps) {
  return (
    <i
      className={`icon iconfont icon-${name} ${className}`}
      style={size ? { fontSize: size + 'px' } : {}}
    />
  );
}
