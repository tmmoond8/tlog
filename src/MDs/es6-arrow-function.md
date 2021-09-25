---
title: ES6 화살표 함수
date: '2020-04-10T08:56:56.263Z'
description: 화살표 함수에 대해 깊게 이해하기
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


[Arrow function | PoiemaWeb](https://poiemaweb.com/es6-arrow-function)

화살표 함수는 사람들이 정말 좋아하는 스펙이다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952588/tlog/arrow-function-image_zca7zz.png)

[Axel Rauschmayer survey on favorite ES6 features](http://www.2ality.com/2015/07/favorite-es6-features.html)

Which ES6 features do you use?

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952586/tlog/arrow-function-image1_wiqr2s.png)

[Ponyfoo’s survey on the most commonly used ES6 features](https://ponyfoo.com/articles/javascript-developer-survey-results)

Which ES5 features do you use?

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952584/tlog/arrow-function-image2_hge9yn.png)

ES5에서는 부터는 반복문 보다 배열을 순회하는 것을 훨씬 더 좋아함,.

```jsx
// 매개변수 지정 방법
    () => { ... } // 매개변수가 없을 경우
     x => { ... } // 매개변수가 한 개인 경우, 소괄호를 생략할 수 있다.
(x, y) => { ... } // 매개변수가 여러 개인 경우, 소괄호를 생략할 수 없다.

// 함수 몸체 지정 방법
x => { return x * x }  // single line block
x => x * x             // 함수 몸체가 한줄의 구문이라면 중괄호를 생략할 수 있으며 암묵적으로 return된다. 위 표현과 동일하다.

() => { return { a: 1 }; }
() => ({ a: 1 })  // 위 표현과 동일하다. 객체 반환시 소괄호를 사용한다.

() => {           // multi line block.
  const x = 10;
  return x * x;
};

// 소괄호에도 여러줄로 표현식을 사용할 수 있다.(문은 불가) 맨 마지막 값이 리턴된다.
var k = (x) => (
	console.log(x),
	x = x*x,
	2*x
)
k(3)

const Text = (props) => (
	<div>
		{props.name}{props.age}{props.title}
	</div>
)
```

### ES5이전의 함수와 화살표 함수의 차이점

---

가장 큰 차이점은 this.

```jsx
var Dog = function() {
  this.think = "밥 줘";
  this.say = () => this.think;
};

var a = new Dog();
a.say();
```

생성자로 호출될 수 없음.

arguments가 없음

prototype 프로퍼티를 가지지 않음.

yield 키워드를 사용할 수 없다고 함.

The `yield` keyword may not be used in an arrow function's body (except when permitted within functions further nested within it). As a consequence, arrow functions cannot be used as generators.

MDN 예제인데, 위는 되고 아래가 안되는건 너무나 이상하다..

```jsx
var func = () => { foo: 1 };
// Calling func() returns undefined!

var func = () => { foo: function() {} };
// SyntaxError: function statement requires a name
```

화살표 함수는 연산자 사이에서 사용하려면 이렇게 해줘야 한다.

```jsx
let callback;

callback = callback || function() {}; // ok

callback = callback || () => {};
// SyntaxError: invalid arrow-function arguments

callback = callback || (() => {});    // ok
```

내 생각에 연산자 사이에 화살표 함수에 대해서는 올바로 처리하지 못하는 것이 아닌가 한다...

[Operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)

### How Much Use Is There for Arrow Functions?

---

- Use `function` in the global scope and for `Object.prototype` properties.
- Use `class` for object constructors.
- Use `=>` everywhere else.

### 화살표 함수는 객체지향 프로그래밍을 할 수 없다.

---

이전에 객체 지향 관련해서 전달 드렸던 내용

```jsx
var Parent = class {
  wrap() {
    this.action();
  }
  action() {
    console.log("Parent");
  }
};
var Child = class extends Parent {
  action() {
    console.log("Child");
  }
};

var a = new Child();
a.action();
a.wrap();
```

프로토타입 기반 상속으로 변경

```jsx
var Parent = function() {};
Parent.prototype.wrap = function() {
  this.action();
};
Parent.prototype.action = function() {
  console.log("parent");
};
var Child = function() {
  this.action = () => {
    console.log("Child");
  };
};

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var a = new Child();
a.action();
a.wrap();
```

함수를 화살표 함수로 변경

```jsx
var Parent = function() {
  this.wrap = () => this.action();
  this.action = () => console.log("Parent");
};
var Child = function() {
  this.action = () => {
    console.log("Child");
  };
};

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var a = new Child();
a.action();
a.wrap();
```

테스트 자식만 화살표 함수로

```jsx
var Parent = function() {};
Parent.prototype.wrap = function() {
  this.action();
};
Parent.prototype.action = function() {
  console.log("parent");
};
var Child = function() {
  this.action = () => {
    console.log("Child");
  };
};

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var a = new Child();
a.action();
a.wrap();
```

화살표 함수를 쓸때와 안쓸 때??

```jsx
var Parent = function() {};
Parent.prototype.wrap = function() {
  this.action();
};
Parent.prototype.action = () => {
  console.log("parent");
};
var Child = function() {
  this.action = () => {
    console.log("Child");
  };
};

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

var a = new Child();
a.action();
a.wrap();
```

### TMI

---

coffeeScript 의 언어에서는 `=>`와 `->` 둘다 존재 한다.
`=>` 를 fat arrow, `->` 를 thin arrow 라 부른다.

### 참고

---

[Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

[Arrow Functions: Fat and Concise Syntax in JavaScript](https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/)
