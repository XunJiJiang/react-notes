# React Reference

**React 参考 | 笔记**

## Hook

[Hook总览](https://zh-hans.react.dev/reference/react/hooks)

### use(wait)

> <info/>
>
> **Canary**: 预定将在下一个正式版本中启用。参阅 [React 发布渠道](https://zh-hans.react.dev/community/versioning-policy#all-release-channels)

#### 使用 `use` 读取 context

### useCallback

`useCallback(fn, dependencies)`

`useCallback` 用于在多次渲染中缓存函数。

#### 安装

```jsx
import { useCallback } from 'react';
```

#### 参数

- `fn`：想要缓存的函数。此函数可以接受任何参数并且返回任何值。

  初次渲染时，React 将把函数直接返回（不是调用它）。

  进行下一次渲染时，如果 `dependencies` 相比于上一次渲染时没有改变，将会返回相同的函数。否则，将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。React 不会调用此函数，而是返回此函数。由开发者自己决定何时调用以及是否调用。

- `dependencies`：有关是否更新 `fn` 的所有响应式值的一个列表。响应式值包括 props、state，和所有在你组件内部直接声明的变量和函数。

  如果你的代码检查工具 [配置了 React](https://zh-hans.react.dev/learn/editor-setup#linting)，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像 `[dep1, dep2, dep3]` 这样编写。React 使用 [`Object.is`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 比较每一个依赖和它的之前的值。

#### 返回值

初次渲染时，`useCallback` 返回传入的 `fn` 函数

在之后的渲染中, 如果依赖没有改变，`useCallback` 返回上一次渲染中缓存的 `fn` 函数；否则返回这一次渲染传入的 `fn`。

```jsx
const handleSubmit = useCallback(
  (orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails
    });
  },
  [productId, referrer]
);
```

#### 使用

##### 跳过组件渲染

如果某个组件需要传入一个函数作为`props`，此时可以使用`useCallback`。

如果该函数的依赖没有变化，则其执行结果应当和上次执行的结果相同，那么相对应的，依赖该函数的组件将不需要重渲染。

但在组件内声明的函数在每次重渲染时都会重声明，此时函数的地址发生变化，组件会认为传入的`props`发生了变化而重渲染。

因此，使用`useCallback`缓存函数， 将组件包裹在 [`memo`](https://zh-hans.react.dev/reference/react/memo) 中，以跳过不必要的组件渲染。

##### 从记忆化回调中更新 state

```js
const [todos, setTodos] = useState([]);

const handleAddTodo = useCallback(
  (text) => {
    const newTodo = { id: nextId++, text };
    // setTodos([...todos, newTodo]);
    // ↓
    setTodos((todos) => [...todos, newTodo]);
    // 使用记忆回调, 此时todos总是最新数据
    // 此时不依赖于外部todos
    // 不需要每次todos变化时返回新的函数
  },
  /* [todos] → */ []
);
```

##### 防止频繁触发 Effect

如果需要在 [Effect](https://zh-hans.react.dev/learn/synchronizing-with-effects) 内部调用函数

函数内部有不稳定的依赖

期望在`roomId`变化时重新运行该函数

此时如果在`useEffect`依赖中添加`roomId`，`eslint`会认为`useEffect`不对其产生依赖

此时将需要调用的函数包裹在`useCallback`中，依赖中添加`roomId`，在`useEffect`依赖中添加`该函数`

当`roomId`变化时，`useCallback`返回新的函数，`useEffect`因为依赖更新而重新运行

```js
function ChatRoom({ roomId }) {

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]);

  useEffect(() => {
    createOptions();
  }, [createOptions]);
  // ...
```

> <warn icon='error'>注意</warn>
>
> 此处仅作演示
>
> **最好消除对函数依赖项的需求**
>
> 比如将函数的声明移入`useEffect`，此时将可以直接在`useEffect`的依赖中添加`roomId`

##### 优化自定义 Hook

如果要编写一个 [自定义 Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks)，建议将它返回的任何函数包裹在 `useCallback` 中，确保 Hook 的使用者在需要时能够优化自己的代码。

```js
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback(
    (url) => {
      dispatch({ type: 'navigate', url });
    },
    [dispatch]
  );

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack
  };
}
```

比如，在如下使用时，`Router`组件的重渲染不会导致`Button`组件重渲染

```jsx
const Button = memo(function ({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
});

function Router() {
  const { navigate, goBack } = useRouter();
  return (
    <>
      <Button onClick={navigate}>navigate</Button>
      <Button onClick={goBack}>goBack</Button>
    </>
  );
}
```

### useContext(wait)

> `react learn`里有一部分

### useDebugValue
