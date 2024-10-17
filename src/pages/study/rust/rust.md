# rust

**安装**

网上查

**更新**

```shell
rustup update
```

## 编译运行单个文件

main.rs

```rust
fn main() {
    println!("Hello world!");
}
```

```shell
# 编译
rustc .\main.rs

# 运行
.\main.exe
```

`main`函数作为入口函数，没有参数和返回值

函数体被包裹在 {} 中。Rust 要求所有函数体都要用花括号包裹起来

将左花括号与函数声明置于同一行并以空格分隔，是良好的代码风格

`println!`调用了一个Rust宏(macro)，如果希望调用函数，则没有`!`

宏与函数是两个钙概念，当出现`!`符号，则是在调用宏而不是函数

分号代表一个表达式的结束，下一个表达式的开始

## Cargo

Cargo是rust的构建系统和包(依赖)管理器

### 使用Cargo创建项目

```shell
# 新建了名为 hello_cargo 的目录和项目，并且自动创建git初始化
cargo new hello_cargo
cd hello_cargo
```

```tree
hello_cargo
  | src
  | | main.rs
  | Cargo.toml
```

TOML是Cargo配置文件的格式
[package]：片段标题
name: 项目名
version：项目版本
edition：rust版本

[dependencies]：项目依赖片段的开始

Cargo 期望源文件存放在 src 目录

根目录只存放 README、license 信息、配置文件和其他跟代码无关的文件

**构建项目**

```rust
cargo build
```

这个命令会创建一个可执行文件 target/debug/hello_cargo （在 Windows 上是 target\debug\hello_cargo.exe），而不是放在目前目录下

**构建同时运行**

```shell
# 这个命令将会在构建后直接运行
cargo run
```

**检查代码是否可编译**

```shell
# 检查代码以确保其可以编译，不产生可执行文件
# 比build快得多
cargo chcek
```

**构建发布(release)**

```shell
# 生成优化编译项目
cargo build --release
```

在 _target/release_ 而不是 _target/debug_ 下生成可执行文件

## 常见编程概念

### 变量和可变性

变量默认是不可变的

```rust
let x = 5;
```

通过添加`mut`使其可变，但类型不可变

```rust
let mut x = 5;
```

#### 变量解构

```rust
fn main() {
  let (a, mut b): (bool,bool) = (true, false);
  // a = true,不可变; b = false，可变
  println!("a = {:?}, b = {:?}", a, b);

  b = true;
  assert_eq!(a, b);
}
```

#### 常量

不允许对常量使用 `mut`

_必须_ 注明值的类型

```rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

Rust 对常量的命名约定是在单词之间使用全大写加下划线

#### 隐藏

可以定义一个与之前变量同名的新变量，称之为第一个变量被第二个 **隐藏(Shadowing)**

```rust
fn main() {
  let x = 5; // 将 x 绑定到值 5 上

  let x = x + 1; // 通过 let x = 创建了一个新变量

  {
    // 花括号创建的内部作用域内，隐藏了 x 并创建了一个新的变量
    let x = x * 2;
    println!("The value of x in the inner scope is: {x}");
  }

  println!("The value of x is: {x}");
}
```

再次使用 `let` 时，可以使用与之前的值不同的类型

### 数据类型

两类数据类型子集：标量（scalar）和复合（compound）

#### 标量类型

**标量**（_scalar_）类型代表一个单独的值

四种基本的标量类型：整型、浮点型、布尔类型、字符类型

##### 整型

整型是一个没有小数部分的数字

| 长度    | 有符号  | 无符号  |
| ------- | ------- | ------- |
| 8-bit   | `i8`    | `u8`    |
| 16-bit  | `i16`   | `u16`   |
| 32-bit  | `i32`   | `u32`   |
| 64-bit  | `i64`   | `u64`   |
| 128-bit | `i128`  | `u128`  |
| arch    | `isize` | `usize` |

`isize` 和 `usize` 类型依赖运行程序的计算机架构：64 位架构上它们是 64 位的，32 位架构上它们是 32 位的。

可以是多种数字类型的数字字面值允许使用类型后缀

`57u8` 表示值为`57`，类型为`u8`

允许使用 `_` 做为分隔符以方便读数

`1_000` 表示`1000`

`0b1111_0000`表示`0b11110000`

| 数字字面值                    | 例子          |
| ----------------------------- | ------------- |
| Decimal (十进制)              | `98_222`      |
| Hex (十六进制)                | `0xff`        |
| Octal (八进制)                | `0o77`        |
| Binary (二进制)               | `0b1111_0000` |
| Byte (单字节字符)(仅限于`u8`) | `b'A'`        |

数字类型默认是 `i32`

> ##### 整型溢出
>
> 比如有一个 `u8`，可以存放从零到 `255` 的值
>
> 当将其修改为 `256` 时，会导致以下两种行为之一的发生
>
> 当在 debug 模式编译时，Rust 检查这类问题并使程序 _panic_(panic被Rust 用来表明程序因错误而退出)
>
> 在 release 模式中构建时，**不会**检测会导致 panic 的整型溢出，而会进行一种被称为二进制补码 wrapping（_two’s complement wrapping_）的操作，`256` 变成 `0`，值 `257` 变成 `1`

##### 浮点型

Rust 的浮点数类型是 `f32` 和 `f64`，默认类型是 `f64`

```rust
fn main() {
  let x = 2.0; // f64
  let y: f32 = 3.0; // f32
}
```

浮点数采用 IEEE-754 标准表示

##### 数值运算

```rust
fn main() {
    // addition
    let sum = 5 + 10;

    // subtraction
    let difference = 95.5 - 4.3;

    // multiplication
    let product = 4 * 30;

    // division
    let quotient = 56.7 / 32.2;
    let truncated = -5 / 3; // 结果为 -1

    // remainder
    let remainder = 43 % 5;
}
```

不同类型之间不能运算

##### 布尔型

布尔类型使用 `bool` 表示

##### 字符类型

Rust 的 `char` 类型是语言中最原生的字母类型

用单引号声明 `char` 字面量，用双引号声明`字符串`字面量

```rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; // with explicit type annotation
    let heart_eyed_cat = '😻';
}
```

Rust 的 `char` 类型的大小为四个字节，并代表了一个 Unicode 标量值

Rust 中，带变音符号的字母，中文、日文、韩文等字符，emoji、零长度的空白字符都是有效的 `char` 值

#### 复合类型

Rust 有两个原生的复合类型：元组（tuple）和数组（array）

##### 元组类型

元组是将多个其他类型的值组合进一个复合类型的主要方式

元组长度固定：一旦声明，其长度不会增大或缩小

使用包含在圆括号中的逗号分隔的值列表来创建一个元组，每一个位置都有一个类型，这些不同值的类型也不必是相同的

**访问元素**

为了从元组中获取单个值，可以使用模式匹配（pattern matching）来解构（destructure）元组值

也可以使用点号（`.`）后跟值的索引来直接访问它们（第一个索引值是 0）

```rust
fn main() {
  let tup: (i32, f64, u8) = (500, 6.4, 1);
  let (x, y, z) = tup; // 解构

  let x: (i32, f64, u8) = (500, 6.4, 1);
  let five_hundred = x.0; // 索引
  let six_point_four = x.1;
  let one = x.2;
}
```

不带任何值的元组，叫做 **单元（unit）** 元组

这种值以及对应的类型都写作 `()`，表示空值或空的返回类型

如果表达式不返回任何其他值，则会隐式返回单元值。

##### 数组类型

与元组不同，数组中的每个元素的类型必须相同

Rust 中的数组长度是固定的

数组并不如 vector 类型灵活。vector 类型是标准库提供的一个 **允许** 增长和缩小长度的类似数组的集合类型

可以像这样编写数组的类型：在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量。

```rust
let a: [i32; 5] = [1, 2, 3, 4, 5]; // [类型; 数量]
```

还可以通过在方括号中指定初始值，加分号，再加元素个数的方式来创建一个每个元素都为相同值的数组

```rust
let a = [3; 5]; // let a = [3, 3, 3, 3, 3];
```

**访问元素**

使用索引来访问数组的元素

```rust
fn main() {
    let a = [1, 2, 3, 4, 5];
    let first = a[0];
    let second = a[1];
}
```

> 如果访问数组结尾之后的元素，比如接受用户输入的数值6作为长度5的数组的下标
>
> 将会导致运行时错误

### 函数

`main` 函数是很多程序的入口点

`fn` 关键字用来声明新函数

Rust 代码中的函数和变量名使用 _snake case_ 规范风格，所有字母都是小写并使用下划线分隔单词

```rust
another_function();
```

Rust 不关心函数定义所在的位置，只要函数被调用时出现在调用之处可见的作用域内就行。

#### 参数

在函数签名中，**必须** 声明每个参数的类型

```rust
fn another_function(x: i32) {
    println!("The value of x is: {x}");
}
```

#### 语句和表达式

**语句**（_Statements_）是执行一些操作但不返回值的指令。 **表达式**（_Expressions_）计算并产生一个值。

`let y = 6;` 是一个语句

`5 + 6`是一个表达式

函数调用是一个表达式，宏调用是一个表达式，用大括号创建的一个新的块作用域也是一个表达式

下面这个作用于块将`x + 1`作为表达式返回的值，注意 `x+1` 这一行在结尾没有分号

如果在表达式的结尾加上分号，它就变成了语句，而语句不会返回值

```rust
fn main() {
  let y = {
    let x = 3;
    println!("in Y");
    x + 1
  };
  println!("after Y");
  println!("The value of y is: 4{y}"); // The value of y is: 4
}
// 输出
// in Y
// after Y
// The value of y is: 4
```

#### 具有返回值的函数

在箭头（`->`）后声明返回值的类型

```rust
fn five() -> i32 {
  5
}
```

> Rust 中也有 return 关键字
>
> ```rust
> fn five() -> i32 {
> return 5;
> }
> ```
>
> Rust 更鼓励不使用return关键字，它更加简洁和符合 Rust 的风格

### 注释

```rust
// 注释
```

### 控制流

Rust 代码中最常见的用来控制执行流的结构是 `if` 表达式和循环。

#### if表达式

```rust
let number = 3;

