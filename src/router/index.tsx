import type { ContentsType } from '@type/modules/contents.d.ts';
import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import Root from '@/App.tsx';
import ErrorPage from './error/error-page.tsx';
import Index from './modules/indexRoute/index.tsx';
import contents from '@/contents/index.tsx';

type flattenReturns = RouteObject[];

function flattening(contents: ContentsType, basePath = ''): flattenReturns {
  const _contents: flattenReturns = [];

  contents.forEach((item) => {
    const _item = {
      path: basePath ? basePath + '/' + item.path.slice(1) : item.path.slice(1),
      element: item.component ? (
        item.component()
      ) : (
        <h1>{item.label} 目录下没有可用的组件</h1>
      ),
      // errorElement: <ErrorPage />,
      loader: () => {
        return new Promise((res) => setTimeout(() => res(null), 0));
      }
    };
    _contents.push(_item);
    if (item.children && item.children.length !== 0) {
      _contents.push(...flattening(item.children, _item.path));
    }
  });

  return _contents;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Index /> },
      { path: 'error', element: <ErrorPage /> },
      ...flattening(contents)
    ]
  }
]);

export default router;
