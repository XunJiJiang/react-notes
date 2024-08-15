import PageTemplate from '@components/page-template/index.tsx';
import markdown from './02React Reference.md?raw';

const Reference = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default Reference;
