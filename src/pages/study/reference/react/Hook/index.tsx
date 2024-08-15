import PageTemplate from '@components/page-template/index.tsx';
import markdown from './Hook.md?raw';

const Hook = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default Hook;
