---
title: ES6 - Rest/Spread 연산자
date: '2020-05-08T08:56:56.263Z'
description: 코드를 더 간결하게
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - Javascript
---

#

[Extended Parameter Handling | PoiemaWeb](https://poiemaweb.com/es6-extended-parameter-handling)

### default parameter

---

```jsx
function sum(x, y) {
  return x + y;
}

console.log(sum(1)); // NaN
console.log(sum(1, 2)); // 3

function sum(x = 0, y = 0) {
  return x + y;
}

console.log(sum(1)); // 1
console.log(sum(1, 2)); // 3
```

```jsx
function foo(...rest) {
  console.log(Array.isArray(rest)); // true
  console.log(Array.isArray(arguments)); // false
  console.log(rest); // [ 1, 2, 3, 4, 5 ]
}

foo(1, 2, 3, 4, 5);
```

Rest 파라미터는 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 length 프로퍼티에 영향을 주지 않는다.

```jsx
function foo(...rest) {}
console.log(foo.length); // 0

function bar(x, ...rest) {}
console.log(bar.length); // 1

function baz(x, y, ...rest) {}
console.log(baz.length); // 2
```

> Spread 문법의 피연산자는 이터러블한 객체만 가능하다.

```jsx
Symbol.iterator in []  // true
[][Symbol.iterator]()
```

```jsx
// ...[1, 2, 3]는 [1, 2, 3]을 개별 요소로 분리한다(→ 1, 2, 3)
console.log(...[1, 2, 3]); // 1, 2, 3

// 문자열은 이터러블이다.
console.log(..."Hello"); // H e l l o

// Map과 Set은 이터러블이다.
console.log(
  ...new Map([
    ["a", "1"],
    ["b", "2"],
  ])
); // [ 'a', '1' ] [ 'b', '2' ]
console.log(...new Set([1, 2, 3])); // 1 2 3
```

```jsx
console.log([..."Hello"]); // ["H", "e", "l", "l", "o"]
console.log(Array.from("Hello")); //["H", "e", "l", "l", "o"]
```

`Array.from(String)` 와 `[...String]` 의 차이점은 무엇일까?

```jsx
Array.from({ 0: "a", 1: "1", length: 2 });
[...{ 0: "a", 1: "1", length: 2 }];
```

`Array.from`은 `iterable`과 `array-like`도 커버한다.

```jsx
// 이터러블이 아닌 일반 객체는 Spread 문법의 대상이 될 수 없다.
console.log(...{ a: 1, b: 2 });
// TypeError: Found non-callable @@iterator
```

`{...{a: 12, b: 'bsdfsfa'}}` 이건 되는데

이건 위에서 말한 Spread와 또 다른 Rest/Spread 프로퍼티라고 하고 현재 stage4 단계인 프로포절이다.

[tc39/proposal-object-rest-spread](https://github.com/tc39/proposal-object-rest-spread)

```jsx
var user = {
  name: "tamm",
  birth: 2000,
};

const { name, birth } = user;

var getAge = ({ birth }) => new Date().getFullYear() - birth + 1;
getAge(user); // 21
```

참조

---

[Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

[Rest parameters and spread syntax](https://javascript.info/rest-parameters-spread)
