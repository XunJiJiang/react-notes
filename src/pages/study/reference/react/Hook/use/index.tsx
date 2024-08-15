import PageTemplate from '@components/page-template/index.tsx';
import markdown from './use.md?raw';

const Component = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default Component;