if number < 5 {
  println!("condition was true");
} else {
  println!("condition was false");
}
```

> <warn/>
>
> Rust 并不会尝试自动地将非布尔值转换为布尔值
>
> 代码中的条件 **必须** 是 `bool` 值，否则无法通过编译

```rust
let number = if true { 5 } else { 6 };
```

`if` 是一个表达式，可以在 `let` 语句的右侧使用它，

> <warn/>
>
> `if` 的每个分支的可能的返回值都必须是相同类型
>
> 如果它们的类型不匹配，如下面这个例子，则会出现一个错误：
>
> ```rust
> fn main() {
> let number = if true { 5 } else { "six" };
> println!("The value of number is: {number}");
> }
> ```

#### 循环

Rust 有三种循环：`loop`、`while` 和 `for`

##### loop无条件循环

`loop` 关键字告诉 Rust 一遍又一遍地执行一段代码直到明确要求停止。

可以使用 `break` 关键字来告诉程序何时停止循环。

`continue` 关键字告诉程序跳过这个循环迭代中的任何剩余代码，并转到下一个迭代。

**从循环返回值**

```rust
fn main() {
  let mut counter = 0;

  let result = loop {
    counter += 1;

    if counter == 10 {
      break counter * 2;
    }
  };

  println!("The result is {result}");
}
```

**循环标签**

```rust
fn main() {
  let mut count = 0;
  'counting_up: loop {
    println!("count = {count}");
    let mut remaining = 10;

    loop {
      println!("remaining = {remaining}");
      if remaining == 9 {
        break;
      }
      if count == 2 {
        break 'counting_up;
      }
      remaining -= 1;
    }

    count += 1;
  }
  println!("End count = {count}");
}
```

##### while条件循环

```rust
fn main() {
  let mut number = 3;

  while number != 0 {
    println!("{number}!");

    number -= 1;
  }

  println!("LIFTOFF!!!");
}
```

##### for

```rust
fn main() {
  let a = [10, 20, 30, 40, 50];

  for element in a {
    println!("the value is: {element}");
  }
}
```

## 所有权

### 所有权(移动)

> **所有权规则**
>
> 1. Rust 中的每一个值都有一个 **所有者**（_owner_）。
> 2. 值在任一时刻有且只有一个所有者。
> 3. 当所有者（变量）离开作用域，这个值将被丢弃。

**`String` 类型**

此处专注于 `String` 与所有权相关的部分。这些方面也同样适用于标准库提供的或你自己创建的其他复杂数据类型

```rust
let mut s = String::from("hello");
s.push_str(", world!"); // push_str() 在字符串后追加字面值
println!("{}", s); // 将打印 `hello, world!`
```

**内存与分配**

1. 必须在运行时向内存分配器（memory allocator）请求内存。
2. 需要一个当我们处理完 `String` 时将内存返回给分配器的方法。

对于第二步，Rust 采取的策略为：内存在拥有它的变量离开作用域后就被自动释放。

当变量离开作用域，Rust 为我们调用一个特殊的函数。这个函数叫做 [`drop`](https://doc.rust-lang.org/std/ops/trait.Drop.html#tymethod.drop)，在这里 `String` 的作者可以放置释放内存的代码。Rust 在结尾的 `}` 处自动调用 `drop`。

**移动**

```rust
let s1 = String::from("hello");
```

在上述代码中，String申请了一块内存用于放置字符串内容，返回String类型的数据存放在`s1`

`String` 由三部分组成：一个指向存放字符串内容内存的指针，一个长度，和一个容量。

```rust
let s2 = s1;
```

变量`s2`拥有一份`s1` 指针、长度和容量的拷贝，`s2`的指针指向了与`s1`的指针相同的内存区域

此时，如果不做任何操作，`s1`和`s2`在离开作用域后，它们都会尝试释放相同的内存。这是一个叫做 **二次释放**（_double free_）的错误。两次释放（相同）内存会导致内存污染，它可能会导致潜在的安全漏洞。

为了确保内存安全，在 `let s2 = s1;` 之后，Rust 认为 `s1` 不再有效，`s1`就成为一个无效引用。

拷贝指针、长度和容量而不拷贝数据可能听起来像浅拷贝，不过因为 Rust 同时使第一个变量无效了，这个操作被称为 **移动**（_move_），而不是叫做浅拷贝。

**克隆**

如果确实需要深度复制 `String` 中堆上的数据，而不仅仅是栈上的数据，可以使用一个叫做 `clone` 的通用函数。

```rust
let s1 = String::from("hello");
let s2 = s1.clone();
println!("s1 = {s1}, s2 = {s2}");
```

**拷贝**

```rust
let x = 5;
let y = x;
println!("x = {x}, y = {y}");
```

像整型这样的**在编译时已知大小**的类型被整个**存储在栈**上，没有理由在创建变量 `y` 后使 `x` 无效。

上述操作对函数同样有效

```rust
fn main() {
  let s = String::from("hello");  // s 进入作用域

  takes_ownership(s);             // s 的值移动到函数里 ...
                                  // ... 所以到这里不再有效

  let x = 5;                      // x 进入作用域

  makes_copy(x);                  // x 应该移动函数里，
                                  // 但 i32 是 Copy 的，
                                  // 所以在后面可继续使用 x

} // 这里，x 先移出了作用域，然后是 s。但因为 s 的值已被移走，
  // 没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
  println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。
  // 占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
  println!("{}", some_integer);
} // 这里，some_integer 移出作用域。没有特殊之处
```

返回值也可以转移所有权

### 引用与借用

**引用**（_reference_）像一个指针，因为它是一个地址，可以由此访问储存于该地址的属于其他变量的数据。 与指针不同，引用确保指向某个特定类型的有效值。

```rust
let s1 = String::from("hello");
let len = calculate_length(&s1);
fn calculate_length(s: &String) -> usize { // s 是 String 的引用
  s.len()
}
```

`&s1` 语法创建一个 **指向** 值 `s1` 的引用

`s`指向`s1` 的地址，`s1`指向值的地址

通过`s`可以直接访问`s1`的值，而作用域结束时不会丢弃`s1`指向值的内容

> 大概是因为`s`拥有的内容是`s1`的地址而不是`s1`指向的值，而地址是可Copy的，因此`calculate_length`结束后不需要进行任何清理

将创建一个引用的行为称为 **借用**（_borrowing_）

正如变量默认是不可变的，引用也一样。（默认）不允许修改引用的值。

```rust
fn main() {
  let s = String::from("hello");

  change(&s);
}

