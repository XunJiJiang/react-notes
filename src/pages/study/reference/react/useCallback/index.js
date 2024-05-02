import PageTemplate from '@components/page-template/index';
import markdown from './useCallback.md';
import SkipRendering from './modules/skipRendering';


export default function UseCallback () {
  return (
    <>
      <PageTemplate markdown={markdown}>
        <SkipRendering />
      </PageTemplate>
    </>
  )
}


