import './index.css';
import Button from '../button';
import NotFound from '../../../../pages/404';

export default function Content ({ contents = [] }) {
  console.log('Content', contents);
  return (
    <>
      {
        (Array.isArray(contents)) && contents.map((content) => {
          console.log('content', content[1])
          return (
            <div className='content' key={content[0]}>
              <Button title={content[0] ?? '该子目录不存在'} icon={content[1] && Array.isArray(content[1]) ? 'right' : null} onClick={({setSelected}) => setSelected(true)} />
              {/* {Array.isArray(content[1]) && <Content contents={content[1]} />} */}
              <Content contents={contents[0][1]} />
            </div>
          )
        })
      }
    </>
  );
}