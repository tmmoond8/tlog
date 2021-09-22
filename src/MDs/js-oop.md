---
title: JS가 객체지향언어라 할 수 있는 이유
date: '2020-03-26T08:56:56.263Z'
description: 대체가능성, 내적동질성
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---

#

[https://www.youtube.com/watch?v=bgP_1l7aJnc&feature=youtu.be](https://www.youtube.com/watch?v=bgP_1l7aJnc&feature=youtu.be)

1. 대체 가능성
2. 내적 일관성, 내적 동일성

객체지향 개발을 할 수 있으려면 위 두 가지 특성을 가질 수 있도록 언어에 장치를 두어야 한다. 자바스크립트는 Prototype으로 위 두 특징을 만족시킴

**대체가능성(Polymorphism)**

확장한 자식이 부모를 대신 할 수 있다.

```jsx
const Parent = class {};
const Child = class extends Parent {};
const a = new Child();
console.log(a instanceof Parent);
```

자바스크립트는 프로토타입 체인을 통해 대체가능성을 보장한다.

**내적 동질성**

아무리 확장 되기 전 메소드를 호출해도 나의 본질은 변하지 않는다.

```jsx
const Parent = class {
  wrap() {
    this.action();
  }
  action() {
    console.log("Parent");
  }
};
const Child = class extends Parent {
  action() {
    console.log("Child");
  }
};

const a = new Child();
a.action();
a.wrap();
```
