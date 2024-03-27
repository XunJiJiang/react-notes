import Learn from '../pages/study/learn/index';
import Use from '../pages/study/react/use/index';
import UseCallback from '../pages/study/react/useCallback/index';

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
      component: Use
    }, {
      label: 'useCallback',
      path: '/useCallback',
      component: UseCallback
    }, {
      label: 'useContext',
      path: '/useContext',
      component: null
    }, {
      label: 'useDebugValue',
      path: '/useDebugValue',
      component: null
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
      tag: 'experiment',
      component: null
    }, {
      label: 'experimental_taintUniqueValue',
      path: '/experimental_taintUniqueValue',
      tag: 'experiment',
      component: null
    }]
  }, {
    label: '指示符',
    path: '/indicator',
    component: () => <h1>react 指示符</h1>,
    tag: 'experiment',
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
  children: [{
    label: 'test1',
    path: '/test1',
    component: null
  }, {
    label: 'test2',
    path: '/test2',
    children: [{
      label: 'test3',
      path: '/test3',
      component: null
    }, {
      label: 'test4',
      path: '/test4',
      component: null,
      children: [{
        label: 'test5',
        path: '/test5',
        component: null
      }]
    }]
  }]
}];

export default contents;