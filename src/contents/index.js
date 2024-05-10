import {
/* import contents in contents.js start */
  Learn,
  Reference,
  Use,
  UseCallback,
  UseDebugValue,
  Router,
/* import contents in contents.js end */
} from './contents.js';


// import Icon from '@components/icon/index';

/* contents assignment start */
const contents = [{
  label: 'react learn',
  path: '/learn',
  component: () => <h1>react learn</h1>,
  children: [{
    label: 'react',
    path: '/react',
    component: () => <Learn />,
  }]
}, {
  label: 'react reference',
  path: '/reference',
  component: () => <h1>react reference</h1>,
  children: [{
    label: 'all',
    path: '/all',
    component: () => <Reference />,
  }, {
    label: 'react@18.2.0',
    path: '/react@18.2.0',
    component: () => <h1>react@18.2.0</h1>,
    children: [{
      label: 'Hook',
      path: '/hook',
      component: () => <h1>react Hook</h1>,
      children: [{
        label: 'use',
        path: '/use',
        tag: {
          icon: 'experiment',
        },
        component: () => <Use />
      }, {
        label: 'useCallback',
        path: '/useCallback',
        component: () => <UseCallback />
      }, {
        label: 'useContext',
        path: '/useContext',
        component: null
      }, {
        label: 'useDebugValue',
        path: '/useDebugValue',
        component: () => <UseDebugValue />
      }, {
        label: 'useEffect',
        path: '/useEffect',
        component: null
      }, {
        label: 'useId',
        path: '/useId',
        component: null
      }, {
        label: 'useImperativeHandle',
        path: '/useImperativeHandle',
        component: null
      }, {
        label: 'useInsertionEffect',
        path: '/useInsertionEffect',
        component: null
      }, {
        label: 'useLayoutEffect',
        path: '/useLayoutEffect',
        component: null
      }, {
        label: 'useMemo',
        path: '/useMemo',
        component: null
      }, {
        label: 'useOptimistic',
        path: '/useOptimistic',
        component: null
      }, {
        label: 'useReducer',
        path: '/useReducer',
        component: null
      }, {
        label: 'useRef',
        path: '/useRef',
        component: null
      }, {
        label: 'useState',
        path: '/useState',
        component: null
      }, {
        label: 'useSyncExternalStore',
        path: '/useSyncExternalStore',
        component: null
      }, {
        label: 'useTransition',
        path: '/useTransition',
        component: null
      }]
    }, {
      label: '组件',
      path: '/component',
      component: () => <h1>react 组件</h1>,
      children: [{
        label: '<Fragment>(<>)',
        path: '/fragment',
        component: null
      }, {
        label: '<Profiler>',
        path: '/profiler',
        component: null
      }, {
        label: '<StrictMode>',
        path: '/strictMode',
        component: null
      }, {
        label: '<Suspense>',
        path: '/suspense',
        component: null
      }]
    }, {
      label: 'API',
      path: '/api',
      component: () => <h1>react API</h1>,
      children: [{
        label: 'cache',
        path: '/cache',
        component: null
      }, {
        label: 'createContext',
        path: '/createContext',
        component: null
      }, {
        label: 'forwardRef',
        path: '/forwardRef',
        component: null
      }, {
        label: 'lazy',
        path: '/lazy',
        component: null
      }, {
        label: 'memo',
        path: '/memo',
        component: null
      }, {
        label: 'startTransition',
        path: '/startTransition',
        component: null
      }, {
        label: 'experimental_taintObjectReference',
        path: '/experimental_taintObjectReference',
        tag: {
          icon: 'experiment',
        },
        component: null
      }, {
        label: 'experimental_taintUniqueValue',
        path: '/experimental_taintUniqueValue',
        tag: {
          icon: 'experiment',
        },
        component: null
      }]
    }, {
      label: '指示符',
      path: '/indicator',
      component: () => <h1>react 指示符</h1>,
      tag: {
        icon: 'experiment',
      },
      children: [{
        label: 'use client',
        path: '/client',
        component: null
      }, {
        label: 'use server',
        path: '/server',
        component: null
      }]
    }]
  }, {
    label: 'react-dom@18.2.0',
    path: '/react-dom@18.2.0',
    component: () => <h1>react-dom@18.2.0</h1>,
    children: []
  }]
}, {
  label: 'react-router',
  path: '/router',
  component: () => <h1>react-router</h1>,
  children: [{
    label: 'react router',
    path: '/react-router',
    component: () => <Router />,
  }]
}];
/* contents assignment end */

export default contents;