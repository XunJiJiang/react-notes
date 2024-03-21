import Use from '../pages/study/react/use/index';
import UseCallback from '../pages/study/react/useCallback/index';

const contents = [{
  label: 'react@18.2.0',
  children: [{
    label: 'Hook',
    children: [{
      label: 'use',
      component: Use
    }, {
      label: 'useCallback',
      component: UseCallback
    }, {
      label: 'useContext',
      component: null
    }, {
      label: 'useDebugValue',
      component: null
    }, {
      label: 'useEffect',
      component: null
    }, {
      label: 'useId',
      component: null
    }, {
      label: 'useImperativeHandle',
      component: null
    }, {
      label: 'useInsertionEffect',
      component: null
    }, {
      label: 'useLayoutEffect',
      component: null
    }, {
      label: 'useMemo',
      component: null
    }, {
      label: 'useOptimistic',
      component: null
    }, {
      label: 'useReducer',
      component: null
    }, {
      label: 'useRef',
      component: null
    }, {
      label: 'useState',
      component: null
    }, {
      label: 'useSyncExternalStore',
      component: null
    }, {
      label: 'useTransition',
      component: null
    }]
  }, {
    label: '组件',
    children: [{
      label: '<Fragment>(<>)',
      component: null
    }, {
      label: '<Profiler>',
      component: null
    }, {
      label: '<StrictMode>',
      component: null
    }, {
      label: '<Suspense>',
      component: null
    }]
  }, {
    label: 'API',
    children: [{
      label: 'cache',
      component: null
    }, {
      label: 'createContext',
      component: null
    }, {
      label: 'forwardRef',
      component: null
    }, {
      label: 'lazy',
      component: null
    }, {
      label: 'memo',
      component: null
    }, {
      label: 'startTransition',
      component: null
    }, {
      label: 'experimental_taintObjectReference',
      tag: 'experiment',
      component: null
    }, {
      label: 'experimental_taintUniqueValue',
      tag: 'experiment',
      component: null
    }]
  }, {
    label: '指示符',
    tag: 'experiment',
    children: [{
      label: 'use client',
      component: null
    }, {
      label: 'use server',
      component: null
    }]
  }]
}, {
  label: 'react-dom@18.2.0',
  children: [{
    label: 'test1',
    component: null
  }, {
    label: 'test2',
    children: [{
      label: 'test3',
      component: null
    }, {
      label: 'test4',
      component: null
    }]
  }]
}];

export default contents;