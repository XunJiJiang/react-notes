import './index.css';
import contents from './contents.js';
import Contents from './contents/index.js';

export default function Components () {
  function changeHandler ({setSelected}) {
    setSelected(!!(Math.floor(Math.random() * 2)));
  }

  return (
    <div className='body'>
      <Contents title="React" contents={contents} onChange={changeHandler} />
      <div className='main'>123</div>
    </div>
  );
}