import PageTemplate from '@components/page-template/index.tsx';
import markdown from './useCallback.md?raw';
import SkipRendering from './modules/skipRendering.tsx';

export default function UseCallback() {
  return (
    <>
      <PageTemplate markdown={markdown}>
        <SkipRendering />
      </PageTemplate>
    </>
  );
}
