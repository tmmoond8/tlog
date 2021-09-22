---
title: ES6 - Generator
date: '2020-06-4T08:56:56.263Z'
description: Generation 함수 사용하기
image: 'https://res.cloudinary.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---

#

[Generator | PoiemaWeb](https://poiemaweb.com/es6-generator)

Generator는 Iterator 객체를 생성하는 함수다. 또한 Generator는 비동기 처리에 유용하게 사용할 수 도 있다. 먼저 Iteration 프로토콜을 간략히 살펴보자.

## Generator로 Iterator 객체 생성

---

```jsx
interface Iterable {
    [Symbol.iterator]() : Iterator;
}
interface Iterator {
    next() : IteratorResult;
}
interface IteratorResult {
    value: any;
    done: boolean;
}
```

Generator를 이용하여 짝수를 출력하는 Iteration를 간단히 만들어보자.

```jsx
function* createEvenNumberByGenerator() {
  let i = 0;
  while (true) {
    i++;
    if (i == 6) return;
    if (i % 2 === 0) yield i;
  }
}
```

### Generator 객체

Generator 함수는 일반 함수의 Retuern과 다르다. Generator 함수는 리턴으로 Generator 객체를 리턴한다.

![](https://res.cloudinary.com/dgggcrkxq/image/upload/v1631952580/tlog/_2020-02-15__12.26.46_lgiewb.png)

`Generator.prototype.next()`

`Generator.prototype.return()`

`Generator.prototype.throw()`

```jsx
interface Generator {
  next(value?: any): IteratorResult;
  throw(value?: any): IteratorResult;
  return(value?: any): IteratorResult;
}
interface IteratorResult {
  value: any;
  done: boolean;
}
```

위에서 iterator 객체를 리턴한다고 했는데, 이 Genterator 객체 안에 Iteration 프로토콜이 구현되어 있다.

```jsx
Symbol.iterator in iteratorEvenNumber; // true
"next" in iteratorEvenNumber; // true
```

### next 함수에 인자 전달

Generator를 이용한 Iterator 를 생성 하면 next에 인자를 넣을 수 있다. 다음 예제를 보자.

```jsx
function* gen(n) {
  let arg;
  arg = yield n; // n: 0 ⟸ gen 함수에 전달한 인수

  console.log(arg); // res: 1 ⟸ 두번째 next 호출 시 전달한 데이터
  arg = yield arg;

  console.log(arg); // res: 2 ⟸ 세번째 next 호출 시 전달한 데이터
  arg = yield arg;

  console.log(arg); // res: 3 ⟸ 네번째 next 호출 시 전달한 데이터
  return arg;
}
```

## Generator 함수의 정의

---

Generator 함수는 function\* 키워드로 선언 한다.

```jsx
// 제너레이터 함수 선언문
function* genDecFunc() {
  yield 1;
}

let generatorObj = genDecFunc();

// 제너레이터 함수 표현식
const genExpFunc = function*() {
  yield 1;
};

generatorObj = genExpFunc();

// 제너레이터 메소드
const obj = {
  *generatorObjMethod() {
    yield 1;
  },
};

generatorObj = obj.generatorObjMethod();

// 제너레이터 클래스 메소드
class MyClass {
  *generatorClsMethod() {
    yield 1;
  }
}

const myClass = new MyClass();
generatorObj = myClass.generatorClsMethod();
```

## Generator 함수의 호출

---

Generator 함수를 호출하면 함수의 코드 블록이 실행되는 것이 아니라 코드 블록을 iterable 하게 실행할 수 있는 Generator 객체가 리턴 된다.

```jsx
// 제너레이터 함수 정의
function* counter() {
  console.log("Point 1");
  yield 1; // 첫번째 next 메소드 호출 시 여기까지 실행된다.
  console.log("Point 2");
  yield 2; // 두번째 next 메소드 호출 시 여기까지 실행된다.
  console.log("Point 3");
  yield 3; // 세번째 next 메소드 호출 시 여기까지 실행된다.
  console.log("Point 4"); // 네번째 next 메소드 호출 시 여기까지 실행된다.
}

const generatorObj = counter();
console.log(generatorObj.next());
// Point 1
// {value: 1, done: false}

console.log(generatorObj.next());
// Point 2
// {value: 2, done: false}

console.log(generatorObj.next());
// Point 3
// {value: 3, done: false}

console.log(generatorObj.next());
// Point 4
// {value: undefined, done: true}
```

## yield\*

---

Generator 함수 안에서 `yield*` 을 만나면 다른 Generator 함수로 위임되어 진행된다.

```jsx
function* anotherGenerator(i) {
  yield i + 1;
  yield i + 2;
  yield i + 3;
}

function* generator(i) {
  yield i;
  yield* anotherGenerator(i);
  yield i + 10;
}

var gen = generator(10);

console.log(gen.next().value); // 10
console.log(gen.next().value); // 11
console.log(gen.next().value); // 12
console.log(gen.next().value); // 13
console.log(gen.next().value); // 20
```

`yield*` 는 iterable 한 객체가 와도 된다.

```jsx
function* bla() {
  yield "sequence";
  yield* ["of", "yielded"];
  yield "values";
}
```

```jsx
const primeNumbers = {
  *[Symbol.iterator]() {
    let currentPrimeNumber = 2;
    const MAX = 10;
    const isPrimeNumber = (num) => {
      for (let i = 2; i < num; i++) {
        if (num % i === 0) return false;
      }
      return true;
    };
    const getNextPrimeNumber = (num) => {
      for (let i = num + 1; i <= Infinity; i++) {
        if (isPrimeNumber(i)) return i;
      }
    };
    while (currentPrimeNumber < MAX) {
      yield currentPrimeNumber;
      currentPrimeNumber = getNextPrimeNumber(currentPrimeNumber);
    }
  },
};

const primeNumberIterator = primeNumbers[Symbol.iterator]();
console.log(primeNumberIterator.next());
console.log(primeNumberIterator.next());
console.log(primeNumberIterator.next());
console.log(primeNumberIterator.next());
console.log(primeNumberIterator.next());
console.log(primeNumberIterator.next());

for (const num of primeNumbers) {
  // for...of 내부에서 break는 가능하다.
  // if (num >= 10) break;
  console.log(num); // 1 2 3 5 8
}
```

## Generator를 활용한 비동기 처리

---

Generator를 사용하여 비동기 처리를 할 수 있는데, 코드가 꽤 장황하고 잘 읽히지가 않는다.

```jsx
const fetch = require("node-fetch");

function getUser(genObj, username) {
  fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json())
    // ① 제너레이터 객체에 비동기 처리 결과를 전달한다.
    .then((user) => genObj.next(user.name));
}

// 제너레이터 객체 생성
const g = (function*() {
  let user;
  // ② 비동기 처리 함수가 결과를 반환한다.
  // 비동기 처리의 순서가 보장된다.
  user = yield getUser(g, "jeresig");
  console.log(user); // John Resig

  user = yield getUser(g, "ahejlsberg");
  console.log(user); // Anders Hejlsberg

  user = yield getUser(g, "ungmo2");
  console.log(user); // Ungmo Lee
})();

// 제너레이터 함수 시작
g.next();
```

ES7 에 도입된 `async/await` 를 사용하면 훨씬 직관적으로 코드를 작성할 수 있다.

```jsx
// Promise를 반환하는 함수 정의
function getUser(username) {
  return fetch(`https://api.github.com/users/${username}`)
    .then((res) => res.json())
    .then((user) => user.name);
}

async function getUserAll() {
  let user;
  user = await getUser("jeresig");
  console.log(user);

  user = await getUser("ahejlsberg");
  console.log(user);

  user = await getUser("ungmo2");
  console.log(user);
}

getUserAll();
```

## TMI

---

### old generator

Old Generator는 2006년에 JavaScript 1.7에 iterators, array comprehensions, let, destructuring assignment 등과 같이 포함되었었다.

```jsx
<script type="application/javascript;version=1.7"></script>
```

위 스크립트를 사용하면 일부 환경에서 사용할 수 있었다고 한다.

### GeneratorFunction

모든 Generator 함수는 GeneratorFunction 의 인스턴스다. 특이한 점은 GeneratorFunction은 전역으로 선언되어 있지 않고 아래의 표현으로 가져올 수 있다.

```jsx
Object.getPrototypeOf(function*() {}).constructor;

var g = new GeneratorFunction("a", "yield a * 2");
var iterator = g(10);
console.log(iterator.next().value); // 20

const sum = new Function("a", "b", "return a + b");
```

Generator 는 두 개의 인터페이스를 구현 한다.

```jsx
interface Iterator { // data producer
    next() : IteratorResult;
    return?(value? : any) : IteratorResult;
}

interface Observer { // data consumer
    next(value? : any) : void;
    return(value? : any) : void;
    throw(error) : void;
}
```

## References

---

[Generator](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Generator)

[22. Generators](https://exploringjs.com/es6/ch_generators.html)
