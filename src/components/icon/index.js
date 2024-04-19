import './index.css';
import '@/assets/font/iconfont.css';

export default function Icon ({ name = '', className, size }) {
  return (
    <i
      className={`icon iconfont icon-${name} ${className}`}
      style={size ? { fontSize: size + 'px' } : {}}
    />
  );
}