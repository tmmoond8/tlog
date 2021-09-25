---
title: ES6 - Symbol
date: '2020-05-18T08:56:56.263Z'
description: 왜 Symbol이 필요할까?
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---


## Symbol이란?

---

ES6에서 새롭게 추가된 7번째 타입. 변경 불가능한 원시 타입이다.

원시 타입

- `Boolean`
- `null`
- `undefined`
- `Number`
- `String`

객체 타입

- `Object`

심볼의 주요 사용처는 이름 충돌이 없는 객체의 프로퍼티 키를 만드는데 사용한다. 그 동안 객체의 프로퍼티 키는 문자열만 가능했지만, 이번에 추가된 Symbol도 그 역할을 할 수 있게 됐다.

## Symbol의 생성

---

Symbol의 생성은 다른 원시 값이나 객체랑 생성하는 방식이 조금 특이하다.

```jsx
let mySymbol = Symbol();
console.log(mySymbol); // Symbol();
console.log(typeof mySymbol); // symbol
```

Symbol() 은 함수지만 생성자 함수는 아니고, 호출될 때 새로운 Symbol 값을 반환한다. 여기서 우리가 항상 인지해야 할 것은 Symbol() 함수가 리턴 하는 값은 객체가 아니라 원시값이라는 것이다. 그리고 생성자 함수로 사용될 수 없다.(constructor 함수가 없다.)

> 생성자로 객체를 생성하면 원시 값이 아닌 심볼의 래퍼 객체를 생성하는 것인데, 이는 기본적으로 막고 있다.

아래의 방법으로 심볼 래퍼 객체는 생성할 수 있긴 하다.

```jsx
var sym = Symbol("foo");
typeof sym; // "symbol"
var symObj = Object(sym);
typeof symObj; // "object"

var obj = { [sym]: 1 };
obj[sym]; // 1
obj[Object(sym)]; // still 1
```

그리고 Symbol 객체를 생성할 때 인자로 문자열을 넣을 수 있는데, 이 값은 단순히 식별용이지 특정 값을 사용하는 key 처럼 사용될 수 없다.

```jsx
let symbolWithDesc = Symbol("ungmo2");

console.log(symbolWithDesc); // Symbol(ungmo2)
console.log(symbolWithDesc === Symbol("ungmo2")); // false
```

## Symbol의 사용

---

```jsx
const obj = {};

const mySymbol = Symbol("mySymbol");
obj[mySymbol] = 123;

console.log(obj); // { [Symbol(mySymbol)]: 123 }
console.log(obj[mySymbol]); // 123
```

예전에 Symbol을 사용하는 예제에서 class의 private 속성에 접근할 수 있는 값으로 사용되는 경우를 본 적있다.

```jsx
const Github = ((_) => {
  const Private = Symbol();
  return class {
    constructor() {
      this[Private] = {
        repos: {},
      };
    }
  };
})();
```

```jsx
#message = "Howdy"
```

## Symbol 객체

---

다음은 console.dir(Symbol) 을 호출했을 때 나오는 객체다.

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952590/tlog/_2020-02-06__11.22.50_hzjfus.png)

Symbol 객체의 프로퍼티 중에 length와 prototype을 제외한 프로퍼티를 `well-known Symbol` 이라고 부른다.

asyncIterator, hasInstance 등은 내장 객체의 여러 멤버를 가르키를 정적 프로퍼티고

for, keyFor는 전역 심볼 레지스트리를 가르키는 정적 메서드인듯 하다.

### Symbol.iterator

---

모든 iterable 한 객체는 Symbol.iterator 속성을 가지고 있다.

```jsx
Array;
Array.prototype[Symbol.iterator];

String;
String.prototype[Symbol.iterator];

Map;
Map.prototype[Symbol.iterator];

Set;
Set.prototype[Symbol.iterator];
```

```jsx
// 이터러블
// Symbol.iterator를 프로퍼티 key로 사용한 메소드를 구현하여야 한다.
// 배열에는 Array.prototype[Symbol.iterator] 메소드가 구현되어 있다.
const iterable = ["a", "b", "c"];

// 이터레이터
// 이터러블의 Symbol.iterator를 프로퍼티 key로 사용한 메소드는 이터레이터를 반환한다.
const iterator = iterable[Symbol.iterator]();

// 이터레이터는 순회 가능한 자료 구조인 이터러블의 요소를 탐색하기 위한 포인터로서 value, done 프로퍼티를 갖는 객체를 반환하는 next() 함수를 메소드로 갖는 객체이다. 이터레이터의 next() 메소드를 통해 이터러블 객체를 순회할 수 있다.
console.log(iterator.next()); // { value: 'a', done: false }
console.log(iterator.next()); // { value: 'b', done: false }
console.log(iterator.next()); // { value: 'c', done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Symbol.for

---

`Symbol.for()`, `Symbol.keyFor()` 메서드는 전역 레지스트리 내 공유 심볼을 사용할 수 있다.

`Symbol('foo')` 에서 `foo` 는 큰 의미가 없지만, `Symbol.for('foo')`에서 `foo`는 특정 객체를 가져오는 key로 사용된다.

```jsx
// 전역 Symbol 레지스트리에 foo라는 키로 저장된 Symbol이 없으면 새로운 Symbol 생성
const s1 = Symbol.for("foo");
// 전역 Symbol 레지스트리에 foo라는 키로 저장된 Symbol이 있으면 해당 Symbol을 반환
const s2 = Symbol.for("foo");

console.log(s1 === s2); // true
```

```jsx
const shareSymbol = Symbol.for("myKey");
const key1 = Symbol.keyFor(shareSymbol);
console.log(key1); // myKey

const unsharedSymbol = Symbol("myKey");
const key2 = Symbol.keyFor(unsharedSymbol);
console.log(key2); // undefined
```

## Symbol은 for ... in 반복문에 포함될 수 없다.

---

```jsx
var obj = {};

obj[Symbol("a")] = "a";
obj[Symbol.for("b")] = "b";
obj["c"] = "c";
obj.d = "d";

for (var i in obj) {
  console.log(i); // logs "c" and "d"
}
Object.getOwnPropertyNames(obj); //  ["c", "d"]
Object.getOwnPropertySymbols(obj); //  [Symbol(a), Symbol(b)]
Reflect.ownKeys(obj); //  ["c", "d", Symbol(a), Symbol(b)]
```

## Symbol은 JSON.stringify() 에 포함할 수 없다.

---

```jsx
JSON.stringify({ [Symbol("foo")]: "foo" });
// '{}'
```

## warnning

---

- Symbol은 숫자와 연산할 수 없다.
- Symbol은 암묵적으로 문자열과 합칠 수 없다. (toString은 가능)

### References

---

[Iteration & for...of | PoiemaWeb](https://poiemaweb.com/es6-iteration-for-of)

[Symbol type](https://javascript.info/symbol)
