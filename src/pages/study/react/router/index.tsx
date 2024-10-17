import type { LoaderData } from '@type/modules/comp-page-template-comp-pager.d.ts';

import PageTemplate from '@components/page-template/index.tsx';
import markdown from './React Router.md?raw';
import { Suspense } from 'react';
import { Await } from 'react-router-dom';
import { useLoaderDataWithType } from '@utils/index.ts';
import Loading from '@components/loading/index.tsx';

const Router = () => {
  const loaderData = useLoaderDataWithType<{
    data: LoaderData;
  }>();
  return (
    <Suspense fallback={<Loading size={0.9} />}>
      <Await resolve={loaderData.data}>
        <PageTemplate markdown={markdown}></PageTemplate>
      </Await>
    </Suspense>
  );
};

export default Router;
