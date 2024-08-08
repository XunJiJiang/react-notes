import {
  CompLearn0,
  CompReference1,
  CompReact18202,
  CompHook3,
  CompUse4,
  CompUseCallback5,
  CompUseDebugValue6,
  CompRouter7
} from './contents.tsx';

const contents = [
  {
    label: 'react learn',
    path: '/learn',
    entryFilePath: '/pages/study/learn/index.tsx',
    icon: null,
    tag: null,
    component: () => <CompLearn0 />
  },
  {
    label: 'react reference',
    path: '/reference',
    entryFilePath: '/pages/study/reference/index.tsx',
    icon: null,
    tag: null,
    component: () => <CompReference1 />,
    children: [
      {
        label: 'react@18.2.0',
        path: '/react@18.2.0',
        entryFilePath: '/pages/study/reference/react/index.tsx',
        icon: null,
        tag: null,
        component: () => <CompReact18202 />,
        children: [
          {
            label: 'Hook',
            path: '/Hook',
            entryFilePath: '/pages/study/reference/react/Hook/index.tsx',
            icon: null,
            tag: null,
            component: () => <CompHook3 />,
            children: [
              {
                label: 'use',
                path: '/use',
                entryFilePath:
                  '/pages/study/reference/react/Hook/use/index.tsx',
                icon: null,
                tag: {
                  icon: 'experiment'
                },
                component: () => <CompUse4 />
              },
              {
                label: 'useCallback',
                path: '/useCallback',
                entryFilePath:
                  '/pages/study/reference/react/Hook/useCallback/index.tsx',
                icon: null,
                tag: null,
                component: () => <CompUseCallback5 />
              },
              {
                label: 'useDebugValue',
                path: '/useDebugValue',
                entryFilePath:
                  '/pages/study/reference/react/Hook/useDebugValue/index.tsx',
                icon: null,
                tag: null,
                component: () => <CompUseDebugValue6 />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'react router',
    path: '/router',
    entryFilePath: '/pages/study/router/index.tsx',
    icon: null,
    tag: null,
    component: () => <CompRouter7 />
  }
];

export default contents;
