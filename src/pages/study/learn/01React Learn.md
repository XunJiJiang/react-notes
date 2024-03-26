# React Learn

**React 教程**

## 创建项目

```shell
npx create-react-app <生成的根目录名称>
```

  

`src/index.js`

```jsx
// 导入核心的两个包
import React from 'react';
import ReactDOM from 'react-dom/client';

// 导入根组件
import App from './App';

// 使用 createRoot 创建根组件
const root = ReactDOM.createRoot(document.getElementByIxd('root'));

// 渲染根组件
root.render(<App />);

```

`src/App.js`

```jsx
// 根组件
function App () {
  return (
    <div className="App">
      app
    </div>
  );
}

export default App;

```

## Jsx

### 使用 JSX 编写标签 

必须将组件包裹到一个共享的父级中，比如 `<div>...</div>` 或使用空的 `<>...</>`

```jsx
export function Jsx () {
  return (
    <>
      <h1 className='123'>Jsx</h1>
    </>
  );
}

export function JsxInDiv () {
  return (
    <div>
      <h1>JsxInDiv</h1>
    </div>
  );
}
```

### 添加样式 

使用 `className` 来指定一个 CSS 的 class

与 HTML 的 [`class`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Global_attributes/class) 属性的工作方式相同

```jsx
import './002Style.css'

export default function Style () {
  return <div className='style-002'>Style</div>;
}
```

### 显示数据 

```jsx
export default function Data () {
  return (
    <div any={'任意属性的值'}>{'任何js语句'}</div>
  );
}
```

### 条件渲染

```jsx
export default function If () {
  const condition = true;
  return (
    <div>
      {condition ? <div>条件为真</div> : <div>条件为假</div>}
      if语句同理
    </div>
  );
}
```

### 渲染列表 

使用`for`和`Array.map`渲染组件列表

渲染的子标签必须传递一个字符串或者数字给 `key`，用于在其兄弟节点中唯一标识该元素。否则报错

```jsx
export default function List () {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div>
      {arr.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}
```

### 响应事件

通过在组件中声明 **事件处理** 函数来响应事件：

```jsx
export default function MyButton () {
  function handleClick () {
    console.log('Button clicked');
  }
  return (
    <button onClick={handleClick}>Click me</button>
  );
}
```

## 基础Hook(状态管理)

### 更新界面

在你组件中添加 **state**。

```js
import { useState } from 'react';
```

在组件中声明一个 **state 变量**

> React Hooks 必须在 React 函数组件或自定义 React Hook 的 **顶层** 中调用

```jsx
function Example () {
  //声明一个 state 变量, 默认值为 0
  const [count, setCount] = useState(0);

  // 声明一个叫做 handleClick 的函数
  function handleClick () {
    setCount(count + 1);
  }

  // 返回一个按钮, 点击按钮时调用 handleClick 函数, 并显示 count 的值
  // 当 setCount 被调用时, React 会重新渲染 Example 组件
  return <button onClick={handleClick}>You clicked {count} times</button>;
}
```

#### State 批处理

React 会对 state 更新进行批处理，因此如下使用时，并不会每次加3

```jsx
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

因为setNumber调用后number没有立刻修改，而是会等待本次事件结束后一次性修改值、渲染新数据

##### 通过函数修改state

如果你想在下次渲染之前多次更新同一个 state，可以给 state 的修改函数传入一个函数

```js
setNumber(n => n + 1)
```

这样传入一个根据队列中的前一个 state 计算下一个 state 的 **函数**

##### 使用flushSync API强制同步更新数据与DOM

如果你想在本次事件结束前使用修改后的数据，可以使用`flushSync API`

```js
flushSync(() => {
  setNumber(number + 1);
});
```

这将指示 React 当封装在 `flushSync` 中的代码执行后，立即同步更新 DOM

### 使用Hook

[`Code`](./code/react-basic/src/components/0008Hook.js)

以 `use` 开头的函数被称为 **Hook**

`useState` 是 React 提供的一个内置 Hook

在 [React API 参考](https://zh-hans.react.dev/reference/react) 中找到其他内置的 Hook

可以通过组合现有的 Hook 编写新的 Hook。

Hook 比普通函数更严格。只能在组件（或其他 Hook）的 **顶层** 调用 Hook

### 组件间共享数据 

[`Code`](./code/react-basic/src/components/0009ShareHook.js)

将各个按钮的 state “向上” 移动到最接近包含所有按钮的组件中

将 `ShareHook` 中的点击事件处理函数以及 **state 一同向下传递到** 每个 `Child` 中

```jsx
function Child1 (props) {
  // 通过 props 获取父组件传递过来的状态和操作状态的函数
  return <button onClick={props.onClick}>Child1 {props.count}</button>;
}

function Child2 ({ count, onClick: handleClick }) {
  // 通过解构赋值获取父组件传递过来的状态和操作状态的函数
  return <button onClick={handleClick}>Child2 {count}</button>;
}

