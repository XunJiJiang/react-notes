import './index.css';
import Icon from '../icon';

export default function Button ({ title = '', icon, onClick = () => {} }) {
  return (
    <button className='content-button' onClick={(e) => {
      e.setSelected = (isSelected = false) => {
        if (isSelected) {
          e.target.setAttribute('isSelected','true')
        } else {
          e.target.setAttribute('isSelected','false')
        }
      }
      onClick(e);
    }}>
      {title}
      {icon && <Icon name={icon} />}
    </button>
  );
}