fn change(some_string: &String) {
  some_string.push_str(", world"); // 错误
}
```

**可变引用**

通过一个小调整就能修复上述示例代码中的错误，允许修改一个借用的值，这就是 **可变引用**（_mutable reference_）

```rust
fn main() {
  // 将 s 改为 mut
  let mut s = String::from("hello");
  // 创建一个可变引用 &mut s
  change(&mut s);
}
// 更新函数签名
fn change(some_string: &mut String) {
  some_string.push_str(", world");
}
```

必须将 `s` 改为 `mut`，然后在调用 `change` 函数的地方创建一个可变引用 `&mut s`，并更新函数签名以接受一个可变引用 `some_string: &mut String`。

不能在第一个可变引用的**创建和使用之间**创建第二个可变引用，也不能在拥有不可变引用的同时拥有可变引用。(可以同时拥有多个不可变引用)

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;  // cannot borrow 's' as mutable more than once at a time  second mutable borrow occurs here
println!("{}, {}", r1, r2);
let r2 = &mut s; // 可以
```

当确保前面的可变引用不会再使用后，才可以对同一个可变变量创建另一个可变引用

这将会保证不会有两个或更多指针同时访问同一数据

### Slice类型

_slice_ 允许引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一种引用，所以它没有所有权。

```rust
let s = String::from("hello world"); // 值长度11，下标0~10

let hello = &s[0..5];  // 从s的下标0位置开始引用，直到下标为5。不包括5
let world = &s[6..11]; // 从s的下标6位置开始引用，直到下标为11。不包括11
```

对于 Rust 的 `..` range 语法，如果想要从索引 0 开始，可以不写两个点号之前的值。`&s[..5]`

如果 slice 包含 `String` 的最后一个字节，也可以舍弃尾部的数字。`&s[6..]`

> 字符串 slice range 的索引必须位于有效的 UTF-8 字符边界内，如果尝试从一个多字节字符的中间位置创建字符串 slice，则程序将会因错误而退出。

> 类型`&str` 是一个不可变引用，它是一个指向二进制程序特定位置的 slice
>
> ```rust
> let s = "Hello, world!";
> ```

**其他类型的 slice**

除了针对字符串的 `slice`，也有更通用的 slice 类型。

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[1..3];

assert_eq!(slice, &[2, 3]); // assert_eq！断言两个参数是否相等
```

## 使用结构体组织相关联的数据

### 结构体定义和实例化

#### 结构体

```rust
// 一个存储用户账号信息的结构体
struct User {
  active: bool,
  username: String,
  email: String,
  sign_in_count: u64,
}
```

创建一个实例需要以结构体的名字开头，接着在大括号中使用 `key: value` 键 - 值对的形式提供字段

```rust
// let mut user1 = User { ... } // 可变的 User 实例。Rust 并不允许只将某个字段标记为可变
let user1 = User {
  active: true,
  username: String::from("someusername123"),
  email: String::from("someone@example.com"),
  sign_in_count: 1,
};
```

```rust
// 改变一个可变的 User 实例中 email 字段的值
let mut user1 = User {
  active: true,
  username: String::from("someusername123"),
  email: String::from("someone@example.com"),
  sign_in_count: 1,
};

user1.email = String::from("anotheremail@example.com");
```

**使用字段初始化简写语法**

参数名与字段名完全相同的参数可以简写

```rust
fn build_user(email: String, username: String) -> User {
  User {
    active: true,
    username,
    email,
    sign_in_count: 1,
  }
}
```

**使用结构体更新语法从其他实例创建实例**

```rust
let user2 = User {
  email: String::from("new@example.com"),
	..user1
};
```

`..` 语法指定了剩余未显式设置值的字段应有与给定实例对应字段相同的值。

结构体更新语法**移动**了数据。如果`user2` 只使用了`user1`中实现 `Copy` trait 的值，则`user1`可以继续使用。否则`user1`中的值移动到`user2`内，`user1`将不再可用。

#### 元组结构体

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
  let black = Color(0, 0, 0);
  let origin = Point(0, 0, 0);
}
```

`black` 和 `origin` 值的类型不同，因为它们是不同的元组结构体的实例。

#### 没有任何字段的类单元结构体

> 类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。我们将在第十章介绍 trait。

### 调试

`println!`可以默认输出实现了 `Display`的类型，但结构体没有。为了输出结构体，进行如下输入

```rust
// Rust 包含了打印出调试信息的功能，不过必须为结构体显式选择这个功能
// 在结构体定义之前加上外部属性 #[derive(Debug)]
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let rect1 = Rectangle {
    width: 30,
    height: 50,
  };

  println!("rect1 is {rect1:?}");
}
```

有如下输出

```shell
rect1 is Rectangle { width: 30, height: 50 }
```

可以使用 `{:#?}` 替换 `println!` 字符串中的 `{:?}`

有如下输出

```rust
rect1 is Rectangle {
    width: 30,
    height: 50,
}
```

可以看到可读性更好

另一种使用 `Debug` 格式打印数值的方法是使用 `dbg!` 宏。

`dbg!` 宏接收一个表达式的所有权（`println!` 宏接收的是引用）

打印出代码中调用 dbg! 宏时所在的文件和行号，以及该表达式的结果值，并返回该值的所有权。

```rust
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

fn main() {
  let scale = 2;
  let rect1 = Rectangle {
    width: dbg!(30 * scale),
    height: 50,
  };

  dbg!(&rect1);
}
```

输出如下

```shell
[src/main.rs:10:16] 30 * scale = 60
[src/main.rs:14:5] &rect1 = Rectangle {
    width: 60,
    height: 50,
}
```

### 方法语法

#### 方法

**方法**（method）与函数类似，不过它们第一个参数总是 `self`，它代表调用该方法的结构体实例。

```rust
#[derive(Debug)]
struct Rectangle {
  width: u32,
  height: u32,
}

impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
  fn print(&self) {
    println!("-----------------")
  }
}

fn main() {
  let rect1 = Rectangle {
    width: 30,
    height: 50,
  };

  println!(
    "The area of the rectangle is {} square pixels.",
    rect1.area()
  );
}
```

