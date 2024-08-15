import PageTemplate from '@components/page-template/index.tsx';
import markdown from './React.md?raw';

const ReactNote = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default ReactNote;
