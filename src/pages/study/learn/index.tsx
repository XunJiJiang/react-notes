import PageTemplate from '@components/page-template/index.tsx';
import markdown from './01React Learn.md?raw';

export default function Learn() {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
}
