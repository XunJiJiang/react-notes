import './index.css';
import '@/assets/font/iconfont.css';

export default function Icon ({ name = '', className }) {
  return (
    <i className={`icon iconfont icon-${name} ${className}`}></i>
  );
}