export default function ShareHook () {
  // 将需要共享的状态提升到父组件中
  const [count, setCount] = useState(0);

  function handleAdd () {
    setCount(count + 1);
  }
  // 将状态和操作状态的函数通过 props 传递给子组件
  return (
    <div>
      <Child1 count={count} onClick={handleAdd} />
      <Child2 count={count} onClick={handleAdd} />
    </div>
  );
}
```

当点击任何一个按钮时，`ShareHook` 中的 `count` 都将改变

使用这种方式传递的信息被称作 **prop**。此时 `ShareHook` 组件包含了 `count` state 以及 `handleClick` 事件处理函数，并将它们作为 **prop 传递给** 了每个按钮。

当点击按钮时，`onClick` 处理程序启动。`handleClick`函数内的代码会被执行。该代码会调用 `setCount(count + 1)`，使得 state 变量 `count` 递增。新的 `count` 值会被作为 prop 传递给每个按钮，因此它们每次展示的都是最新的值。

这被称为**状态提升**。

### Reducer

[`Code`](./code/react-basic/src/components/0010Reducer.js)

```jsx
import { useReducer } from 'react';

// useReducer接受两个参数，第一个是开发者创建的reducer函数，第二个是初始值
// 返回一个数组，第一个元素是state，第二个元素是dispatch函数

// 开发者创建的reducer函数需要接受两个参数，第一个是state，第二个是action
// 返回一个新的state，而不是修改然后返回原来的state
function MyReducer (state, action) {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      throw new Error();
  }
}

export default function Reducer () {
  // useReducer接受两个参数，第一个是开发者创建的reducer函数，第二个是初始值
  const [state, dispatch] = useReducer(MyReducer, 0);

  function handleIncrement () {
    // dispatch函数接受一个action对象
    // 并且会将这个action对象传递给reducer函数
    // 通过reducer函数返回的新state，来更新state
    dispatch({ type: 'increment' });
  }

  function handleDecrement () {
    dispatch({ type: 'decrement' });
  }

  return (
    <div>
      {state}
      <button onClick={handleIncrement}>+</button>
      <button onClick={handleDecrement}>-</button>
    </div>
  );
}
```

必须在所有使用reducer数据的组件的`共同顶级组件`中使用`useReducer`获取数据及其处理函数，

当其子组件需要使用和修改reducer的数据时，通过`props`或配合`Context`向下传递给子组件，否则可能不会更新数据

#### 使用 Immer 简化 reducers

可以使用 [`Immer`](https://github.com/immerjs/use-immer#useimmerreducer)这个库来简化 

```shell
npm install immer
```

此时，若值为数组，则`reducer函数`的第一个参数对象将会是经由`Immer`代理过的，

可以通过 `push` 或 `arr[i] =` 来修改 `state`，就像修改数组一样，

此时则不需要返回修改后的值。

若没有使用`Immer`代理的方法，则仍需要返回修改后的结果。

```jsx
import { useImmerReducer } from 'use-immer';
import { [reducer函数] } from '[路径]';
const [tasks, dispatch] = useImmerReducer([reducer函数],[初始值]);
```



### Context

[`Code`](./code/react-basic/src/components/0011Context.js)

```jsx
import { createContext, useContext } from 'react';

// 只需默认值一个参数
const MyContext = createContext(0);

// 子组件通过useContext获取对应Context的值
function Child ({ children }) {
  const value = useContext(MyContext);
  return <><p>value: {value}</p>{ children }</>;
}

// 父组件通过MyContext.Provider提供对应Context的值
// 通过嵌套的方式，可以在任意层级的子组件中获取到对应的值
export default function Context () {
  return (
    <div>
      <MyContext.Provider value={42}>
        <Child>
          <Child>
            <Child>
              <Child>
                <Child />
              </Child>
            </Child>
          </Child>
        </Child>
      </MyContext.Provider>
    </div>
  );
}
```

#### 使用 Reducer 和 Context 拓展你的应用

Reducer 可以整合组件的状态更新逻辑

Context 可以将信息深入传递给其他组件

组合使用它们来共同管理一个复杂页面的状态

1. **创建** context。
2. 将 state 和 dispatch **放入** context。
3. 在组件树的任何地方 **使用** context。

## 脱围机制

### 使用 ref 引用值 

[`code`](./code/react-basic/src/components/0012Ref_data.js)

```jsx
import { useRef, useState } from 'react';

