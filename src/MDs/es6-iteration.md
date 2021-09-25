---
title: ES6 - iteration & for ... of
date: '2020-05-28T08:56:56.263Z'
description: iteration과 활용
image: 'https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1632298243/tlog/cover/_____JS_1_jbq8ea.png'
tags:
  - JavaScript
---

## 이터레이션 프로토콜

---

이터레이션 프로토콜(iteration protocol)은 데이터 컬렉션을 순회하기 위한 프로토콜이다. **이터레이션 프로토콜을 준수한 객체는 `for ... of`문으로 순회할 수 있고 `Spread` 문법으로 피연산자가 될 수 있다.**

iteration 프로토콜을 만족시키기 위해서는 세부적으로 iterable 프로토콜과 iterator 프로토콜을 구현해야 한다.

```tsx
interface Iterable {
  [Symbol.iterator](): Iterator;
}
interface Iterator {
  next(): IteratorResult;
}
interface IteratorResult {
  value: any;
  done: boolean;
}
```

![](https://noticon-static.tammolo.com/dgggcrkxq/image/upload/v1631952585/tlog/es6-iteration_brspfm.png)

### iterable

iterable 프로토콜을 준수한 객체를 이터러블이라고 한다. Symbol.iterator 속성에 iterator 를 구현한 것을 말하며, Array, String, 함수의 arguments 객체등이 이터러블이 구현되어 있다.

```jsx
const arr = [];
arr[Symbol.iterator]     // ƒ values() { [native code] }
function f() {
	arguments[Symbol.iterator]function f() {
	console.log(arguments[Symbol.iterator])
  //  ƒ values() { [native code] }
}
f('w', 'y', 'k', 'o', 'p')
```

### iterator

iterator 프로토콜은 객체 안에 next 메소드를 소유하며, next 메소드는 `{ value: Any, done: Boolean }` (iterator result)을 리턴 한다.

```jsx
let array = [1, 2, 3];
// Symbol.iterator 메소드는 이터레이터를 반환한다.
const iterator = array[Symbol.iterator]();

// 이터레이터 프로토콜을 준수한 이터레이터는 next 메소드를 갖는다.
console.log("next" in iterator); // true

// 이터레이터의 next 메소드를 호출하면 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다.
console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}

array = [1, 2, 3];
for (const number of array) {
  console.log(number);
}

array = [1, 2, 3];
const [a, b, c, d] = array[Symbol.iterator]();
console.log(a, b, c, d);
```

**Built-in iterable Object**
Array, String, Map, Set, TypedArray(Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), DOM data structure(NodeList, HTMLCollection), Arguments

## 커스텀 이터러블

간단히 소수를 리턴하는 이터러블을 구현해보았다.

```jsx
const primeNumbers = {
  [Symbol.iterator]() {
    let currentPrimeNumber = 1;
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
    return {
      next() {
        currentPrimeNumber = getNextPrimeNumber(currentPrimeNumber);
        return {
          value: currentPrimeNumber > MAX ? undefined : currentPrimeNumber,
          done: currentPrimeNumber > MAX,
        };
      },
    };
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

### 이터러블이면서 이터레이터인 객체

소수 구하는 코드를 좀 더 개선하여 max 값을 인자로 받고 이터러블 프로토콜과 이터레이터 프로토콜을 만족하는 객체를 생성하도록 변경했다.

```jsx
const primeNumbersIterableAndIterator = (max) => {
  let currentPrimeNumber = 1;
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
  return {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      currentPrimeNumber = getNextPrimeNumber(currentPrimeNumber);
      return {
        value: currentPrimeNumber > max ? undefined : currentPrimeNumber,
        done: currentPrimeNumber > max,
      };
    },
  };
};

let iter = primeNumbersIterableAndIterator(10);
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());
console.log(iter.next());

iter = primeNumbersIterableAndIterator(10);
for (const num of iter) {
  // for...of 내부에서 break는 가능하다.
  // if (num >= 10) break;
  console.log(num); // 1 2 3 5 8
}
```

TMI

- `Promise.all()`
- `Promise.race()`

```jsx
Promise.all(iterableOverPromises).then(···);
Promise.race(iterableOverPromises).then(···);
```

- `entries()` returns an iterable over entries encoded as [key, value] Arrays. For Arrays, the values are the Array elements and the keys are their indices. For Sets, each key and value are the same – the Set element.
- `keys()` returns an iterable over the keys of the entries.
- `values()` returns an iterable over the values of the entries.

- `for-of`
- `yield*`
- Destructuring
- `Array.from()`
- `Map()`, `Set()`, `WeakMap()`, `WeakSet()`

## 21.7 FAQ: iterables and iterators

- 21.7.1 Isn’t the iteration protocol slow? 엔진에서 최적화를 해주기 때문에 느리지 않다.

  You may be worried about the iteration protocol being slow, because a new object is created for each invocation of `next()`. However, memory management for small objects is fast in modern engines and in the long run, engines can optimize iteration so that no intermediate objects need to be allocated. A [thread on es-discuss](https://esdiscuss.org/topic/performance-of-iterator-next-as-specified) has more information.

- 21.7.2 Can I reuse the same object several times?

  In principle, nothing prevents an iterator from reusing the same iteration result object several times – I’d expect most things to work well. However, there will be problems if a client caches iteration results:

  ```js
  const iterationResults = [];
  const iterator = iterable[Symbol.iterator]();
  let iterationResult;
  while (!(iterationResult = iterator.next()).done) {
    iterationResults.push(iterationResult);
  }
  ```

  If an iterator reuses its iteration result object, `iterationResults` will, in general, contain the same object multiple times.

- 21.7.3 Why doesn’t ECMAScript 6 have iterable combinators?

  You may be wondering why ECMAScript 6 does not have *iterable combinators*, tools for working with iterables or for creating iterables. That is because the plans are to proceed in two steps:

  - Step 1: standardize an iteration protocol.
  - Step 2: wait for libraries based on that protocol.

  Eventually, one such library or pieces from several libraries will be added to the JavaScript standard library.

  If you want to get an impression of what such a library could look like, take a look at the standard Python module `[itertools](https://docs.python.org/3/library/itertools.html)`.

### References

---

[Iteration & for...of | PoiemaWeb](https://poiemaweb.com/es6-iteration-for-of)

[Iterables](https://javascript.info/iterable)

[21. Iterables and iterators](https://exploringjs.com/es6/ch_iteration.html)

###
