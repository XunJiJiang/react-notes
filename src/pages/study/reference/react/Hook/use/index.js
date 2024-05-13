import PageTemplate from '@components/page-template/index.js';
import markdown from './use.md';

export default function Use () {
  return (
    <>
      <PageTemplate markdown={markdown}>
      </PageTemplate>
    </>
  )
}