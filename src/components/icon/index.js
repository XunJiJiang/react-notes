import './index.css';
import '@/assets/font/iconfont.css';

export default function Icon ({ name = '', className, size = 16 }) {
  return (
    <i
      className={`icon iconfont icon-${name} ${className}`}
      style={{ fontSize: size + 'px' }}
    />
  );
}