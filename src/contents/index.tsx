import {
  Comp_0_0,
  Comp_1_1,
  Comp_2_2,
  Comp_3_3,
  Comp_4_4,
  Comp_5_5,
  Comp_6_6,
  Comp_7_7,
  Comp_8_8,
  Comp_9_9,
  Comp_10_10,
  Comp_11_11,
  Comp_12_12,
  Comp_13_13,
  Comp_14_14,
  Comp_15_15,
  Comp_16_16
} from './contents.tsx';

const contents = [
  {
    label: 'react',
    path: '/react',
    entryFilePath: '/pages/study/react/index.tsx',
    icon: null,
    tag: null,
    component: () => <Comp_0_0 />,
    childrenSort: {
      learn: 0,
      reference: 1,
      router: 2
    },
    children: [
      {
        label: 'react learn',
        path: '/learn',
        entryFilePath: '/pages/study/react/learn/index.tsx',
        icon: null,
        tag: null,
        component: () => <Comp_1_1 />,
        childrenSort: {
          twitter: 0,
          Youtube: 1,
          windows: 2,
          apple: 3,
          chrome: 4,
          HTML: 5,
          google: 6
        },
        children: [
          {
            label: 'twitter',
            path: '/twitter',
            entryFilePath: '/pages/study/react/learn/twitter/index.tsx',
            icon: 'twitter',
            tag: {
              icon: 'twitter'
            },
            component: () => <Comp_2_2 />,
            childrenSort: {}
          },
          {
            label: 'Youtube',
            path: '/Youtube',
            entryFilePath: '/pages/study/react/learn/Youtube/index.tsx',
            icon: 'Youtube',
            tag: {
              icon: 'Youtube-fill'
            },
            component: () => <Comp_3_3 />,
            childrenSort: {}
          },
          {
            label: 'windows',
            path: '/windows',
            entryFilePath: '/pages/study/react/learn/windows/index.tsx',
            icon: 'windows-fill',
            tag: null,
            component: () => <Comp_4_4 />,
            childrenSort: {}
          },
          {
            label: 'apple',
            path: '/apple',
            entryFilePath: '/pages/study/react/learn/apple/index.tsx',
            icon: 'apple-fill',
            tag: {
              icon: 'apple-fill'
            },
            component: () => <Comp_5_5 />,
            childrenSort: {}
          },
          {
            label: 'chrome',
            path: '/chrome',
            entryFilePath: '/pages/study/react/learn/chrome/index.tsx',
            icon: 'chrome-fill',
            tag: null,
            component: () => <Comp_6_6 />,
            childrenSort: {}
          },
          {
            label: 'HTML',
            path: '/HTML',
            entryFilePath: '/pages/study/react/learn/HTML/index.tsx',
            icon: 'HTML-fill',
            tag: null,
            component: () => <Comp_7_7 />,
            childrenSort: {}
          },
          {
            label: 'google',
            path: '/google',
            entryFilePath: '/pages/study/react/learn/google/index.tsx',
            icon: 'google',
            tag: null,
            component: () => <Comp_8_8 />,
            childrenSort: {}
          }
        ]
      },
      {
        label: 'react reference',
        path: '/reference',
        entryFilePath: '/pages/study/react/reference/index.tsx',
        icon: null,
        tag: null,
        component: () => <Comp_9_9 />,
        childrenSort: {
          react: 0
        },
        children: [
          {
            label: 'react@18.2.0',
            path: '/react@18.2.0',
            entryFilePath: '/pages/study/react/reference/react/index.tsx',
            icon: null,
            tag: null,
            component: () => <Comp_10_10 />,
            childrenSort: {
              Hook: 0
            },
            children: [
              {
                label: 'Hook',
                path: '/Hook',
                entryFilePath:
                  '/pages/study/react/reference/react/Hook/index.tsx',
                icon: null,
                tag: null,
                component: () => <Comp_11_11 />,
                childrenSort: {
                  use: 0,
                  useCallback: 1,
                  useDebugValue: 2
                },
                children: [
                  {
                    label: 'use',
                    path: '/use',
                    entryFilePath:
                      '/pages/study/react/reference/react/Hook/use/index.tsx',
                    icon: null,
                    tag: {
                      icon: 'experiment'
                    },
                    component: () => <Comp_12_12 />,
                    childrenSort: {}
                  },
                  {
                    label: 'useCallback',
                    path: '/useCallback',
                    entryFilePath:
                      '/pages/study/react/reference/react/Hook/useCallback/index.tsx',
                    icon: null,
                    tag: null,
                    component: () => <Comp_13_13 />,
                    childrenSort: {}
                  },
                  {
                    label: 'useDebugValue',
                    path: '/useDebugValue',
                    entryFilePath:
                      '/pages/study/react/reference/react/Hook/useDebugValue/index.tsx',
                    icon: null,
                    tag: null,
                    component: () => <Comp_14_14 />,
                    childrenSort: {}
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
        entryFilePath: '/pages/study/react/router/index.tsx',
        icon: null,
        tag: null,
        component: () => <Comp_15_15 />,
        childrenSort: {}
      }
    ]
  },
  {
    label: 'rust',
    path: '/rust',
    entryFilePath: '/pages/study/rust/index.tsx',
    icon: null,
    tag: null,
    component: () => <Comp_16_16 />,
    childrenSort: {}
  }
];

export default contents;
