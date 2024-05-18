import type { TestProps } from '../types/skipRendering.d.ts';

import React from 'react';

const Test = React.memo(({ testHandler, isUseCallback }: TestProps) => {
  const title = isUseCallback ? 'useCallback' : 'not useCallback';
  testHandler(title);
  return (
    <div>
      <p>{title}</p>
    </div>
  );
});

function SkipRendering() {
  const [a, setA] = React.useState(1);
  const [b] = React.useState(
    new (class B {
      b = 1;
    })()
  );
  const testHandler = (title: string) => {
    console.log(title, '重新渲染', ';use state:', b);
  };
  const testHandlerUseCallback = React.useCallback(
    (title: string) => {
      console.log(title, '重新渲染', ';use state:', b);
    },
    [b]
  );
  const [count, setCount] = React.useState(0);
  const render = () => {
    console.log('重新渲染', '渲染次数:', a);
    setA(a + 1);
    setCount(count + 1);
  };
  return (
    <>
      <button onClick={render}>重新渲染</button>
      <Test testHandler={testHandler} isUseCallback={false} />
      <Test testHandler={testHandlerUseCallback} isUseCallback={true} />
    </>
  );
}

export default SkipRendering;