`&self`不获取所有权

`self`获取所有权

`&mut self` 可改变调用方法的实例。需要实例使用`mut`可变声明

```rust
struct Rectangle {
  width: u32,
  height: u32,
}

impl Rectangle {
  // 当在 rect1.width 后面加上括号时。Rust 知道指的是方法 width。当不使用圆括号时，Rust 知道指的是字段 width
  fn width(&self) -> bool {
    self.width > 0
  }
}

fn main() {
  let rect1 = Rectangle {
    width: 30,
    height: 50,
  };

  if rect1.width() {
    println!(
      "The rectangle has a nonzero width; it is {}; it is 大于 0 吗? {}",
      rect1.width,
      rect1.width()
    );
  }
}
```

> **自动引用和解引用**
>
> 如果 `rect2` 是一个指针，在 C/C++ 语言中需要使用 `->`运算符调用方法`rect2->width()`
>
> Rust 并没有一个与 `->` 等效的运算符；相反，Rust 有一个叫 **自动引用和解引用**（_automatic referencing and dereferencing_）的功能。
>
> 它是这样工作的：当使用 `rect2.width()` 调用方法时，Rust 会自动为 `rect2` 添加 `&`、`&mut` 或 `*` 以便使 `rect2` 与方法签名匹配。也就是说，这些代码是等价的：
>
> ```rust
> rect2.width();
> (&rect2).width();
> ```

#### 关联函数

所有在 `impl` 块中定义的函数被称为 **关联函数**（_associated functions_），因为它们与 `impl` 后面命名的类型相关。

可以定义不以 `self` 为第一参数的关联函数（因此不是方法），它们并不作用于一个结构体的实例（类似静态方法）。

```rust
impl Rectangle {
  fn square(size: u32) -> Self {
    Self {
      width: size,
      height: size,
    }
  }
}
```

关键字 `Self` 在函数的返回类型中代指在 `impl` 关键字后出现的类型，在这里是 `Rectangle`

使用结构体名和 `::` 语法来调用这个关联函数。`::` 语法用于关联函数和模块创建的命名空间。第七章会讲到模块。

```rust
// 创建一个边长3的正方形
let sq = Rectangle::square(3);
```

#### 多个 `impl` 块

每个结构体都允许拥有多个 `impl` 块

```rust
impl Rectangle {
  fn area(&self) -> u32 {
    self.width * self.height
  }
}

impl Rectangle {
  fn can_hold(&self, other: &Rectangle) -> bool {
    self.width > other.width && self.height > other.height
  }
}
```

第十章讨论泛型和 trait 时会看到实用的多 `impl` 块的用例。

## 枚举和模式匹配

### 枚举的定义

定义一个 `IpAddrKind` 枚举来表现这个概念并列出可能的 IP 地址类型：`V4` 和 `V6`。

```rust
enum IpAddrKind {
  V4,
  V6,
}
```

创建 `IpAddrKind` 两个不同成员的实例

```rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

可以定义一个函数来获取任何 `IpAddrKind`

```rust
fn route(ip_kind: IpAddrKind) {}

route(IpAddrKind::V4);
route(IpAddrKind::V6);
```

使用枚举并将数据直接放进每一个枚举成员

```rust
  enum IpAddr {
    V4(String),
    V6(String),
  }
  let home = IpAddr::V4(String::from("127.0.0.1"));
  let loopback = IpAddr::V6(String::from("::1"));
```

枚举的每个成员可以处理不同类型和数量的数据

```rust
  enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
  }
  let home = IpAddr::V4(127, 0, 0, 1);
  let loopback = IpAddr::V6(String::from("::1"));
```

```rust
enum Message {
  Quit,
  Move { x: i32, y: i32 },
  Write(String),
  ChangeColor(i32, i32, i32),
}
```

这个枚举有四个含有不同类型的成员：

- `Quit` 没有关联任何数据。
- `Move` 类似结构体包含命名字段。
- `Write` 包含单独一个 `String`。
- `ChangeColor` 包含三个 `i32`。

#### 方法语法

可以使用 `impl` 在枚举上定义方法

```rust
  impl Message {
    fn call(&self) {
      // 在这里定义方法体
    }
  }

  let m = Message::Write(String::from("hello"));
  m.call();
```

#### `Option` 枚举和其相对于空值的优势

，Rust 并没有空值，不过它确实拥有一个可以编码存在或不存在概念的枚举。这个枚举是 `Option<T>`，而且它[定义于标准库中](https://doc.rust-lang.org/std/option/enum.Option.html)

```rust
enum Option<T> {
  None,
  Some(T),
}
```

`Option<T>` 枚举是如此有用以至于它甚至被包含在了 prelude 之中，你不需要将其显式引入作用域。

它的成员也是如此，可以不需要 `Option::` 前缀来直接使用 `Some` 和 `None`

`<T>` 语法是一个还未讲到的 Rust 功能。它是一个泛型类型参数，第十章会更详细的讲解泛型。

`Option<T>` 与 `T`的类型不同。不能把`Option<i8>`当作`i8`使用，因为`Option<T>`可能为`None`

在对 `Option<T>` 进行运算之前必须将其转换为 `T`

### `match` 控制流结构

> `switch`

```rust
enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter,
}
// 返回硬币对应的面值
fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => {
      println!("Lucky penny!");
      1
    }
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter => 25,
  }
}
```

```rust
#[derive(Debug)]
enum UsState {
  Alabama,
  Alaska,
  // --snip--
}

