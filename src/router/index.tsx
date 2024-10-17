import type { ContentsType, ContentType } from '@type/modules/contents.d.ts';
import type { LoaderData } from '@type/modules/comp-page-template-comp-pager.d.ts';
import { RouteObject, defer } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import Root from '@/App.tsx';
import ErrorPage from './error/error-page.tsx';
import Index from './modules/indexRoute/index.tsx';
import contents from '@/contents/index.tsx';
import Home from '@layout/home/index.tsx';
import Doc from '@layout/doc/index.tsx';

type flattenReturns = Array<{
  content: ContentType;
  route: RouteObject;
}>;

const flattening = (
  contents: ContentsType,
  basePath = '',
  layer = 1
): { flattedContents: flattenReturns; layer: number } => {
  const _contents: flattenReturns = [];

  let deeperLayer = layer;

  contents.forEach((item) => {
    const _item = {
      content: item,
      route: {
        path: basePath
          ? basePath + '/' + item.path.slice(1)
          : item.path.slice(1),
        element: item.component ? (
          item.component()
        ) : (
          <h1>{item.label} 目录下没有可用的组件</h1>
        ),
        errorElement: <div>Oops! There was an error.</div>
        // loader: () => {
        //   return new Promise((res) => setTimeout(() => res(null), 0));
        // }
      }
    };
    _contents.push(_item);
    if (item.children && item.children.length !== 0) {
      const childrenFlattedContents = flattening(
        item.children,
        _item.route.path,
        layer + 1
      );
      deeperLayer = childrenFlattedContents.layer;
      _contents.push(...childrenFlattedContents.flattedContents);
    }
  });

  return {
    flattedContents: _contents,
    layer: deeperLayer
  };
};

// const createCatchRoute = (layer = 0) => {
//   const catchRoutes: RouteObject[] = [];
//   for (let i = 1; i <= layer; i++) {
//     catchRoutes.push({
//       path: Array(i).fill(`/:unknow-path`).join(''),
//       element: <ErrorPage type="NOT_FOUND" />
//     });
//   }
//   return catchRoutes;
// };

const { flattedContents /*, layer */ } = flattening(contents);

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          errorElement: <ErrorPage />,
          element: <Doc />,
          path: '/doc',
          loader: () => {
            return defer({
              data: new Promise((res) => {
                setTimeout(() => {
                  res({ contents });
                }, 0);
              })
            });
          },
          children: [
            { index: true, element: <Index /> },
            {
              errorElement: <ErrorPage />,
              children: [
                ...flattedContents.map((item, index) => {
                  const { route } = item;
                  const prev = flattedContents[index - 1] ?? {};
                  const next = flattedContents[index + 1] ?? {};
                  route.loader = () => {
                    const res = new Promise<LoaderData>((res) => {
                      setTimeout(() => {
                        // Promise.resolve().then(() => {});
                        res({
                          pages: {
                            prev: {
                              path: prev.route?.path,
                              label: prev.content?.label
                            },
                            next: {
                              path: next.route?.path,
                              label: next.content?.label
                            }
                          }
                        });
                        // 延迟过低会导致左侧目录过渡动画卡顿(过渡时常0.3s, 其他运算100-200ms)
                      }, 600);
                    });
                    return defer({
                      data: res
                    });
                  };
                  return route;
                })
              ]
            }
            // ...createCatchRoute(layer)
          ]
        }
      ]
    }
  ],
  {
    basename: '/react-notes/'
  }
);

export default router;
