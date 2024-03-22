import './index.css';
import Content from './components/content';

export default function Contents ({ title = '目录', contents = [], onChange = () => {} }) {
  /**
   * 计算目录的宽度
   */
  const width = ((() => {
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
    // 每深一层，增加28px
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