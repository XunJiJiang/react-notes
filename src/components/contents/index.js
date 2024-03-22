import './index.css';
import Content from './components/content';

export default function Contents ({ title = '目录', contents = [], onChange = () => {} }) {
  const width = ((() => {
    function getDeepestLayer (contents) {
      let layer = 1;
      const childLayers = [];
      contents.forEach((content) => {
        if (Array.isArray(content.children)) {
          childLayers.push(getDeepestLayer(content.children));
        } else {
          return layer;
        }
      });
      if (childLayers.length > 0) {
        layer = Math.max(...childLayers) + layer;
      }
      return layer;
    }
    console.log(getDeepestLayer(contents));
    return 150 + 44 + 28 * getDeepestLayer(contents) - 1 + 'px';
  })());
  return (
    <div className='contents' style={{
      width
    }}>
      <h1>{title}</h1>
      <Content contents={contents} onChange={onChange} visible={true} />
    </div>
  );
}