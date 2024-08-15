import PageTemplate from '@components/page-template/index.tsx';
import markdown from './React Router.md?raw';

const Router = () => {
  return (
    <>
      <PageTemplate markdown={markdown}></PageTemplate>
    </>
  );
};

export default Router;
