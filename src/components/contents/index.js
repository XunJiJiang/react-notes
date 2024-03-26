import './index.css';
import Content from './components/content';

/**
 * 获取目录的最深层级
 * @param {{
 *   component: any | null | undefined,
 *   children: contents | undefined,
 *   label: string,
 *   tag: string | undefined
 * }[]} contents
 * @returns 
 */
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

export default function Contents ({ title = '目录', contents = [], onChange = () => {} }) {
  /** 目录的宽度 */
  const width = ((() => {
    // 每深一层，增加28px
    return 150 + 44 + 28 * getDeepestLayer(contents) - 1 + 'px';
  })());
  return (
    <div
      className='contents'
      style={{
        width
      }}
    >
      <h1>{title}</h1>
      <nav>
        <ul>
          <Content
            contents={contents}
            visible={true}
            layer={getDeepestLayer(contents) - 1}
            onChange={onChange}
          />
        </ul>
      </nav>
    </div>
  );
}