enum Coin {
  Penny,
  Nickel,
  Dime,
  Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
  match coin {
    Coin::Penny => 1,
    Coin::Nickel => 5,
    Coin::Dime => 10,
    Coin::Quarter(state) => {
      println!("State quarter from {state:?}!");
      25
    }
  }
}
// state 绑定的将会是值 UsState::Alaska
value_in_cents(Coin::Quarter(UsState::Alaska));
```

#### 匹配 `Option`

Rust 中的匹配是 **穷尽的**（_exhaustive_）：必须穷举到最后的可能性来使代码有效。

```rust
  fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
      // 没有处理 None 的情况，所以这些代码会造成一个 bug。幸运的是，这是一个 Rust 知道如何处理的 bug。如果尝试编译这段代码，会得到错误
      // None => None,
      Some(i) => Some(i + 1),
    }
  }

```

#### 配模式和 `_` 占位符

```rust
let dice_roll = 9;
match dice_roll {
  3 => add_fancy_hat(),
  7 => remove_fancy_hat(),
  // 可以是任何名称 any => move_player(any)
  other => move_player(other),
}

fn add_fancy_hat() {}
fn remove_fancy_hat() {}
fn move_player(num_spaces: u8) {}
```

即使没有列出 `u8` 所有可能的值，这段代码依然能够编译，因为最后一个模式将匹配所有未被特殊列出的值。

Rust 还提供了一个模式，当我们不想使用通配模式获取的值时，请使用 `_` ，这是一个特殊的模式，可以匹配任意值而不绑定到该值。这告诉 Rust 我们不会使用这个值，所以 Rust 也不会警告我们存在未使用的变量。

```rust
  let dice_roll = 9;
  match dice_roll {
    3 => add_fancy_hat(),
    7 => remove_fancy_hat(),
    _ => reroll(),
  }

  fn add_fancy_hat() {}
  fn remove_fancy_hat() {}
  fn reroll() {}
```

### `if let` 简洁控制流

```rust
let config_max = Some(3u8);
match config_max {
  Some(max) => println!("The maximum is configured to be {max}"),
  _ => (),
}
```

使用`match`时，即使只关心`u8`类型的值，也需要在最后加上`_ => ()`。

使用`if let`可以简化代码

```rust
let config_max = Some(3u8);
if let Some(max) = config_max {
	println!("The maximum is configgured to be {max}");
}
```

> <warn>?<warn/>
>
> ```rust
> let config_max = Some(Some(Some(Some(Some(Some(String::from("string")))))));
> if let Some(max) = config_max {
> dbg!(max);
> }
> ```
>
> > 不过这是可行的
> >
> > ```shell
> > Compiling test_code v0.1.0 (F:\Users\Documents\MyDocument\study\rust\code\test_code)
> >  Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.34s
> >   Running `target\debug\test_code.exe`
> > [src/main.rs:5:5] max = Some(
> >  Some(
> >      Some(
> >          Some(
> >              Some(
> >                  "string",
> >              ),
> >          ),
> >      ),
> >  ),
> > )
> > ```

可以在 `if let` 中包含一个 `else`。`else` 块中的代码与 `match` 表达式中的 `_` 分支块中的代码相同

下面两个代码块含义相同

```rust
  let mut count = 0;
  match coin {
    Coin::Quarter(state) => println!("State quarter from {state:?}!"),
    _ => count += 1,
  }
```

```rust
  let mut count = 0;
  if let Coin::Quarter(state) = coin {
    println!("State quarter from {state:?}!");
  } else {
    count += 1;
  }
```

## 使用包、Crate 和模块管理不断增长的项目

> - **包**（_Packages_）：Cargo 的一个功能，它允许你构建、测试和分享 crate。
> - **Crates** ：一个模块的树形结构，它形成了库或二进制项目。
> - **模块**（_Modules_）和 **use**：允许你控制作用域和路径的私有性。
> - **路径**（_path_）：一个命名例如结构体、函数或模块等项的方式。

### 包和 Crate

**crate**

用 `rustc` 而不是 `cargo` 来编译一个文件，编译器还是会将那个文件认作一个 `crate`。

`crate` 有两种形式：二进制项和库。

_二进制项_ 可以被编译为可执行程序，比如一个命令行程序或者一个 `web server`。它们必须有一个 `main` 函数来定义当程序被执行的时候所需要做的事情。

_库_ 并没有 `main` 函数，它们也不会编译为可执行程序，它们提供一些诸如函数之类的东西，使其他项目也能使用这些东西。

`crate root` 是一个源文件，`Rust `编译器以它为起始点，并构成你的 crate` 的根模块。

**包**

_包_（`package`）是提供一系列功能的一个或者多个 `crate`。一个包会包含一个 `Cargo.toml` 文件，阐述如何去构建这些 `crate`。

`Cargo` 就是一个包含构建你代码的二进制项的包。`Cargo` 也包含这些二进制项所依赖的库。其他项目也能用 `Cargo` 库来实现与 Cargo` 命令行程序一样的逻辑。

包中可以包含至多一个库 `crate(library crate)`。包中可以包含任意多个二进制 `crate(binary crate)`，但是必须至少包含一个` crate`（无论是库的还是二进制的）。

`Cargo`认为`src/main.rs` 就是一个与包同名的二进制 `crate` 的 `crate` 根。

如果一个包同时含有 `src/main.rs` 和 `src/lib.rs`，则它有两个 `crate`：一个二进制的和一个库的，且名字都与包相同。

`Cargo` 知道如果包目录中包含 `src/lib.rs`，则包带有与其同名的库 `crate`，且 `src/lib.rs` 是 `crate` 根。

### 定义模块来控制作用域与私有性

#### 模块

**声明模块**

内联

```rust
mod first_test {
  pub fn print_what() {
    println!("what");
  }
}

