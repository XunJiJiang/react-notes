import './index.css';

export default function Icon ({ name = '' }) {
  return (
    <i className={`icon icon-${name}`}></i>
  );
}