export default function Counter () {
  // ref和state的都可以保存数据，而ref保存的数据修改时不会触发组件重新渲染
  const ref = useRef(0);
  // 直接定义的变量，每次重新渲染都会重新定义，所以不会保存数据
  let directCount = 0;

  function handleClick() {
    ref.current = ref.current + 1;
    directCount = directCount + 1;
    console.log('ref: ' + ref.current, 'directCount: ' + directCount);
  }

  const [count, setCount] = useState(0);
  function redraw() {
    setCount(count + 1);
  }

  return (
    <>
      <h1>Ref Data</h1>
      <div>上次重渲染时点击次数: {ref.current}</div>
      <button onClick={handleClick}>
        增加点击次数
      </button>
      <button onClick={redraw}>
        重新渲染
      </button>
    </>
  );
}
```

### 使用 ref 操作 DOM

[`code`](./code/react-basic/src/components/0013Ref_DOM.js)

#### 对于浏览器元素的内置组件

在组件中使用`useRef`声明一个 `ref`

```js
const inputRef = useRef(null);
```

将 ref 作为 `ref` 属性值传递给想要获取的 DOM 节点的 JSX 标签

```jsx
<input ref={inputRef} />
```

React 会把对该节点的引用放入 `inputRef.current`

```jsx
export default function Ref_DOM () {
  const inputRef = useRef(null);
  function handleClick() {
    inputRef.current.focus();
  }
  return <>
    <h1>Ref DOM</h1>
    <input ref={inputRef} />
    <button onClick={handleClick}>获取焦点</button>
  </>;
}
```



另一种用法是**将函数传递给 `ref` 属性**。

这称为 [`ref` 回调](https://zh-hans.react.dev/reference/react-dom/components/common#ref-callback)

```jsx
export function RefDOM2 () {
  return <>
    <h1>Ref DOM2</h1>
    <div ref={(node) => {
      console.log('RefDOM2', node);
    }}></div>
  </>
}
```

当节点被渲染到页面时，

通常与`useRef`、`Map`或`数组`配合使用

当获取列表渲染节点时，通常与列表的`key` 和`Map`使用

#### 对于自己的组件

React 不允许组件访问其他组件的 DOM 节点

**想要** 暴露其 DOM 节点的组件必须**选择**该行为

使用 `forwardRef API` 声明的组件会接受第二个参数为`ref`

```jsx
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

这样`MyInput`将会将其接收到的`ref`传入

```jsx
<MyInput ref={inputRef} />
```

将低级组件（如按钮、输入框等）的 ref 转发到它们的 DOM 节点是一种常见模式

另一方面，像表单、列表或页面段落这样的高级组件通常不会暴露它们的 DOM 节点，以避免对 DOM 结构的意外依赖

##### 使用命令句柄`useImperativeHandle`暴露部分 API 

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';
```

```jsx
const MyInput = forwardRef((props, ref) => {
  // 使用内部useRef获取真正节点
  const realInputRef = useRef(null);
  // 使用useImperativeHandle API，这将使得传给ref的内容可以控制
  // ref.current 将被设置为以下对象
  useImperativeHandle(ref, () => ({
    // 将focus传给ref
    focus() {
      realInputRef.current.focus();
    },
    myFunction() {
      // 任意操作
    },
    // 任意值
    myData: null
  }));
  return <input {...props} ref={realInputRef} />;
});
```

### 使用 Effect 同步

[`code`](./code/react-basic/src/components/0014Effect.js)

```jsx
function MyComponent() {
  useEffect(() => {
    // 每次渲染后都会执行此处的代码
  });
  return <div />;
}
```

**更多时候，并不需要每次渲染后都执行 Effect**

- 有时这会拖慢运行速度
- 有时这会导致程序逻辑错误。例如，组件的淡入动画只需要在第一轮渲染出现时播放一次，而不是每次触发新一轮渲染后都播放。

此时应该将`Effect`的依赖数据放入一个数组中，将这个数组传入`useEffect`的第二个参数

当且仅当依赖的数据有任意一项与上次渲染时的值不同时，会运行`Effect`

> 对于 `不同` ，此处使用的是值的比较（使用 `Object.is` 进行比较），如果传入的依赖是一个对象，当对象内的属性值改变时，将不会认为该对象发生变化
>
> 如果`Effect`内确实依赖的这个对象，即使这个对象在声明时使用的是`const`，linter也可能不会报错，但`Effect`并不会运行

如果第二个参数是空数组，则`Effect`只会在组件挂载后执行

> 有时有些数据对于依赖不是必须的
>
> 如果在忽略某个依赖项时 linter 不会报错，那么这么做就是安全的
>
> 如果 linter 报错或警告，那么最好还是加上这项依赖

**有些时候，想在节点卸载时运行一些其他收尾操作**

可以在 Effect 中返回一个 **清理（cleanup）** 函数。

```js
useEffect(() => {
  // ...
  return () => {
    // cleanup 函数
  };
}, /* ... */);
```

每次重新执行 Effect 之前，React 都会调用清理函数；

组件被卸载时，也会调用清理函数。



> 对于没有逻辑联系的Effect，最好将它们拆分在不同的Effect里，即使它们有相同的依赖
>
> 不要将内聚的逻辑拆分为多个独立的Effect，这可能会提升维护难度
