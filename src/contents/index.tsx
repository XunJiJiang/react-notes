import {
  CompLearn0,
  CompReference1,
  CompUse2,
  CompUseCallback3,
  CompUseDebugValue4,
  CompRouter5,
} from './contents.tsx';

const contents = [
  {
    label: 'react learn',
    path: '/learn',
    entryFilePath: '/pages/study/learn/index.tsx',
    icon: null,
    tag: null,
    component: () => <CompLearn0 />,
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
        component: () => <h1>react@18.2.0</h1>,
        children: [
          {
            label: 'Hook',
            path: '/Hook',
            entryFilePath: '/pages/study/reference/react/Hook/index.tsx',
            icon: null,
            tag: null,
            component: () => <h1>react Hook</h1>,
            children: [
              {
                label: 'use',
                path: '/use',
                entryFilePath: '/pages/study/reference/react/Hook/use/index.tsx',
                icon: null,
                tag: {
                  icon: 'experiment',
                },
                component: () => <CompUse2 />,
              },
              {
                label: 'useCallback',
                path: '/useCallback',
                entryFilePath: '/pages/study/reference/react/Hook/useCallback/index.tsx',
                icon: null,
                tag: null,
                component: () => <CompUseCallback3 />,
              },
              {
                label: 'useDebugValue',
                path: '/useDebugValue',
                entryFilePath: '/pages/study/reference/react/Hook/useDebugValue/index.tsx',
                icon: null,
                tag: null,
                component: () => <CompUseDebugValue4 />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'react router',
    path: '/router',
    entryFilePath: '/pages/study/router/index.tsx',
    icon: null,
    tag: null,
    component: () => <CompRouter5 />,
  },
];

export default contents;
