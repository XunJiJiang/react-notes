import './index.css';

export default function Icon ({ name = '', className }) {
  return (
    <i className={`icon icon-${name} ${className}`}></i>
  );
}