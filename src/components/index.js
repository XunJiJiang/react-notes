import './index.css';
import { useState } from 'react';
import contents from './contents.js';
import Contents from './contents/index.js';

export default function Components () {
  const [mainNode, setMainNode] = useState(null);

  function changeHandler (context) {
    console.log(context)
    setMainNode(context.component);
  }

  return (
    <div className='body'>
      <Contents title="React" contents={contents} onChange={changeHandler} />
      <div className='main'>{mainNode}</div>
    </div>
  );
}