fn main() {
  first_test::print_what();
}
```

在文件 `src/garden.rs`或 `src/garden/mod.rs`

`src\main.rs`

```rust
mod garden;
```

**声明子模块**

在*src/garden.rs*中定义了`mod vegetables;`

内联

直接定义在`src/garden/mod.rs`中

```rust
mod vegetables {
  pub struct Asparagus {}
}
```

在文件 `src/garden/vegetables.rs`或 `src/garden/vegetables/mod.rs`

```rust
mod vegetables;
```

`vegetables.rs`

```rust
pub struct Asparagus {}
```

**模块中的代码路径**

一旦一个模块是你 crate 的一部分，你可以在隐私规则允许的前提下，从同一个 crate 内的任意地方，通过代码路径引用该模块的代码。

例如，一个 garden vegetables 模块下的`Asparagus`类型可以在`crate::garden::vegetables::Asparagus`被找到。

**私有 vs 公用**

一个模块里的代码默认对其父模块私有。

为了使一个模块公用，应当在声明时使用`pub mod`替代`mod`。为了使一个公用模块内部的成员公用，应当在声明前使用`pub`。

**`use` 关键字**

在一个作用域内，`use`关键字创建了一个成员的快捷方式，用来减少长路径的重复

```rust
use crate::garden::vegetables::Asparagus;
mod garden;
fn main() {
  let plant = Asparagus {};
  println!("I'm growing {:?}, length: {:?}", plant, plant.length);
}
```

等同于

```rust
mod garden;
fn main() {
  let plant = crate::garden::vegetables::Asparagus {};
  println!("I'm growing {:?}, length: {:?}", plant, plant.length);
}
```

#### 在模块中对相关代码进行分组

执行 `cargo new --lib restaurant`，创建一个新的名为 `restaurant` 的库，定义一些模块和函数。

`src/lib.rs`

```rust
mod front_of_house {
  mod hosting {
    fn add_to_waitlist() {}

    fn seat_at_table() {}
  }

  mod serving {
    fn take_order() {}

    fn serve_order() {}

    fn take_payment() {}
  }
}
```

### 引用模块项目的路径

- **绝对路径**（_absolute path_）是以 crate 根（root）开头的全路径；对于外部 crate 的代码，是以 crate 名开头的绝对路径，对于当前 crate 的代码，则以字面值 `crate` 开头。

- **相对路径**（_relative path_）从当前模块开始，以 `self`、`super` 或定义在当前模块中的标识符开头。

```rust
mod front_of_house {
  pub mod hosting {
    pub fn add_to_waitlist() {}
  }
}

pub fn eat_at_restaurant() {
  // 绝对路径
  crate::front_of_house::hosting::add_to_waitlist();

  // 相对路径
  front_of_house::hosting::add_to_waitlist();
}
```

#### 使用`pub`关键字暴露路径

父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用它们父模块中的私有项。

`lib.rs`

```rust
use garden::vegetables::add_a;
mod garden;

fn add(x: u32, y: u32) -> u32 {
  x + y
}

fn main() {
  add_a();
}
```

`garden\mod.rs`

```rust
pub mod vegetables;
```

`garden\vegetables\mod.rs`

```rust
use crate::add;

pub fn add_a() {
  println!("in vegetables add_a: {}", add(2, 1));
}
```

#### `super`开始的相对路径

可以通过在路径的开头使用 `super` ，从父模块开始构建相对路径，而不是从当前模块或者 crate 根开始。

这类似以 `..` 语法开始一个文件系统路径。

```rust
fn deliver_order() {}

mod back_of_house {
  fn fix_incorrect_order() {
    cook_order();
    super::deliver_order();
  }

  fn cook_order() {}
}
```

#### `self`开始的相对路径

从当前模块开始构建相对路径。

可以省略。

#### 创建公有的结构体和枚举

如果在一个结构体定义的前面使用了 `pub` ，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的。

对于私有字段，可以通过同一结构体上的公有方法访问。

对于拥有私有字段的结构体，需要提供一个公共的关联函数来构造实例，因为我们不能在外部设置私有字段的值。

```rust
mod back_of_house {
  pub struct Breakfast {
    pub toast: String,
    seasonal_fruit: String,
  }

  impl Breakfast {
    pub fn summer(toast: &str) -> Breakfast {
      Breakfast {
        toast: String::from(toast),
        seasonal_fruit: String::from("peaches"),
      }
    }
  }
}

pub fn eat_at_restaurant() {
  // 在夏天订购一个黑麦土司作为早餐
  let mut meal = back_of_house::Breakfast::summer("Rye");
  // 改变主意更换想要面包的类型
  meal.toast = String::from("Wheat");
  println!("I'd like {} toast please", meal.toast);

  // 如果取消下一行的注释代码不能编译；
  // 不允许查看或修改早餐附带的季节水果
  // meal.seasonal_fruit = String::from("blueberries");
}
```

### 使用 `use` 关键字将路径引入作用域

`use`只能创建 `use` 所在的特定作用域内的短路径

```rust
use garden::vegetables::add_a;
use garden::vegetables::Asparagus;

mod garden;

fn add(x: u32, y: u32) -> u32 {
  x + y
}

fn main() {
  let plant = Asparagus::create(3);
  println!("I'm growing {:?}, length: {:?}", plant, plant.get_length());
  add_a();
}

mod twice {
  // 和上面的use不在同一个作用域，需要再次创建
  use crate::garden::vegetables::add_a;

  fn t() {
    add_a()
  }
}
```

#### 创建惯用的`use`路径

**对于函数**

将函数引入作用域的习惯用法是将其父作用域引入，通过父作用域调用函数。

这样可以清晰地表明函数不是在本地定义的

```rust
use crate::garden::vegetables;

