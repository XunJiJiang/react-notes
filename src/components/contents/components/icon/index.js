import './index.css';

export default function Icon ({ name = '' }) {
  return (
    <i className={`icon-${name}`}></i>
  );
}