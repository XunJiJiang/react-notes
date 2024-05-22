import PageTemplate from '@components/page-template/index.tsx';
import markdown from './02React Reference.md?raw';

export default function Reference() {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
}