fn t() {
  vegetables::add_a()
}
```

**对于结构体、枚举和其他项**

习惯是指定它们的完整路径。

```rust
use garden::vegetables::Asparagus;
fn main() {
  let plant = Asparagus::create(3);
  println!("I'm growing {:?}, length: {:?}", plant, plant.get_length());
}
```

但如果不同作用域有相同命名的结构体或其他项，使用父模块可以区分这些类型。

#### 使用`as`关键字提供新的名称

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
  // --snip--
}

fn function2() -> IoResult<()> {
  // --snip--
}
```

#### 使用`pub use`重导出名称

假设函数`add_to_waitlist`需要路径 `restaurant::front_of_house::hosting::add_to_waitlist` 来调用。

使用`pub use` 从根模块重导出了 `hosting` 模块后，可以使用路径`restaurant::hosting::add_to_waitlist`来调用。

#### 使用外部包

为了在项目中使用 `rand`，在 _Cargo.toml_ 中加入了如下行：

文件名：Cargo.toml

```toml
rand = "0.8.5"
```

```rust
// 不论在哪个作用域都是如此
use rand::Rng;

fn main() {
  let secret_number = rand::thread_rng().gen_range(1..=100);
}
```

> <tip/>
>
> 这里使用的这类范围表达式使用了 `start..=end` 这样的形式，也就是说包含了上下端点，所以需要指定 `1..=100` 来请求一个 1 和 100 之间的数。

[crates.io](https://crates.io/) 上有很多 Rust 社区成员发布的包，将其引入你自己的项目都需要一道相同的步骤：在 _Cargo.toml_ 列出它们并通过 `use` 将其中定义的项引入项目包的作用域中。

> <tip/>
>
> 标准库随 Rust 语言一同分发，无需修改 _Cargo.toml_ 来引入标准库，如 `std`

#### 嵌套路径来消除大量的`use`行

```rust
use garden::{vegetables, vegetables::Asparagus};
// use garden::vegetables::{self, Asparagus}; // 也可以
use std::io::{self, Write};
```

等同于

```rust
use garden::vegetables;
use garden::vegetables::Asparagus;

use std::io;
use std::io::Write;
```

#### 通过`glob`运算符将所有的公有定义引入作用域

如果希望将一个路径下 **所有** 公有项引入作用域，可以指定路径后跟 `*`，glob 运算符

```rust
use std::collections::*;
```

> <warn/>
>
> 使用 glob 运算符时请多加小心！Glob 会使得我们难以推导作用域中有什么名称和它们是在何处定义的。

### 将模块拆分成多个文件

注意你只需在模块树中的某处使用一次 `mod` 声明就可以加载这个文件，而不需要在每个用到该模块的都使用`mod`声明。

`mod` **不是** 你可能会在其他编程语言中看到的 "include" 操作

一旦编译器知道了这个文件是项目的一部分（并且通过 `mod` 语句的位置知道了代码在模块树中的位置），项目中的其他文件直接使用模块声明的位置的路径即可引用这个文件的代码。

## 常见集合

**集合**（_collections_）

不同于内建的数组和元组类型，这些集合指向的数据是储存在堆上的，数据的数量不必在编译时就已知，可以随着程序的运行增长或缩小。

- `vector`允许我们一个挨着一个地储存一系列数量可变的值
- **字符串**（_string_）是字符的集合
- **哈希 map**（_hash map_）允许我们将值与一个特定的键（key）相关联。这是一个叫做 _map_ 的更通用的数据结构的特定实现

> 对于标准库提供的其他类型的集合，请查看[文档](https://doc.rust-lang.org/std/collections/index.html)。

### 使用`vector`储存列表

`Vec<T>`，也被称为 _vector_。

#### 新建`vector`

```rust
let v: Vec<i32> = Vec::new();
```

Rust 提供了 `vec!` 宏，这个宏会根据我们提供的值来创建一个新的 vector。

```rust
// 提供了 i32 类型的初始值，Rust 可以推断出 v 的类型是 Vec<i32>，因此类型注解就不是必须的。
let v = vec![1, 2, 3];
```

#### 更新`vector`

```rust
let mut v = Vec::new();
// Rust会认第一个加入的数据类型为vec的存储类型
v.push(5);
v.push(6);
v.push(7);
v.push(8);
```

#### 读取`vector`

```rust
let v = vec![1, 2, 3, 4, 5];
// 索引语法
let third: &i32 = &v[2]; // 3
// get语法
let third: Option<&i32> = v.get(2); // Option(3)
```

当使用索引语法，输入一个范围之外的索引值会造成 panic。

使用get语法，则不会造成 panic，而是返回 `None`。

#### 遍历`vector`中的元素

```rust
let v = vec![100, 32, 57];
for i in &v {
  println!("{i}");
}
```

```rust
let mut v = vec![100, 32, 57];
for i in &mut v {
  // i 是一个指针，需要解引用以访问正确的地址
  *i += 50;
}
```

#### 使用枚举来储存多种类型

vector 只能储存相同类型的值。这是很不方便的。

幸运的是，枚举的成员都被定义为相同的枚举类型，所以当需要在 vector 中储存不同类型值时，我们可以定义并使用一个枚举！

```rust
  enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
  }

  let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
  ];
```

> <tip/>
>
> 现在我们了解了一些使用 vector 的最常见的方式，请一定去看看标准库中 `Vec` 定义的很多其他实用方法的 [API 文档](https://doc.rust-lang.org/std/vec/struct.Vec.html)。例如，除了 `push` 之外还有一个 `pop` 方法，它会移除并返回 vector 的最后一个元素。

#### 丢弃`vector`时也会丢弃其所有元素

类似于任何其他的 `struct`，vector 在其离开作用域时会被释放

当 vector 被丢弃时，所有其内容也会被丢弃
