import PageTemplate from '@components/page-template/index.tsx';
import markdown from './useCallback.md?raw';
import SkipRendering from './modules/skipRendering.tsx';

const UseCallback = () => {
  return (
    <>
      <PageTemplate markdown={markdown}>
        <SkipRendering />
      </PageTemplate>
    </>
  );
};

export default UseCallback;
