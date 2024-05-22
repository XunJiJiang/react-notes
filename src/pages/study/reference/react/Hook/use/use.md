# Use

> <info icon='experiment'>Canary</info>
>
> **Canary**: 预定将在下一个正式版本中启用。
>
> `use` Hook 仅在 Canary 与 experimental 渠道中可用。参阅 [React 发布渠道](https://zh-hans.react.dev/community/versioning-policy#all-release-channels)

## 使用 `use` 读取 context

工作方式类似于`useContext`

但`useContext` 必须在组件的顶层调用

`use` 可以在条件语句如 `if` 和循环如 `for` 内调用

## 将数据从服务器流式传递给客户端
