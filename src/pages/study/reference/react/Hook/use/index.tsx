import PageTemplate from '@components/page-template/index.tsx';
import markdown from './use.md?raw';

export default function Use() {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
}
