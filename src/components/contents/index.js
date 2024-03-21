import './index.css';
import Content from './components/content';

export default function Contents ({ title = '目录', contents = [], onChange = () => {} }) {
  return (
    <div className='contents'>
      <h1>{title}</h1>
      <Content contents={contents} />
    </div>
  );
}