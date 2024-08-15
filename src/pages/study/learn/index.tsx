import PageTemplate from '@components/page-template/index.tsx';
import markdown from './01React Learn.md?raw';

const Learn = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default Learn;
